# StudioZIO web estate — canonical architecture

This document is the source-of-truth record for the public StudioZIO web
estate. It lives in the canonical Tempo Delay repository so a future website
change has one place to check before touching a product or plugin repository.
Three of the four surfaces are product sites; the fourth, ZIO, is the artist
surface, and where a rule applies to it differently that is stated explicitly
rather than left to be inferred.

## Canonical repositories and production surfaces

| Surface | Canonical repository | Production Vercel project | Public URL |
| --- | --- | --- | --- |
| Hub | `StudioZIO/StudioZIO-Web` | `studiozio` | `https://studiozio.vercel.app/` |
| Mastering Suite | `StudioZIO/StudioZIO-Mastering-Suite-Site` | `studiozio_mastering_suite` | `https://studioziomasteringsuite.vercel.app/` |
| Tempo Delay | `StudioZIO/TempoDelay` | `tempo-delay` | `https://www.tempodelay.tech/` |
| ZIO (artist) | `StudioZIO/zio-artist-site` | `zio-audio` | `https://zio-audio.vercel.app/` |

Each production surface is deployed from its own canonical repository. The
`StudioZIO-Master-Plugin-Suite` repository is source for the plug-in and is not
a website source-of-truth; website trees must not be copied back into it.

ZIO is the artist surface, not a product site, and ZIO the artist and StudioZIO
the software brand stay separate entities everywhere it matters — the
structured data keeps them distinct and `tools/validate.mjs` enforces it. The
two are nonetheless linked in both directions: the Hub declares
`founder: { '@id': 'https://zio-audio.vercel.app/#person' }` in its structured
data, and the ZIO site links back to the Hub. The deployment-provenance and
indexing rules below apply to `zio-audio` exactly as they do to the product
surfaces. The design-system half of the next section does **not** extend to
it: ZIO carries its own visual identity. What does apply to it is the estate
minimum, recorded there.

## Shared UI contract

The three product sites share the StudioZIO Core Design System v1: the dark
blue-black surface ramp, cyan primary, Space Grotesk display face, Inter Tight
body face,
JetBrains Mono labels, no amber accents, the same shell/gutter tokens, and the
same reduced-motion behavior. Hero and section entrances use the canonical
`.rise` animation (0.7 s, 60/120/180 ms stagger); a responsive layout must keep
the meaning of every control at every supported width.

The footer contract is also shared:

- StudioZIO brand mark and social links are grouped on the left.
- Instagram and KVR links are explicit, keyboard reachable controls.
- The property bridge and Contact link point to the Hub; there is no duplicate
  product-specific contact route.
- No amber is introduced as a substitute accent.
- **The footer link list is identical on all three product sites**, in this
  order: Hub, Products, Mastering Suite, Tempo Delay, Notes, Contact, Press
  kit, ZIO. Settled on 2026-09-08. The point is that any menu is reachable
  from any surface: before it, the Mastering Suite and Tempo Delay footers
  carried five entries and neither linked to Notes or the press kit, so three
  notes written about Tempo Delay had no link from the Tempo Delay site.
  Changing the list means changing it on every surface in the same commit — a
  footer that differs between properties is how a page ends up with nothing
  pointing at it.
- The header stays at six and does **not** match the footer. The press kit is
  for journalists, who go looking for it; ZIO is the artist surface rather
  than a product. Neither belongs in a product header, and the hub, the
  Mastering Suite site and Tempo Delay all keep that split.
- The ZIO entry also repairs a claim that had nothing behind it: the hub's
  Organization graph names ZIO as `founder` by `@id`, and two comments in
  `site.mjs` said a crawlable footer link was what made that reference
  resolvable. No such link existed anywhere on the site until this change.

### ZIO is outside the design system, and inside the estate minimum

Settled on 2026-09-07. ZIO is not held to the Core Design System, and the
difference is deliberate rather than drift: the artist surface is a separate
entity from the software brand, and its palette (`#0d0d0d` neutrals with the
logo red `#d7182a`), its Archivo Black / Inter type, its container and gutter
tokens and its footer shape are its own. Do not "align" them to the product
sites. The footer contract above is a product-site contract; KVR in
particular is a plug-in marketplace and has no meaning on an artist site.

One piece of the UI contract *is* shared, by decision rather than by
accident: the canonical `.rise` entrance, at the canonical values — 0.7 s,
the same easing, the 60/120/180 ms stagger. All four surfaces open the same
way; only ZIO looks different once it has. It is written on ZIO at those
literal values rather than in terms of that site's own motion tokens, so a
later change to its interaction timings cannot quietly desynchronise the
estate's entrance.

Whatever a surface looks like, these five hold everywhere, and a change that
breaks one of them on any surface is a defect:

