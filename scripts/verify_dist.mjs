import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { lstat, readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ts = require('@vercel/node/node_modules/typescript');

const measurementId = 'G-9LS1G2PR3R';
const jsBudgetBytes = 100 * 1024;
const cssBudgetBytes = 25 * 1024;
const fingerprintedAssetPattern = /^assets\/index-([A-Za-z0-9_-]{8,})\.(js|css)$/;
// Self-hosted design-system typefaces plus the OFL licences they ship under.
// Fonts are static, non-executable payload: never referenced from HTML, only
// from the first-party stylesheet's @font-face rules.
const fontAssetPattern = /^assets\/fonts\/(?:[a-z0-9-]+\.woff2|OFL-[a-z0-9-]+\.txt)$/;
// Crawler metadata. Served as a real file so /robots.txt is not swallowed by
// the SPA rewrite and returned as HTML, which is what made every audit report
// an invalid robots.txt. Static, non-executable, and referenced by crawlers
// rather than from the document, so it is exempt from the HTML-reference rule.
const staticRootPattern = /^(?:robots\.txt|sitemap\.xml|404\.html)$/;
// Loudness-matched A/B renders. Static media: never referenced from a
// script, only from <audio src>, and excluded from the executable-content
// scan because decoding AAC as UTF-8 produces meaningless matches.
const audioAssetPattern = /^audio\/[a-z0-9-]+\.(?:m4a|opus)$/;
const imageAssetPattern = /^images\/[a-z0-9-]+\.webp$/;
const woff2Signature = Buffer.from('wOF2', 'ascii');
// A WebP file is a RIFF container whose form type is WEBP: 'RIFF' at byte 0,
// the payload length, then 'WEBP' at byte 8.
const riffSignature = Buffer.from('RIFF', 'ascii');
const webpFormType = Buffer.from('WEBP', 'ascii');

const fail = (contract, detail) => {
  throw new Error(`[${contract}] ${detail}`);
};

const countMatches = (text, expression) => [...text.matchAll(expression)].length;

const hasMeaningfulFingerprint = (fingerprint) => (
  fingerprint.length >= 8
  && (fingerprint.match(/[A-Za-z0-9]/g) ?? []).length >= 6
  && new Set(fingerprint).size >= 6
);

const verifyFingerprint = (assetPath, expectedExtension) => {
  const match = assetPath.match(fingerprintedAssetPattern);
  if (!match || match[2] !== expectedExtension || !hasMeaningfulFingerprint(match[1])) {
    fail(
      'FINGERPRINT_CONTRACT',
      `${assetPath} must contain a meaningful content fingerprint and end in .${expectedExtension}`,
    );
  }
};

const parseAttributes = (source) => {
  const attributes = new Map();
  const attributePattern = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const match of source.matchAll(attributePattern)) {
    const name = match[1].toLowerCase();
    if (attributes.has(name)) fail('HTML_ASSET_RESOLUTION', `duplicate HTML attribute: ${name}`);
    attributes.set(name, match[2] ?? match[3] ?? match[4] ?? '');
  }

  return attributes;
};

const toPosixPath = (value) => value.split(path.sep).join('/');

const listOutput = async (rootDirectory) => {
  const files = [];
  const directories = [];

  const visit = async (directory) => {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      fail('STRUCTURAL_OUTPUT', `cannot read output directory ${directory}: ${error.message}`);
    }

    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);
      const relativePath = toPosixPath(path.relative(rootDirectory, absolutePath));

      if (entry.isSymbolicLink()) fail('OUTPUT_ALLOWLIST', `symbolic links are not permitted: ${relativePath}`);
      if (entry.isDirectory()) {
        directories.push(relativePath);
        await visit(absolutePath);
      } else if (entry.isFile()) {
        files.push(relativePath);
      } else {
        fail('OUTPUT_ALLOWLIST', `unsupported filesystem entry: ${relativePath}`);
      }
    }
  };

  await visit(rootDirectory);
  return { files: files.sort(), directories: directories.sort() };
};

const isExternalReference = (reference) => /^(?:https?:)?\/\//i.test(reference);

const normalizeLocalReference = async (reference, rootDirectory, context) => {
  if (!reference) fail('HTML_ASSET_RESOLUTION', `${context} has an empty asset reference`);
  if (/[?#]/.test(reference)) {
    fail('HTML_ASSET_RESOLUTION', `${context} must not use a query string or fragment: ${reference}`);
  }
  if (reference.includes('\\') || reference.includes('\0')) {
    fail('HTML_ASSET_RESOLUTION', `${context} contains an unsafe path separator or NUL: ${reference}`);
  }

  let decoded;
  try {
    decoded = decodeURIComponent(reference);
  } catch {
    fail('HTML_ASSET_RESOLUTION', `${context} contains invalid percent encoding: ${reference}`);
  }

  if (decoded.split('/').includes('..')) {
    fail('HTML_ASSET_RESOLUTION', `${context} attempts to escape the output root: ${reference}`);
  }

  const normalized = path.posix.normalize(decoded.replace(/^\/+/, '').replace(/^\.\//, ''));
  if (!normalized || normalized === '.' || normalized.startsWith('../')) {
    fail('HTML_ASSET_RESOLUTION', `${context} does not resolve to an output asset: ${reference}`);
  }

  const absolutePath = path.resolve(rootDirectory, ...normalized.split('/'));
  const relativePath = path.relative(rootDirectory, absolutePath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    fail('HTML_ASSET_RESOLUTION', `${context} resolves outside the output root: ${reference}`);
  }

  let metadata;
  try {
    metadata = await lstat(absolutePath);
  } catch {
    fail('HTML_ASSET_RESOLUTION', `${context} references a missing asset: ${normalized}`);
  }
  if (!metadata.isFile() || metadata.isSymbolicLink()) {
    fail('HTML_ASSET_RESOLUTION', `${context} must resolve to a regular file: ${normalized}`);
  }

  return { normalized, absolutePath };
};

const verifyOfficialGoogleTagUrl = (source) => {
  let url;
  try {
    url = new URL(source);
  } catch {
    fail('GA4_EXACTNESS', `invalid external script URL: ${source}`);
  }

  const parameters = [...url.searchParams.entries()];
  if (
    url.protocol !== 'https:'
    || url.hostname !== 'www.googletagmanager.com'
    || url.port !== ''
    || url.username !== ''
    || url.password !== ''
    || url.pathname !== '/gtag/js'
    || url.hash !== ''
    || parameters.length !== 1
    || parameters[0][0] !== 'id'
    || parameters[0][1] !== measurementId
  ) {
    fail('GA4_EXACTNESS', `unapproved Google tag URL or parameters: ${source}`);
  }
};

const unwrapExpression = (expression) => {
  let current = expression;
  while (
    ts.isParenthesizedExpression(current)
    || ts.isAsExpression(current)
    || ts.isNonNullExpression(current)
    || ts.isSatisfiesExpression(current)
    || ts.isTypeAssertionExpression(current)
  ) {
    current = current.expression;
  }
  return current;
};

const collectLexicalBindings = (sourceFile) => {
  const scopes = new WeakMap();
  const rootScope = { parent: null, bindings: new Map(), functionScope: true };

  const declare = (scope, name) => {
    if (!scope.bindings.has(name)) scope.bindings.set(name, { name, sources: [] });
    return scope.bindings.get(name);
  };

  const lookup = (scope, name) => {
    for (let current = scope; current; current = current.parent) {
      if (current.bindings.has(name)) return current.bindings.get(name);
    }
    return null;
  };

  const staticBindingPropertyName = (element) => {
    const property = element.propertyName ?? element.name;
    if (ts.isIdentifier(property) || ts.isStringLiteralLike(property)) return property.text;
    if (ts.isComputedPropertyName(property)) {
      const resolveComputedText = (expression) => {
        const node = unwrapExpression(expression);
        if (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
        if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
          const left = resolveComputedText(node.left);
          const right = resolveComputedText(node.right);
          return left === null || right === null ? null : left + right;
        }
        return null;
      };
      return resolveComputedText(property.expression);
    }
    return null;
  };

  const registerPattern = (pattern, initializer, scope) => {
    if (ts.isIdentifier(pattern)) {
      const binding = declare(scope, pattern.text);
      if (initializer) binding.sources.push({ kind: 'expression', expression: initializer });
      return;
    }
    if (ts.isObjectBindingPattern(pattern)) {
      for (const element of pattern.elements) {
        if (element.dotDotDotToken || !ts.isIdentifier(element.name)) {
          registerPattern(element.name, null, scope);
          continue;
        }
        const property = staticBindingPropertyName(element);
        const binding = declare(scope, element.name.text);
        if (initializer && property) {
          binding.sources.push({ kind: 'property', base: initializer, property });
        }
      }
      return;
    }
    if (ts.isArrayBindingPattern(pattern)) {
      for (const element of pattern.elements) {
        if (ts.isBindingElement(element)) registerPattern(element.name, null, scope);
      }
    }
  };

  const declarationScope = (node, scope) => {
    const list = node.parent;
    if (!ts.isVariableDeclarationList(list) || (list.flags & ts.NodeFlags.BlockScoped)) return scope;
    let current = scope;
    while (current.parent && !current.functionScope) current = current.parent;
    return current;
  };

  const visit = (node, scope, reuseScope = false) => {
    scopes.set(node, scope);

    if (ts.isFunctionDeclaration(node) && node.name) declare(scope, node.name.text);
    if (ts.isClassDeclaration(node) && node.name) declare(scope, node.name.text);

    if (ts.isFunctionLike(node)) {
      const functionScope = { parent: scope, bindings: new Map(), functionScope: true };
      if (ts.isFunctionExpression(node) && node.name) declare(functionScope, node.name.text);
      for (const parameter of node.parameters) {
        registerPattern(parameter.name, parameter.initializer ?? null, functionScope);
        if (parameter.initializer) visit(parameter.initializer, functionScope);
      }
      if (node.body) visit(node.body, functionScope, true);
      return;
    }

    if (ts.isBlock(node) && !reuseScope) {
      const blockScope = { parent: scope, bindings: new Map(), functionScope: false };
      for (const statement of node.statements) visit(statement, blockScope);
      return;
    }

    if (ts.isVariableDeclaration(node)) {
      registerPattern(node.name, node.initializer ?? null, declarationScope(node, scope));
      if (node.initializer) visit(node.initializer, scope);
      return;
    }

    ts.forEachChild(node, (child) => visit(child, scope));
  };

  visit(sourceFile, rootScope, true);

  const assignmentOperators = new Set([
    ts.SyntaxKind.EqualsToken,
    ts.SyntaxKind.AmpersandAmpersandEqualsToken,
    ts.SyntaxKind.BarBarEqualsToken,
    ts.SyntaxKind.QuestionQuestionEqualsToken,
  ]);
  const collectAssignments = (node) => {
    if (ts.isBinaryExpression(node) && assignmentOperators.has(node.operatorToken.kind)) {
      const left = unwrapExpression(node.left);
      if (ts.isIdentifier(left)) {
        const binding = lookup(scopes.get(node), left.text);
        if (binding) binding.sources.push({ kind: 'expression', expression: node.right });
      } else if (ts.isObjectLiteralExpression(left)) {
        for (const property of left.properties) {
          if (ts.isShorthandPropertyAssignment(property)) {
            const binding = lookup(scopes.get(node), property.name.text);
            if (binding) binding.sources.push({ kind: 'property', base: node.right, property: property.name.text });
          } else if (ts.isPropertyAssignment(property)) {
            const propertyName = property.name && (ts.isIdentifier(property.name) || ts.isStringLiteralLike(property.name))
              ? property.name.text
              : null;
            const target = unwrapExpression(property.initializer);
            if (propertyName && ts.isIdentifier(target)) {
              const binding = lookup(scopes.get(node), target.text);
              if (binding) binding.sources.push({ kind: 'property', base: node.right, property: propertyName });
            }
          }
        }
      }
    }
    ts.forEachChild(node, collectAssignments);
  };
  collectAssignments(sourceFile);

  return { scopes, lookup };
};

const verifyJavaScriptSemantics = (file, source, outputFiles) => {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const parseDiagnostics = sourceFile.parseDiagnostics ?? [];
  if (parseDiagnostics.length > 0) {
    const detail = ts.flattenDiagnosticMessageText(parseDiagnostics[0].messageText, ' ');
    fail('JAVASCRIPT_AST', `${file} cannot be parsed safely: ${detail}`);
  }

  const bindings = collectLexicalBindings(sourceFile);
  const scopeOf = (node) => bindings.scopes.get(node) ?? bindings.scopes.get(sourceFile);
  const bindingFor = (identifier) => bindings.lookup(scopeOf(identifier), identifier.text);
  const staticStringCache = new WeakMap();
  const windowBindingCache = new WeakMap();
  const documentBindingCache = new WeakMap();
  const createElementBindingCache = new WeakMap();
  const scriptNodeBindingCache = new WeakMap();
  const prohibitedLiteralBindingCache = new WeakMap();
  const globalCallableCaches = new Map();

  const resolveStaticString = (expression, seen = new Set()) => {
    const node = unwrapExpression(expression);
    if (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      const left = resolveStaticString(node.left, new Set(seen));
      const right = resolveStaticString(node.right, new Set(seen));
      return left === null || right === null ? null : left + right;
    }
    if (ts.isConditionalExpression(node)) {
      const whenTrue = resolveStaticString(node.whenTrue, new Set(seen));
      const whenFalse = resolveStaticString(node.whenFalse, new Set(seen));
      return whenTrue !== null && whenTrue === whenFalse ? whenTrue : null;
    }
    if (ts.isIdentifier(node)) {
      const binding = bindingFor(node);
      if (!binding || seen.has(binding) || binding.sources.length === 0) return null;
      if (staticStringCache.has(binding)) return staticStringCache.get(binding);
      const nextSeen = new Set(seen).add(binding);
      const values = binding.sources.map((candidate) => (
        candidate.kind === 'expression'
          ? resolveStaticString(candidate.expression, new Set(nextSeen))
          : null
      ));
      const resolved = values.length > 0 && values.every((value) => value !== null && value === values[0])
        ? values[0]
        : null;
      staticStringCache.set(binding, resolved);
      return resolved;
    }
    return null;
  };

  const getMember = (expression) => {
    const node = unwrapExpression(expression);
    if (ts.isPropertyAccessExpression(node)) return { object: node.expression, property: node.name.text };
    if (ts.isElementAccessExpression(node) && node.argumentExpression) {
      const property = resolveStaticString(node.argumentExpression);
      return property === null ? null : { object: node.expression, property };
    }
    return null;
  };

  const sourceCanResolve = (binding, predicate, seen) => {
    if (!binding || seen.has(binding)) return false;
    const nextSeen = new Set(seen).add(binding);
    return binding.sources.some((candidate) => predicate(candidate, nextSeen));
  };

  const isUnboundGlobal = (node, name) => (
    ts.isIdentifier(node) && node.text === name && bindingFor(node) === null
  );

  const isWindowExpression = (expression, seen = new Set()) => {
    const node = unwrapExpression(expression);
    if (['window', 'globalThis', 'self'].some((name) => isUnboundGlobal(node, name))) return true;
    if (!ts.isIdentifier(node)) return false;
    const binding = bindingFor(node);
    if (!binding) return false;
    if (windowBindingCache.has(binding)) return windowBindingCache.get(binding);
    const resolved = sourceCanResolve(binding, (candidate, nextSeen) => (
      candidate.kind === 'expression' && isWindowExpression(candidate.expression, nextSeen)
    ), seen);
    windowBindingCache.set(binding, resolved);
    return resolved;
  };

  const isDocumentExpression = (expression, seen = new Set()) => {
    const node = unwrapExpression(expression);
    if (isUnboundGlobal(node, 'document')) return true;
    const member = getMember(node);
    if (member?.property === 'document' && isWindowExpression(member.object, seen)) return true;
    if (!ts.isIdentifier(node)) return false;
    const binding = bindingFor(node);
    if (!binding) return false;
    if (documentBindingCache.has(binding)) return documentBindingCache.get(binding);
    const resolved = sourceCanResolve(binding, (candidate, nextSeen) => {
      if (candidate.kind === 'expression') return isDocumentExpression(candidate.expression, nextSeen);
      return candidate.property === 'document' && isWindowExpression(candidate.base, nextSeen);
    }, seen);
    documentBindingCache.set(binding, resolved);
    return resolved;
  };

  const isCreateElementReference = (expression, seen = new Set()) => {
    const node = unwrapExpression(expression);
    const member = getMember(node);
    if (member?.property === 'createElement' && isDocumentExpression(member.object, seen)) return true;
    if (ts.isCallExpression(node)) {
      const bindMember = getMember(node.expression);
      if (bindMember?.property === 'bind' && isCreateElementReference(bindMember.object, seen)) return true;
    }
    if (!ts.isIdentifier(node)) return false;
    const binding = bindingFor(node);
    if (!binding) return false;
    if (createElementBindingCache.has(binding)) return createElementBindingCache.get(binding);
    const resolved = sourceCanResolve(binding, (candidate, nextSeen) => {
      if (candidate.kind === 'expression') return isCreateElementReference(candidate.expression, nextSeen);
      return candidate.property === 'createElement' && isDocumentExpression(candidate.base, nextSeen);
    }, seen);
    createElementBindingCache.set(binding, resolved);
    return resolved;
  };

  const createElementArgument = (call) => {
    if (isCreateElementReference(call.expression)) return call.arguments[0] ?? null;
    const invocation = getMember(call.expression);
    if (invocation && ['call', 'apply'].includes(invocation.property)) {
      if (isCreateElementReference(invocation.object)) {
        if (invocation.property === 'call') return call.arguments[1] ?? null;
        const appliedArguments = call.arguments[1] ? unwrapExpression(call.arguments[1]) : null;
        if (!appliedArguments || !ts.isArrayLiteralExpression(appliedArguments)) return null;
        return appliedArguments.elements[0] ?? null;
      }
    }
    if (isGlobalObjectMethod(call.expression, 'Reflect', 'apply')) {
      if (!call.arguments[0] || !isCreateElementReference(call.arguments[0])) return undefined;
      const appliedArguments = call.arguments[2] ? unwrapExpression(call.arguments[2]) : null;
      if (!appliedArguments || !ts.isArrayLiteralExpression(appliedArguments)) return null;
      return appliedArguments.elements[0] ?? null;
    }
    return undefined;
  };

  const expressionIsScriptNode = (expression, seen = new Set()) => {
    const node = unwrapExpression(expression);
    if (ts.isCallExpression(node)) {
      const argument = createElementArgument(node);
      return argument !== undefined && (
        argument === null || resolveStaticString(argument)?.toLowerCase() === 'script'
      );
    }
    if (!ts.isIdentifier(node)) return false;
    const binding = bindingFor(node);
    if (!binding) return false;
    if (scriptNodeBindingCache.has(binding)) return scriptNodeBindingCache.get(binding);
    const resolved = sourceCanResolve(binding, (candidate, nextSeen) => (
      candidate.kind === 'expression' && expressionIsScriptNode(candidate.expression, nextSeen)
    ), seen);
    scriptNodeBindingCache.set(binding, resolved);
    return resolved;
  };

  const prohibitedUrlPattern = /^(?:https?:|\/\/|data:|javascript:|blob:|file:)/i;
  const containsProhibitedLiteral = (expression, seen = new Set()) => {
    const node = unwrapExpression(expression);
    if (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      return prohibitedUrlPattern.test(node.text.trim());
    }
    if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node) || ts.isCallExpression(node)) {
      return false;
    }
    if (ts.isIdentifier(node)) {
      const binding = bindingFor(node);
      if (!binding || binding.sources.length === 0) return false;
      if (prohibitedLiteralBindingCache.has(binding)) return prohibitedLiteralBindingCache.get(binding);
      const resolved = sourceCanResolve(binding, (candidate, nextSeen) => (
        candidate.kind === 'expression' && containsProhibitedLiteral(candidate.expression, nextSeen)
      ), seen);
      prohibitedLiteralBindingCache.set(binding, resolved);
      return resolved;
    }
    let found = false;
    ts.forEachChild(node, (child) => {
      if (!found && containsProhibitedLiteral(child, new Set(seen))) found = true;
    });
    return found;
  };

  const enforceScriptSource = (value, receiver, context) => {
    if (!value) fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: ${context} is missing its source value`);
    const resolved = resolveStaticString(value);
    if (
      (resolved !== null && prohibitedUrlPattern.test(resolved.trim()))
      || containsProhibitedLiteral(value)
    ) {
      fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: ${context} contains a prohibited code-loading URL`);
    }
    if (resolved === null && expressionIsScriptNode(receiver)) {
      fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: ${context} uses a non-static script source`);
    }
  };

  const objectProperty = (objectLiteral, propertyName) => {
    for (const property of objectLiteral.properties) {
      if (ts.isSpreadAssignment(property)) continue;
      const name = property.name
        ? (ts.isComputedPropertyName(property.name)
          ? resolveStaticString(property.name.expression)
          : property.name.text)
        : null;
      if (name !== propertyName) continue;
      if (ts.isPropertyAssignment(property)) return property.initializer;
      if (ts.isShorthandPropertyAssignment(property)) return property.name;
    }
    return null;
  };

  const globalObjectMethodCaches = new Map();
  const isGlobalObjectMethod = (expression, objectName, methodName, seen = new Set()) => {
    const node = unwrapExpression(expression);
    const member = getMember(node);
    if (member?.property === methodName && isUnboundGlobal(unwrapExpression(member.object), objectName)) return true;
    if (!ts.isIdentifier(node)) return false;
    const binding = bindingFor(node);
    if (!binding || seen.has(binding)) return false;
    const key = `${objectName}.${methodName}`;
    if (!globalObjectMethodCaches.has(key)) globalObjectMethodCaches.set(key, new WeakMap());
    const cache = globalObjectMethodCaches.get(key);
    if (cache.has(binding)) return cache.get(binding);
    const nextSeen = new Set(seen).add(binding);
    const resolved = binding.sources.some((candidate) => (
      candidate.kind === 'expression'
        ? isGlobalObjectMethod(candidate.expression, objectName, methodName, nextSeen)
        : candidate.property === methodName && isUnboundGlobal(unwrapExpression(candidate.base), objectName)
    ));
    cache.set(binding, resolved);
    return resolved;
  };

  const arrayArguments = (expression) => {
    const node = expression ? unwrapExpression(expression) : null;
    return node && ts.isArrayLiteralExpression(node) ? [...node.elements] : null;
  };

  const normalizeInvocation = (call) => {
    const member = getMember(call.expression);
    if (member?.property === 'call') {
      return { callable: member.object, thisArg: call.arguments[0] ?? null, arguments: [...call.arguments.slice(1)] };
    }
    if (member?.property === 'apply') {
      return { callable: member.object, thisArg: call.arguments[0] ?? null, arguments: arrayArguments(call.arguments[1]) };
    }
    if (isGlobalObjectMethod(call.expression, 'Reflect', 'apply')) {
      return { callable: call.arguments[0] ?? null, thisArg: call.arguments[1] ?? null, arguments: arrayArguments(call.arguments[2]) };
    }
    return { callable: call.expression, thisArg: null, arguments: [...call.arguments] };
  };

  const verifyDynamicImport = (call) => {
    const argument = call.arguments[0];
    if (!argument) fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: dynamic import is missing a module specifier`);
    const unwrapped = unwrapExpression(argument);
    if (ts.isIdentifier(unwrapped) || ts.isTemplateExpression(unwrapped)) {
      fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: dynamic import must not use a variable or interpolated template`);
    }
    const specifier = resolveStaticString(unwrapped);
    if (specifier === null) {
      fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: dynamic import is not statically reducible`);
    }
    const lowerSpecifier = specifier.toLowerCase();
    if (
      (!specifier.startsWith('./') && !specifier.startsWith('../'))
      || ['http:', 'https:', '//', 'data:', 'javascript:', 'blob:', 'file:'].some((token) => lowerSpecifier.includes(token))
      || specifier.includes('\\')
      || /[?#\0]/.test(specifier)
    ) {
      fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: dynamic import is not an approved local relative path: ${specifier}`);
    }
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));
    if (resolved.startsWith('../') || !resolved.endsWith('.js') || !outputFiles.has(resolved)) {
      fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: dynamic import is outside the verified local asset graph: ${specifier}`);
    }
  };

  const isGlobalCallable = (expression, name, seen = new Set()) => {
    const node = unwrapExpression(expression);
    if (isUnboundGlobal(node, name)) return true;
    const member = getMember(node);
    if (member?.property === name && isWindowExpression(member.object, seen)) return true;
    if (!ts.isIdentifier(node)) return false;
    const binding = bindingFor(node);
    if (!binding) return false;
    if (!globalCallableCaches.has(name)) globalCallableCaches.set(name, new WeakMap());
    const cache = globalCallableCaches.get(name);
    if (cache.has(binding)) return cache.get(binding);
    const resolved = sourceCanResolve(binding, (candidate, nextSeen) => (
      candidate.kind === 'expression' && isGlobalCallable(candidate.expression, name, nextSeen)
    ), seen);
    cache.set(binding, resolved);
    return resolved;
  };

  const verifyWorkerLikeCall = (call, name) => {
    const argument = call.arguments[0];
    if (!argument) fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: ${name} is missing a script URL`);
    const unwrapped = unwrapExpression(argument);
    const specifier = resolveStaticString(unwrapped);
    if (specifier === null || prohibitedUrlPattern.test(specifier.trim())) {
      fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: ${name} uses a remote or non-static script URL`);
    }
    if (!specifier.startsWith('./') && !specifier.startsWith('../')) {
      fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: ${name} must use a verified local relative script URL`);
    }
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));
    if (resolved.startsWith('../') || !resolved.endsWith('.js') || !outputFiles.has(resolved)) {
      fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: ${name} script URL is outside the verified local asset graph`);
    }
  };

  const visit = (node) => {
    if (ts.isCallExpression(node)) {
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword) verifyDynamicImport(node);

      const invocation = normalizeInvocation(node);
      const invocationArguments = invocation.arguments;

      const tagArgument = createElementArgument(node);
      if (tagArgument !== undefined) {
        const tagName = tagArgument === null ? null : resolveStaticString(tagArgument);
        if (tagName === null || tagName.toLowerCase() === 'script') {
          fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: script element construction is prohibited`);
        }
      }

      const callMember = invocation.callable ? getMember(invocation.callable) : null;
      if (callMember?.property === 'setAttribute') {
        if (!invocationArguments) fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: setAttribute apply arguments are not static`);
        const attributeName = invocationArguments[0] ? resolveStaticString(invocationArguments[0]) : null;
        if (attributeName?.toLowerCase() === 'src') {
          enforceScriptSource(invocationArguments[1], callMember.object, 'setAttribute(src)');
        } else if (attributeName === null && expressionIsScriptNode(callMember.object)) {
          fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: script setAttribute name is not static`);
        }
      }

      if (invocation.callable && isGlobalObjectMethod(invocation.callable, 'Object', 'assign')) {
        if (!invocationArguments) fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: Object.assign apply arguments are not static`);
        const receiver = invocationArguments[0];
        for (const sourceObject of invocationArguments.slice(1)) {
          const unwrapped = unwrapExpression(sourceObject);
          if (!ts.isObjectLiteralExpression(unwrapped)) {
            if (receiver && expressionIsScriptNode(receiver)) {
              fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: Object.assign source for a script node is not static`);
            }
            continue;
          }
          const src = objectProperty(unwrapped, 'src');
          if (src) enforceScriptSource(src, receiver, 'Object.assign src');
        }
      }

      if (invocation.callable && isGlobalObjectMethod(invocation.callable, 'Object', 'defineProperty')) {
        const propertyName = node.arguments[1] ? resolveStaticString(node.arguments[1]) : null;
        if (propertyName?.toLowerCase() === 'src') {
          const descriptor = node.arguments[2] ? unwrapExpression(node.arguments[2]) : null;
          const value = descriptor && ts.isObjectLiteralExpression(descriptor)
            ? objectProperty(descriptor, 'value')
            : null;
          enforceScriptSource(value, node.arguments[0], 'Object.defineProperty src');
        }
      }

      if (invocation.callable && isGlobalObjectMethod(invocation.callable, 'Object', 'defineProperties')) {
        const descriptors = node.arguments[1] ? unwrapExpression(node.arguments[1]) : null;
        if (descriptors && ts.isObjectLiteralExpression(descriptors)) {
          const srcDescriptor = objectProperty(descriptors, 'src');
          const descriptor = srcDescriptor ? unwrapExpression(srcDescriptor) : null;
          const value = descriptor && ts.isObjectLiteralExpression(descriptor)
            ? objectProperty(descriptor, 'value')
            : null;
          if (srcDescriptor) enforceScriptSource(value, node.arguments[0], 'Object.defineProperties src');
        }
      }

      if (invocation.callable && isGlobalObjectMethod(invocation.callable, 'Reflect', 'set')) {
        if (!invocationArguments) fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: Reflect.set apply arguments are not static`);
        const propertyName = invocationArguments[1] ? resolveStaticString(invocationArguments[1]) : null;
        if (propertyName?.toLowerCase() === 'src') {
          enforceScriptSource(invocationArguments[2], invocationArguments[0], 'Reflect.set src');
        }
      }

      if (invocation.callable && isGlobalCallable(invocation.callable, 'eval')) {
        fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: eval is prohibited in emitted JavaScript`);
      }
      if (isGlobalCallable(node.expression, 'importScripts')) {
        for (const argument of node.arguments) verifyWorkerLikeCall({ arguments: [argument] }, 'importScripts');
      }
      for (const workerName of ['Worker', 'SharedWorker']) {
        if (isGlobalCallable(node.expression, workerName)) verifyWorkerLikeCall(node, workerName);
      }
      if (invocation.callable && isGlobalCallable(invocation.callable, 'Function')) {
        const values = (invocationArguments ?? []).map((argument) => resolveStaticString(argument));
        const remoteSourcePattern = /(?:https?:|\/\/|data:|javascript:|blob:|file:|\bimport\s*\(|\bimportScripts\s*\(|\beval\s*\(|createElement\s*\(|\.src\s*=)/i;
        if (!invocationArguments || values.some((value) => value === null) || values.some((value) => remoteSourcePattern.test(value))) {
          fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: Function constructor contains non-static or code-loading source`);
        }
      }
    }

    if (ts.isNewExpression(node)) {
      for (const workerName of ['Worker', 'SharedWorker']) {
        if (isGlobalCallable(node.expression, workerName)) verifyWorkerLikeCall(node, workerName);
      }
      if (isGlobalCallable(node.expression, 'Function')) {
        const argumentsList = node.arguments ?? [];
        const values = argumentsList.map((argument) => resolveStaticString(argument));
        const remoteSourcePattern = /(?:https?:|\/\/|data:|javascript:|blob:|file:|\bimport\s*\(|\bimportScripts\s*\(|\beval\s*\(|createElement\s*\(|\.src\s*=)/i;
        if (values.some((value) => value === null) || values.some((value) => remoteSourcePattern.test(value))) {
          fail('DYNAMIC_EXTERNAL_SCRIPT', `${file}: Function constructor contains non-static or code-loading source`);
        }
      }
    }

    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      const target = getMember(node.left);
      if (target?.property.toLowerCase() === 'src') {
        enforceScriptSource(node.right, target.object, 'src assignment');
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
};

// ---------------------------------------------------------------------------
// SEO route and metadata contract.
//
// Every defect this asserts against was live in production at once: no
// canonical anywhere, a sitemap advertising a page that had been deleted, a
// JSON-LD component that was never imported and could not have survived the
// prerender even if it had been, a meta keywords tag, and an H1 whose two
// halves had fused because JSX drops whitespace containing a newline. They are
// invisible in a browser and only a crawler pays for them, which is exactly
// the class of defect that needs a build gate rather than review.
const CANONICAL_ORIGIN = 'https://www.tempodelay.tech';
const CANONICAL_URL = `${CANONICAL_ORIGIN}/`;
const ORGANIZATION_ID = 'https://studiozio.vercel.app/#organization';

const singleTag = (html, pattern, contract, label) => {
  const found = [...html.matchAll(pattern)];
  if (found.length !== 1) fail(contract, `expected exactly one ${label}, found ${found.length}`);
  return found[0];
};

const verifySeoContract = async (rootDirectory, indexHtml) => {
  // -- one of each head element that identifies the page -------------------
  const title = singleTag(indexHtml, /<title>([^<]*)<\/title>/gi, 'SEO_HEAD', '<title>')[1].trim();
  if (title.length < 20 || title.length > 65) {
    fail('SEO_HEAD', `title should read as a full result line, 20-65 chars; got ${title.length}: ${title}`);
  }
  if (!title.startsWith('StudioZIO ')) {
    fail('SEO_HEAD', `title must lead with the brand -- "Tempo Delay" alone collides with another vendor's plug-in: ${title}`);
  }
  const description = singleTag(indexHtml, /<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/gi, 'SEO_HEAD', 'meta description')[1];
  if (description.length < 70 || description.length > 165) {
    fail('SEO_HEAD', `meta description should be 70-165 chars; got ${description.length}`);
  }

  // -- canonical must be the final 200 URL, not a redirect ------------------
  const canonical = singleTag(indexHtml, /<link\s+rel="canonical"\s+href="([^"]*)"\s*\/?>/gi, 'SEO_CANONICAL', 'rel=canonical')[1];
  if (canonical !== CANONICAL_URL) {
    fail('SEO_CANONICAL', `canonical must be exactly ${CANONICAL_URL}; got ${canonical}`);
  }

  // -- social cards, both complete -----------------------------------------
  for (const [pattern, label] of [
    [/<meta\s+property="og:title"/gi, 'og:title'],
    [/<meta\s+property="og:description"/gi, 'og:description'],
    [/<meta\s+property="og:url"/gi, 'og:url'],
    [/<meta\s+property="og:image"/gi, 'og:image'],
    [/<meta\s+name="twitter:card"/gi, 'twitter:card'],
    [/<meta\s+name="twitter:title"/gi, 'twitter:title'],
    [/<meta\s+name="twitter:description"/gi, 'twitter:description'],
    [/<meta\s+name="twitter:image"/gi, 'twitter:image'],
  ]) singleTag(indexHtml, pattern, 'SEO_SOCIAL', label);

  const ogUrl = /<meta\s+property="og:url"\s+content="([^"]*)"/i.exec(indexHtml)[1];
  if (ogUrl !== canonical) fail('SEO_SOCIAL', `og:url (${ogUrl}) must equal the canonical (${canonical})`);

  // Every social image must be a file this build actually produced, so a card
  // can never point at an asset that exists on no origin of ours.
  for (const match of indexHtml.matchAll(/<meta\s+(?:property="og:image"|name="twitter:image")\s+content="([^"]*)"/gi)) {
    const url = match[1];
    if (!url.startsWith(`${CANONICAL_ORIGIN}/`)) fail('SEO_SOCIAL', `social image must be self-hosted: ${url}`);
    const relative = url.slice(CANONICAL_ORIGIN.length + 1);
    try {
      await readFile(path.join(rootDirectory, relative));
    } catch {
      fail('SEO_SOCIAL', `social image is not in the build output: ${relative}`);
    }
  }

  // -- forbidden tags -------------------------------------------------------
  if (/<meta\s+name="keywords"/i.test(indexHtml)) {
    fail('SEO_HEAD', 'meta keywords is ignored by every engine and forbidden across this estate');
  }
  if (/<meta\s+name="robots"[^>]*noindex/i.test(indexHtml)) {
    fail('SEO_HEAD', 'the production document must not carry noindex');
  }

  // -- exactly one H1, and its text must not have fused across a JSX newline -
  const h1 = singleTag(indexHtml, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, 'SEO_HEADINGS', '<h1>');
  const h1Text = h1[1].replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
  if (h1Text.length < 10) fail('SEO_HEADINGS', `h1 text is too short to be real: "${h1Text}"`);
  const fused = /[a-z0-9][,.;:!?][A-Za-z]/.exec(h1Text);
  if (fused) {
    fail(
      'SEO_HEADINGS',
      `h1 lost a space after punctuation -- JSX drops whitespace containing a newline, so put {' '} between the text and the next element: "${h1Text}"`,
    );
  }

  // -- structured data must be present, parse, and agree with the page -------
  const ldBlocks = [...indexHtml.matchAll(/<script\s+type="application\/ld\+json"\s*>([\s\S]*?)<\/script>/gi)];
  if (ldBlocks.length !== 1) {
    fail('SEO_STRUCTURED_DATA', `expected exactly one JSON-LD block in the prerendered document, found ${ldBlocks.length}`);
  }
  let graph;
  try {
    graph = JSON.parse(ldBlocks[0][1]);
  } catch (error) {
    fail('SEO_STRUCTURED_DATA', `JSON-LD does not parse: ${error instanceof Error ? error.message : String(error)}`);
  }
  const nodes = graph['@graph'] ?? [graph];
  const byType = new Map(nodes.map((node) => [node['@type'], node]));
  for (const type of ['Organization', 'WebSite', 'SoftwareApplication']) {
    if (!byType.has(type)) fail('SEO_STRUCTURED_DATA', `JSON-LD is missing a ${type} node`);
  }
  const org = byType.get('Organization');
  if (org['@id'] !== ORGANIZATION_ID) {
    fail('SEO_STRUCTURED_DATA', `Organization @id must be the shared estate id ${ORGANIZATION_ID}; got ${org['@id']}`);
  }
  const app = byType.get('SoftwareApplication');
  if (app.applicationCategory !== 'MultimediaApplication') {
    fail('SEO_STRUCTURED_DATA', `applicationCategory must be a value Google supports; got ${app.applicationCategory}`);
  }
  if (app.aggregateRating || app.review) {
    fail('SEO_STRUCTURED_DATA', 'no ratings or reviews exist for this product; publishing them would be fabricated');
  }
  // The version in the graph is the version on the page. Drift here is how a
  // structured-data claim starts contradicting what a visitor is told.
  if (!indexHtml.includes(app.softwareVersion)) {
    fail('SEO_STRUCTURED_DATA', `softwareVersion ${app.softwareVersion} appears nowhere in the visible document`);
  }
  if (!indexHtml.includes(app.downloadUrl)) {
    fail('SEO_STRUCTURED_DATA', 'JSON-LD downloadUrl is not the URL the page actually links');
  }
  const price = app.offers?.price;
  if (price !== '0') fail('SEO_STRUCTURED_DATA', `offers.price must state the real price; got ${price}`);

  // -- sitemap: only indexable, self-hosted, 200 URLs -----------------------
  const sitemap = await readFile(path.join(rootDirectory, 'sitemap.xml'), 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => match[1].trim());
  if (locs.length === 0) fail('SEO_SITEMAP', 'sitemap declares no URLs');
  for (const loc of locs) {
    if (!loc.startsWith(`${CANONICAL_ORIGIN}/`)) fail('SEO_SITEMAP', `sitemap URL is off-origin: ${loc}`);
  }
  if (locs.length !== 1 || locs[0] !== CANONICAL_URL) {
    fail(
      'SEO_SITEMAP',
      `this site is one document, so the sitemap must list exactly ${CANONICAL_URL} and nothing else -- a deleted or redirecting path here advertises a non-canonical URL. Found: ${locs.join(', ')}`,
    );
  }
  if (/<(?:priority|changefreq)>/i.test(sitemap)) {
    fail('SEO_SITEMAP', 'priority and changefreq are ignored by Google; drop them rather than implying they do something');
  }

  // -- robots.txt must point at the sitemap and be plain text ---------------
  const robots = await readFile(path.join(rootDirectory, 'robots.txt'), 'utf8');
  if (!robots.includes(`Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`)) {
    fail('SEO_ROBOTS', 'robots.txt must declare the absolute sitemap URL');
  }
  if (/Disallow:\s*\/\s*$/m.test(robots)) fail('SEO_ROBOTS', 'robots.txt disallows the whole site');

  // -- the 404 document must exist and must not masquerade as a page --------
  const notFound = await readFile(path.join(rootDirectory, '404.html'), 'utf8');
  if (/rel="canonical"/i.test(notFound)) {
    fail('SEO_ROUTING', '404.html must not carry a canonical -- it would invite consolidation onto an error page');
  }
  if (!/<title>/i.test(notFound)) fail('SEO_ROUTING', '404.html has no title');

  console.log(
    `SEO_CONTRACT_PASS canonical=${canonical} title=${title.length}c description=${description.length}c `
    + `jsonld=${nodes.length}nodes sitemap=${locs.length}url h1="${h1Text.slice(0, 48)}"`,
  );
};