1. A property bridge to the Hub, as a real link — the estate's surfaces are
   reachable from one another.
2. The cookie choice can be reopened and withdrawn from the footer, on every
   page that carries the tag.
3. `prefers-reduced-motion: reduce` is honoured, and honouring it leaves the
   page at its settled state rather than at an unfinished frame.
4. Keyboard focus is visible on every interactive control.
5. The consent banner never shifts the page: it is fixed, and it is not
   allowed to cost layout stability.

All four surfaces satisfy all five today; this was verified when the rule was
written, not assumed.

## Cookie and analytics contract

All four surfaces use the same Google Analytics 4 property (`G-VL8Z542XMP`)
and Consent Mode v2 behavior. ZIO was consolidated onto this property from its
own `G-FX2BHZK44S`, which stays readable as an archive and is never written to
again; reporting separates the surfaces by the Hostname dimension:

1. Consent defaults are denied for Türkiye, the EEA, the UK and Switzerland;
   the rest of the network retains the existing granted default.
2. A first visit presents a fixed, accessible “Cookie preference” banner with
   “Decline” and “Accept” actions. It never shifts the page layout.
3. The choice is stored as `studiozio-consent` (`granted` or `denied`) and is
   replayed before the GA4 config call on return visits. **`zio-audio` is a
   recorded exemption: it stores the same two values under `zio-consent`.**
   The key is the storage name of one entity's choice, and ZIO is a separate
   entity from the StudioZIO brand; a visitor's decision on the artist site is
   not the same decision as one taken on a product site. Everything else in
   this contract is identical there — the same opt-in region list, the same
   `wait_for_update: 500`, the same replay-before-config order, the same
   banner and the same footer withdrawal control. Do not “fix” `zio-consent`
   to `studiozio-consent`: it is deliberate, and changing it would silently
   discard the stored choice of every returning ZIO visitor.
4. The footer always exposes a “Cookies” button so the choice can be reopened
   and withdrawn. The button has visible keyboard focus and an action role.
5. Copy is deliberately plain, and it states what actually happens: Google
   Analytics counts visits and measures which ads bring people here; no visitor
   is added to an advertising audience and no profile is built. It used to say
   "no advertising, no profiling", which stopped being accurate once the estate
   started running Google Ads — and sat oddly beside a banner that asks for
   `ad_storage` consent. The sentence must keep matching the property's actual
   settings; if remarketing is ever switched on, this line changes with it.

Tempo Delay implements the same contract in its React/Vite bundle rather than
adding a second executable page script. This preserves the Tempo output
contract: one fingerprinted first-party module, one Google tag, and one inline
GA4 initializer pinned by the Content-Security-Policy hash.

### The Google tag and the Content-Security-Policy

Google's Tag diagnostics shows an "urgent" item, "Your website's security
settings are blocking measurement". Checked against all four surfaces on
2026-09-08, the answer has two halves, and only the first was recorded here
initially.

**Measurement is not blocked.** Every host the tag needs to count a visit is
allowed on all four surfaces:

| Google asks for | Where each surface satisfies it |
| --- | --- |
| `script-src-elem: www.googletagmanager.com` | `script-src`, which every surface lists it in |
| `img-src: *.google-analytics.com`, `www.googletagmanager.com` | `img-src` on all four |
| `connect-src: *.google-analytics.com`, `*.analytics.google.com`, `www.googletagmanager.com` | `connect-src` on all four |

**Advertising endpoints are blocked, on purpose.** Three hosts the tag can
reach for are allowed nowhere in the estate, and all three belong to Google
signals and remarketing rather than to measurement:

| Blocked | What it is |
| --- | --- |
| `www.google.<ccTLD>` — `www.google.com.tr`, `www.google.de`, … | the `ga-audiences` remarketing pixel, on a country-specific Google domain. Only `www.google.com` is allowed, so a Turkish or German visitor's ping is refused |
| `pagead2.googlesyndication.com` | the advertising conversion script |

This is the half the diagnostic is most likely reporting, and it is not a fault
to repair. Every surface tells its visitors, in the consent banner and in its
README, that measurement is Google Analytics only — *no advertising and no
profiling*. Allowing these hosts would make that sentence untrue.

**Decision, 2026-09-08.** The estate *does* run Google Ads, and the choice made
here is to use it for **conversion measurement only, not remarketing**:

- Google signals / ads personalization stays **off** in the GA4 property, so
  the tag never attempts the `ga-audiences` ping and there is nothing for the
  CSP to block.
- Ad spend is still measured. Conversions reach Google Ads through the
  GA4 ↔ Ads account link, with `download_click` imported as a conversion —
  that path is server-side between Google's own products and needs no browser
  request, so switching signals off costs no measurement of the campaign.