const verifyOutput = async (requestedDirectory) => {
  const rootDirectory = path.resolve(requestedDirectory);
  let rootMetadata;
  try {
    rootMetadata = await lstat(rootDirectory);
  } catch {
    fail('STRUCTURAL_OUTPUT', `output root does not exist: ${rootDirectory}`);
  }
  if (!rootMetadata.isDirectory() || rootMetadata.isSymbolicLink()) {
    fail('STRUCTURAL_OUTPUT', `output root must be a regular directory: ${rootDirectory}`);
  }

  const { files, directories } = await listOutput(rootDirectory);
  const indexFiles = files.filter((file) => file === 'index.html');
  if (indexFiles.length !== 1) {
    fail('STRUCTURAL_OUTPUT', `expected exactly one index.html, found ${indexFiles.length}`);
  }

  for (const directory of directories) {
    if (
      directory !== 'assets'
      && directory !== 'assets/fonts'
      && directory !== 'audio'
      && directory !== 'images'
    ) {
      fail('OUTPUT_ALLOWLIST', `unexpected directory: ${directory}`);
    }
  }

  const isSidecar = (file) =>
    fontAssetPattern.test(file)
    || staticRootPattern.test(file)
    || audioAssetPattern.test(file)
    || imageAssetPattern.test(file);
  const fontFiles = files.filter((file) => fontAssetPattern.test(file));
  const applicationFiles = files.filter((file) => !isSidecar(file));

  for (const file of applicationFiles) {
    if (file === 'index.html') continue;
    if (!file.startsWith('assets/index-') || !/\.(?:js|css)$/.test(file)) {
      fail('OUTPUT_ALLOWLIST', `unexpected output file: ${file}`);
    }
    verifyFingerprint(file, file.endsWith('.js') ? 'js' : 'css');
  }

  for (const file of fontFiles.filter((candidate) => candidate.endsWith('.woff2'))) {
    const header = (await readFile(path.join(rootDirectory, file))).subarray(0, 4);
    if (!header.equals(woff2Signature)) {
      fail('OUTPUT_ALLOWLIST', `self-hosted font is not a WOFF2 payload: ${file}`);
    }
  }

  // An image that is not the format its extension claims either fails to
  // decode or decodes as something else entirely, so check the bytes.
  for (const file of files.filter((candidate) => imageAssetPattern.test(candidate))) {
    const header = await readFile(path.join(rootDirectory, file));
    if (
      header.length < 12
      || !header.subarray(0, 4).equals(riffSignature)
      || !header.subarray(8, 12).equals(webpFormType)
    ) {
      fail('OUTPUT_ALLOWLIST', `interface capture is not a WebP payload: ${file}`);
    }
  }

  // The build inlines the stylesheet into the document, so a .css file in the
  // output means the prerender step did not run and the document is still
  // waiting on a separate request before it can paint.
  const jsFiles = files.filter((file) => file.endsWith('.js'));
  const cssFiles = files.filter((file) => file.endsWith('.css'));
  if (cssFiles.length !== 0) {
    fail('STRUCTURAL_OUTPUT', `stylesheet must be inlined into the document; found ${cssFiles.join(', ')}`);
  }
  if (jsFiles.length !== 1 || applicationFiles.length !== 2) {
    fail(
      'STRUCTURAL_OUTPUT',
      `expected index.html plus one fingerprinted JS file; found ${applicationFiles.join(', ') || 'no files'}`,
    );
  }

  const indexPath = path.join(rootDirectory, 'index.html');
  const indexHtml = await readFile(indexPath, 'utf8');

  await verifySeoContract(rootDirectory, indexHtml);
  const scriptTags = [...indexHtml.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
    .map((match) => ({ attributes: parseAttributes(match[1]), content: match[2] }));
  const linkTags = [...indexHtml.matchAll(/<link\b([^>]*)>/gi)]
    .map((match) => ({ attributes: parseAttributes(match[1]) }));

  if (scriptTags.length !== countMatches(indexHtml, /<script\b/gi)) {
    fail('HTML_ASSET_RESOLUTION', 'found an unparseable or unterminated script element');
  }

  const externalScripts = scriptTags.filter(({ attributes }) => {
    const source = attributes.get('src');
    return source !== undefined && isExternalReference(source);
  });
  if (externalScripts.length !== 1) {
    fail('THIRD_PARTY_SCRIPT_POLICY', `expected exactly one external script (GA4), found ${externalScripts.length}`);
  }

  const googleTagScript = externalScripts[0];
  const googleTagSource = googleTagScript.attributes.get('src');
  verifyOfficialGoogleTagUrl(googleTagSource);
  if (!googleTagScript.attributes.has('async')) {
    fail('GA4_EXACTNESS', `official Google tag script is not async: ${googleTagSource}`);
  }
  if (googleTagScript.content.trim() !== '') {
    fail('GA4_EXACTNESS', 'external Google tag script element must not contain inline code');
  }

  const localScriptReferences = [];
  for (const { attributes } of scriptTags) {
    const source = attributes.get('src');
    if (source === undefined || isExternalReference(source)) continue;
    const resolved = await normalizeLocalReference(source, rootDirectory, `script src=${source}`);
    if (attributes.get('type')?.toLowerCase() !== 'module') {
      fail('FINGERPRINT_CONTRACT', `first-party script must be type=module: ${resolved.normalized}`);
    }
    verifyFingerprint(resolved.normalized, 'js');
    localScriptReferences.push(resolved);
  }
  if (localScriptReferences.length !== 1) {
    fail('STRUCTURAL_OUTPUT', `expected exactly one first-party module script, found ${localScriptReferences.length}`);
  }

  const linkAssetReferences = [];
  for (const { attributes } of linkTags) {
    const relations = (attributes.get('rel') ?? '').toLowerCase().split(/\s+/).filter(Boolean);
    const preloadType = (attributes.get('as') ?? '').toLowerCase();
    const isAssetLink = relations.some((relation) => ['icon', 'manifest', 'modulepreload', 'preload', 'stylesheet'].includes(relation));
    if (!isAssetLink) continue;
    const reference = attributes.get('href');
    if (reference === undefined) fail('HTML_ASSET_RESOLUTION', `asset link is missing href (rel=${relations.join(' ')})`);
    if (isExternalReference(reference)) {
      if (relations.includes('modulepreload') || relations.includes('stylesheet') || preloadType === 'script' || preloadType === 'style') {
        fail('THIRD_PARTY_SCRIPT_POLICY', `external runtime asset is not approved: ${reference}`);
      }
      continue;
    }
    const resolved = await normalizeLocalReference(reference, rootDirectory, `link href=${reference}`);
    const expectsJavaScript = relations.includes('modulepreload') || preloadType === 'script';
    const expectsCss = relations.includes('stylesheet') || preloadType === 'style';
    if (expectsJavaScript) verifyFingerprint(resolved.normalized, 'js');
    if (expectsCss) verifyFingerprint(resolved.normalized, 'css');
    if (!expectsJavaScript && !expectsCss) {
      fail('OUTPUT_ALLOWLIST', `unapproved linked static asset: ${resolved.normalized}`);
    }
    linkAssetReferences.push({ ...resolved, kind: expectsJavaScript ? 'js' : 'css' });
  }
  if (linkAssetReferences.length !== 0) {
    fail(
      'STRUCTURAL_OUTPUT',
      `expected no local asset links — the stylesheet is inlined — found ${linkAssetReferences.map(({ normalized }) => normalized).join(', ')}`,
    );
  }

  // Exactly one first-party <style>, carrying the whole design system. More
  // than one means something injected styles the build did not produce.
  const styleTags = [...indexHtml.matchAll(/<style\b([^>]*)>([\s\S]*?)<\/style\s*>/gi)]
    .map((match) => ({ attributes: parseAttributes(match[1]), content: match[2] }));
  if (styleTags.length !== 1) {
    fail('STRUCTURAL_OUTPUT', `expected exactly one inline stylesheet, found ${styleTags.length}`);
  }
  const inlineStyle = styleTags[0].content;
  if (inlineStyle.trim().length === 0) {
    fail('STRUCTURAL_OUTPUT', 'the inline stylesheet is empty');
  }
  // CSS cannot execute, but it can still reach out. Keep it first-party.
  for (const pattern of [/@import\b/i, /url\(\s*['"]?\s*(?:https?:)?\/\//i, /javascript:/i, /expression\s*\(/i]) {
    if (pattern.test(inlineStyle)) {
      fail('THIRD_PARTY_SCRIPT_POLICY', `inline stylesheet reaches outside the origin: ${pattern}`);
    }
  }

  const referencedPaths = [...localScriptReferences, ...linkAssetReferences].map(({ normalized }) => normalized);
  if (new Set(referencedPaths).size !== referencedPaths.length) {
    fail('HTML_ASSET_RESOLUTION', `duplicate first-party asset reference: ${referencedPaths.join(', ')}`);
  }
  const unreferencedAssets = [...jsFiles, ...cssFiles].filter((file) => !referencedPaths.includes(file));
  if (unreferencedAssets.length > 0) {
    fail('HTML_ASSET_RESOLUTION', `unreferenced output asset: ${unreferencedAssets.join(', ')}`);
  }

  // Static font payload is validated structurally above and deliberately kept
  // out of the executable-content scan below.
  const textAssets = await Promise.all(applicationFiles.map(async (file) => ({
    file,
    text: await readFile(path.join(rootDirectory, file), 'utf8'),
  })));
  const forbiddenPatterns = [
    ['@babel/standalone', /@babel\/standalone/i],
    ['babel standalone', /babel[\s_-]+standalone/i],
    ['text/babel', /text\/babel/i],
    ['text/jsx', /text\/jsx/i],
    ['Tailwind CDN', /cdn\.tailwindcss\.com/i],
    ['raw source path', /(?:^|["'`(])\/?src\/[A-Za-z0-9_./-]+\.(?:tsx?|jsx)(?:[?"'`)])/im],
    ['JSX/TSX browser compilation', /(?:browser|runtime)[ -]compil(?:e|ation)[\s\S]{0,40}(?:jsx|tsx)|(?:jsx|tsx)[\s\S]{0,40}(?:browser|runtime)[ -]compil(?:e|ation)/i],
    ['external React runtime URL', /https?:\/\/[^\s"'<>`]*(?:react-dom|react)(?:[@./-]|%2f)/i],
  ];

  for (const { file, text } of textAssets) {
    for (const [label, expression] of forbiddenPatterns) {
      const match = text.match(expression);
      if (match) fail('RUNTIME_TOOL_REJECTION', `${label} found in ${file}: ${match[0]}`);
    }
  }

  const outputFileSet = new Set(applicationFiles);
  for (const { file, text } of textAssets.filter(({ file: asset }) => asset.endsWith('.js'))) {
    verifyJavaScriptSemantics(file, text, outputFileSet);
  }

  /* A JSON-LD block is a <script> the browser never executes -- it is a data
     island, and the SEO contract above has already parsed it and checked its
     contents. Excluding it by exact type keeps this assertion about what it
     was always about: exactly one inline EXECUTABLE script, the GA4
     initializer. Anything with a different type, or no type, still counts. */
  const isStructuredData = ({ attributes }) => attributes.get('type') === 'application/ld+json';
  const inlineScripts = scriptTags.filter(({ attributes }) => !attributes.has('src'));
  const nonEmptyInlineScripts = inlineScripts
    .filter((tag) => !isStructuredData(tag))
    .filter(({ content }) => content.trim() !== '');
  if (nonEmptyInlineScripts.length !== 1) {
    fail('GA4_EXACTNESS', `expected exactly one non-empty inline GA4 initializer, found ${nonEmptyInlineScripts.length}`);
  }
  const gaInitializer = nonEmptyInlineScripts[0].content;

  await verifyPolicyPinsInitializer(gaInitializer);

  const semanticContracts = [
    ['dataLayer initialization', /window\s*\.\s*dataLayer\s*=\s*window\s*\.\s*dataLayer\s*\|\|\s*\[\s*\]\s*;?/g],
    ['gtag function definition', /function\s+gtag\s*\(\s*\)\s*\{\s*dataLayer\s*\.\s*push\s*\(\s*arguments\s*\)\s*;?\s*\}/g],
    ['gtag js initialization', /gtag\s*\(\s*(['"])js\1\s*,\s*new\s+Date\s*\(\s*\)\s*\)\s*;?/g],
    ['approved GA4 config', new RegExp(`gtag\\s*\\(\\s*(['"])config\\1\\s*,\\s*(['"])${measurementId}\\2\\s*\\)\\s*;?`, 'g')],
  ];
  for (const [label, expression] of semanticContracts) {
    const occurrences = countMatches(gaInitializer, expression);
    if (occurrences !== 1) fail('GA4_EXACTNESS', `${label} must occur exactly once; found ${occurrences}`);
  }

  const outputText = textAssets.map(({ text }) => text).join('\n');
  const gtagCommands = [...outputText.matchAll(/\bgtag\s*\(\s*(['"])([^'"]+)\1/g)].map((match) => match[2]);
  if (gtagCommands.length !== 2 || gtagCommands[0] !== 'js' || gtagCommands[1] !== 'config') {
    fail('GA4_EXACTNESS', `only the standard js and config calls are permitted; found ${gtagCommands.join(', ') || 'none'}`);
  }
  if (countMatches(outputText, /\bgtag\s*\(/g) !== 3) {
    fail('GA4_EXACTNESS', 'unexpected gtag definition or call detected');
  }
  if (countMatches(outputText, /(?:window\s*\.\s*)?dataLayer\s*=/g) !== 1) {
    fail('GA4_EXACTNESS', 'unexpected dataLayer initialization detected');
  }
  if (countMatches(outputText, /dataLayer\s*\.\s*push\s*\(/g) !== 1) {
    fail('GA4_EXACTNESS', 'unexpected dataLayer push detected');
  }

  const measurementIds = [...outputText.matchAll(/\bG-[A-Z0-9]+\b/g)].map((match) => match[0]);
  if (measurementIds.length !== 2 || measurementIds.some((id) => id !== measurementId)) {
    fail('GA4_EXACTNESS', `expected exactly two references to ${measurementId} and no other GA4 IDs; found ${measurementIds.join(', ') || 'none'}`);
  }
  if (/\bGTM-[A-Z0-9-]+\b/i.test(outputText)) fail('GA4_EXACTNESS', 'Google Tag Manager container ID found');
  if (/\bAW-[A-Z0-9-]+\b/i.test(outputText)) fail('GA4_EXACTNESS', 'Google Ads ID found');
  if (countMatches(outputText, /www\.googletagmanager\.com/gi) !== 1) {
    fail('GA4_EXACTNESS', 'alternate or duplicate Google tag host reference found');
  }
  const unapprovedTrackingToken = outputText.match(/\b(?:remarketing|user_id|ecommerce|send_to|allow_ad_personalization_signals|google_signals|ads_data_redaction)\b/i);
  if (unapprovedTrackingToken) {
    fail('GA4_EXACTNESS', `unapproved tracking configuration found: ${unapprovedTrackingToken[0]}`);
  }
  const unapprovedTrackingHost = outputText.match(
    /(?:google-analytics\.com|analytics\.google\.com|doubleclick\.net|googlesyndication\.com|connect\.facebook\.net|segment\.(?:com|io)|mixpanel\.com)/i,
  );
  if (unapprovedTrackingHost) {
    fail('THIRD_PARTY_SCRIPT_POLICY', `unapproved tracking dependency found: ${unapprovedTrackingHost[0]}`);
  }

  const jsGzipBytes = localScriptReferences.reduce((total, { normalized }) => {
    const asset = textAssets.find(({ file }) => file === normalized);
    return total + gzipSync(Buffer.from(asset.text)).byteLength;
  }, 0);
  const cssGzipBytes = gzipSync(Buffer.from(inlineStyle)).byteLength;

  if (jsGzipBytes > jsBudgetBytes) {
    fail('GZIP_BUDGET', `initial first-party JS is ${jsGzipBytes} bytes; budget is ${jsBudgetBytes} bytes`);
  }
  if (cssGzipBytes > cssBudgetBytes) {
    fail('GZIP_BUDGET', `initial first-party CSS is ${cssGzipBytes} bytes; budget is ${cssBudgetBytes} bytes`);
  }

  console.log(
    `VERIFY_DIST_PASS root=${rootDirectory} files=${applicationFiles.length} fonts=${fontFiles.length} `
    + `js_gzip=${jsGzipBytes}B(${(jsGzipBytes / 1024).toFixed(2)}KiB) `
    + `css_gzip=${cssGzipBytes}B(${(cssGzipBytes / 1024).toFixed(2)}KiB) `
    + `ga4=${measurementId}`,
  );
};

/* The Content-Security-Policy allows exactly one inline script, by hash. If the
   gtag bootstrap is edited by so much as a space, the hash stops matching and
   the browser silently refuses to run it: analytics would go quiet in
   production while every local check still passed, which is precisely the
   failure mode style-src already caused once on the sibling sites. So the
   policy and the page are compared here, in the same command that gates the
   production build. */
const verifyPolicyPinsInitializer = async (initializer) => {
  const manifestPath = path.join(process.cwd(), 'vercel.json');
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (error) {
    fail('CSP_SCRIPT_PIN', `vercel.json must be readable JSON: ${error.message}`);
  }

  const block = (manifest.headers ?? []).find((entry) => entry.source === '/(.*)');
  const policy = block?.headers?.find((h) => h.key.toLowerCase() === 'content-security-policy')?.value;
  if (!policy) {
    fail('CSP_SCRIPT_PIN', 'vercel.json sets no Content-Security-Policy for /(.*)');
  }

  const scriptSrc = policy.split(';').map((d) => d.trim()).find((d) => d.startsWith('script-src'));
  if (!scriptSrc) fail('CSP_SCRIPT_PIN', 'the policy declares no script-src');
  if (scriptSrc.includes("'unsafe-inline'")) {
    fail('CSP_SCRIPT_PIN', "script-src must pin the initializer by hash, not admit every inline script with 'unsafe-inline'");
  }

  const pinned = [...scriptSrc.matchAll(/'sha256-([A-Za-z0-9+/=]+)'/g)].map((m) => m[1]);
  const actual = createHash('sha256').update(initializer, 'utf8').digest('base64');
  if (!pinned.includes(actual)) {
    fail(
      'CSP_SCRIPT_PIN',
      `script-src does not pin the inline GA4 initializer this build produced. `
      + `Update the hash in vercel.json and scripts/assemble_vercel_output.mjs to 'sha256-${actual}'`,
    );
  }
};

const requestedDirectory = process.argv[2] ?? 'dist';

verifyOutput(requestedDirectory).catch((error) => {
  console.error(`VERIFY_DIST_FAIL ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