- The advertising endpoints stay **out** of the CSP. Do not "fix" this
  diagnostic by adding them.
- The remaining ad-adjacent entries (`*.g.doubleclick.net`,
  `td.doubleclick.net`, `www.google.com`) are left alone — permitting a request
  the tag no longer makes costs nothing.
- The consent copy says what this actually is: visits counted, ads measured, no
  advertising audience, no profile.

Turning remarketing on is a deliberate reversal, not a tidy-up. It requires the
country-domain hosts in `img-src` on all four surfaces, and the consent copy and
the READMEs change in the same commit — because at that point the visitor *is*
being added to an advertising audience, and the banner has to say so.

Two CSP rules make the measurement half correct even though the diagnostic
disagrees, and a checker that ignores either will report a gap that is not
there:

1. **Directive fallback.** No surface declares `script-src-elem`. It does not
   need to: when it is absent the user agent falls back to `script-src`, and
   `default-src` after that. Adding a literal `script-src-elem` would satisfy a
   naive checker while changing nothing a browser does.
2. **Host wildcards.** `https://*.googletagmanager.com` matches
   `www.googletagmanager.com`; ZIO writes it that way while the product sites
   spell the host out. A string comparison marks that as missing. It is not.

So a report of a missing directive is only real once it has been checked with
the fallback chain and wildcard matching applied — the first pass over this
reported ZIO as missing two entries purely because it compared strings and its
policy spells the tag host as a wildcard. What *would* be real: a surface whose
`connect-src` omits the analytics collectors entirely — that stops measurement
outright rather than degrading it.

The check is worth re-running as written rather than by eye: read each
surface's `Content-Security-Policy` out of its `vercel.json`, resolve the
fallback chain for any absent directive, and match host sources with wildcard
semantics (`*.a.com` matches `x.a.com`, and does not match `a.com`).

Vercel preview deployment hostnames are deliberately **not** added to the
cross-domain list. They change on every deploy, they are not public surfaces,
and adding them would leave the list full of dead entries.

## Change and deployment rule

Website changes start in the matching canonical repository, pass its local
typecheck/build/accessibility/output verifiers, and are then promoted through
the matching Vercel project. Production HTML, download links and screenshots
are verified on the public domain after promotion. Changes in one surface do
not authorize rebuilding or repointing another surface.

## Deployment provenance

Every production deployment must name the branch and commit it was built from.
That is the whole point of the canonical repositories: what is live is exactly
what was reviewed, and anyone can read the diff that produced it.

1. Production is promoted from `main` of the canonical repository, through the
   Vercel Git integration for that project. That is the only production path.
2. A manual publish from a workstation — `vercel deploy`, `vercel --prod`, or
   an upload of a locally built directory — is **not** a deployment path. It
   produces a deployment whose source reads `vercel deploy` with no branch and
   no commit, and promoting it silently replaces a reviewed deployment with one
   nobody can trace back to a diff.
3. To re-deploy without a content change, use Redeploy on the latest `main`
   deployment, which keeps the commit attached. Never re-publish by hand to
   force an update.
4. A source-less deployment holding the production alias is a defect, not a
   variation. The remedy is to promote a `main` deployment again — merge the
   next change, or Redeploy the newest `main` build — and then confirm on the
   Vercel deployments list that the production entry shows a branch and a
   commit hash.
5. `tempo-delay` also has a manual **preview** workflow
   (`.github/workflows/deploy.yml`, `workflow_dispatch`) that publishes a
   prebuilt artifact with `vercel deploy --prebuilt --target=preview`. It runs
   inside GitHub Actions, so the commit stays attached, and it never targets
   production. It is not an exception to rule 2.

## What a browser is allowed to keep

A deployment is only live for a visitor once their browser actually fetches
it. A file whose URL never changes and is cached for a day is, for that day,
a second deployment that nobody promoted.

The rule: **a file whose name carries no fingerprint may not be cached beyond
revalidation.** Two shapes satisfy that, and a surface must use one of them
for its CSS and JS:

1. **Fingerprint, then cache forever.** The name contains a hash of the
   contents, so a change is a new URL and the old one can never be served in
   its place: `max-age=31536000, immutable`. Tempo Delay gets this from Vite
   for its whole bundle; the hub does it for its stylesheet
   (`/assets/styles-<hash>.css`).
2. **Do not fingerprint, and do not cache.** A hand-authored surface has no
   build step to rename anything, so its CSS and JS answer
   `max-age=0, must-revalidate`. That is a conditional request, not a
   re-download — an unchanged file still answers 304. The Mastering Suite,
   ZIO, and the hub's own scripts do this.

A surface may mix the two, and the hub does: a fingerprinted stylesheet cached
for a year, beside scripts that are not fingerprinted and therefore are not
cached. What it may not do is mix the halves the wrong way round, which is
the only combination that breaks.

Fingerprinted `/assets/**` — fonts, images, OG cards — keep their long
immutable cache under either shape. It is the un-fingerprinted files that the
rule is about.

What the wrong combination does, and why it is worth a section: on
2026-09-07 the ZIO surface was serving an unfingerprinted `styles.css` with
`max-age=86400`. A change that added markup and the CSS rule it depends on
deployed correctly, and did nothing at all for returning visitors: they
received the new HTML and yesterday's stylesheet, so the new class landed on
elements with no rule to apply. Nothing errored. The page looked intact. The
feature was simply absent, and absent longest for the most frequent visitors.

The same window applied to `consent.js`, which draws the cookie banner — a
stale copy of it is a stale consent UI, which is the version of this bug that
would have mattered.

Writing the rule down immediately found it a second time. The hub had
fingerprinted its stylesheet and stopped there: its six scripts — `ab.js`,
`consent.js`, `contact.js`, `events.js`, `gtag.js`, `notify.js` — ship under
fixed names and were served the same day-long cache, with a week of
stale-while-revalidate behind it. Both surfaces were corrected on 2026-09-07.

Check this when adding a surface, and when adding a file to one — not after a
change appears not to have shipped.

## Indexing: the URLs that redirect on purpose

Each surface advertises only URLs that answer 200 and canonicalise to
themselves. The sitemaps are the list of what should be indexed:
`https://www.tempodelay.tech/` for Tempo Delay, four hub URLs, four Mastering
Suite URLs, and eighteen ZIO URLs (the ZIO sitemap carries `xhtml:link`
hreflang alternates for its Turkish pages). None of them lists a redirect.

Around that list a few URLs redirect **by design**:

| URL | Behaviour | Why |
| --- | --- | --- |
| `https://tempodelay.tech/` | 308 → `https://www.tempodelay.tech/` | `www` is the canonical host; the apex consolidates onto it |
| `http://…` on any surface | 308 → the `https://` form | HSTS and the platform's TLS redirect |
| `https://www.tempodelay.tech/contact` | 308 → `https://studiozio.vercel.app/contact/` | The route was retired on 2026-09-02; one support desk serves the estate |
| `https://tempo-delay-virid.vercel.app/*` | 308 → `https://www.tempodelay.tech/*` | Duplicate host consolidated onto the canonical domain |
| `https://studiozio.vercel.app/products/mastering-suite/` | 308 → the Mastering Suite site | The catalogue entry points at the product's own surface |

Google Search Console reports every one of these under **Page indexing → Page
with redirect**, with the note "These pages aren't indexed or served on
Google". That is the report describing the intent, not a fault:

- The Tempo Delay property is a **domain** property (`sc-domain:tempodelay.tech`),
  so it covers the apex, `www`, `http` and `https` together. The apex and the
  `http` forms therefore *must* appear as redirects; a domain property with no
  entries in this bucket would mean the host consolidation was missing.
- `/contact` is known to Google because the sitemap listed it until
  2026-09-02. Nothing links to it any more, so it ages out of the report on
  its own.

Two consequences worth writing down, because both mistakes are easy to make:

1. **Do not press "Validate fix" on this bucket.** Validation asks Google to
   confirm the URLs stopped redirecting. They still redirect, and they should,
   so the validation fails and tells you nothing.
2. **Do not remove a redirect to clear the report.** Deleting the `/contact`
   redirect turns a 308 into a 404 for anyone still holding the old link, and
   dropping the apex or duplicate-host redirect re-opens the duplicate-URL
   space that the 2026-09-02 indexation closure was written to shut.

What *would* be a real defect, and what to check instead:

- the canonical URL itself redirecting — if `https://www.tempodelay.tech/` ever
  appears in this bucket, the Vercel project has `www` and the apex the wrong
  way round, and nothing can be indexed;
- a redirecting URL appearing in a current sitemap (`verify:dist` fails the
  build on this for Tempo Delay, `npm run check` for the hub);
- an internal link on any surface pointing at a retired route.

The healthy signal is not an empty "Page with redirect" list. It is the
sitemap's URLs sitting under **Indexed**, which is a separate row in the same
report.

Recorded with the Tempo Delay cookie-consent update on 2026-09-06, extended
on 2026-09-06 with the deployment-provenance and indexing rules, and extended
on 2026-09-07 to cover the `zio-audio` artist surface and record its
`zio-consent` exemption. The source
commit and the production deployment URL are recorded in the change commit and
release notes; this document is the durable architecture rule, not a copy of a
Vercel deployment.
