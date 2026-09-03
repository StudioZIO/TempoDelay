"""Extract Tempo Delay's APVTS parameters from the plug-in source.

Parsed rather than transcribed, for the reason the Mastering Suite reference is
parsed: a range or default that changes in the plug-in changes here on the next
run, and a parameter added without being documented shows up as a count
mismatch. Transcribing is how the previous version of this page ended up
publishing parameter ids the plug-in has never had.

The plug-in lives in a different repository from this website, so the source is
read from a sibling checkout and the result is committed as JSON. Point
TD_PLUGIN_ROOT at the checkout, or place it beside this repo as
../studiozio-tempo-delay.
"""
import json
import os
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
PLUGIN = pathlib.Path(
    os.environ.get('TD_PLUGIN_ROOT', ROOT.parent / 'studiozio-tempo-delay')
).resolve()

if not (PLUGIN / 'Source/JucePluginProcessor.cpp').exists():
    sys.exit(f'plug-in source not found under {PLUGIN}; set TD_PLUGIN_ROOT')

PROCESSOR = (PLUGIN / 'Source/JucePluginProcessor.cpp').read_text(encoding='utf-8')
TEMPO = (PLUGIN / 'Source/DSP/TempoSyncUtils.h').read_text(encoding='utf-8')
VERSION = (PLUGIN / 'VERSION').read_text(encoding='utf-8').strip().lstrip('v')


def between(text, start, end):
    i = text.index(start) + len(start)
    return text[i:text.index(end, i)]


# ---- note divisions ------------------------------------------------------
# The choice list for every division parameter, in the order the plug-in
# builds it, because the stored value is an index into exactly this order.
DIVISIONS = re.findall(
    r'\{\s*"([^"]+)"\s*,',
    between(TEMPO, 'static const std::vector<NoteDivisionInfo> divisions = {', '};'),
)

LAYOUT = between(
    PROCESSOR,
    'ParameterLayout JucePluginProcessor::createParameterLayout()',
    'return layout;',
)

# ---- named ranges --------------------------------------------------------
# Ranges the layout refers to by name rather than declaring inline. Resolved
# from their definitions so a change to one is picked up here too.
RANGE_CALL = re.compile(
    r'juce::NormalisableRange<float>\(\s*([-\d.]+)f?\s*,\s*([-\d.]+)f?\s*(?:,\s*([-\d.]+)f?\s*)?\)'
)


def named_range(name, text):
    body = text[text.index(name):]
    m = RANGE_CALL.search(body)
    if not m:
        return None
    lo, hi, step = m.group(1), m.group(2), m.group(3)
    out = {'min': float(lo), 'max': float(hi)}
    if step is not None:
        out['step'] = float(step)
    skew = re.search(rf'{re.escape(name)}\.setSkewForCentre\(\s*([-\d.]+)f?\s*\)', text)
    if skew:
        out['skewCentre'] = float(skew.group(1))
    return out


NAMED = {}
for fn in ('makeDelayMillisecondsRange', 'makeFrequencyRange'):
    body = between(PROCESSOR, f'static juce::NormalisableRange<float> {fn}()', '\n}')
    m = RANGE_CALL.search(body)
    entry = {'min': float(m.group(1)), 'max': float(m.group(2))}
    if m.group(3) is not None:
        entry['step'] = float(m.group(3))
    skew = re.search(r'range\.setSkewForCentre\(\s*([-\d.]+)f?\s*\)', body)
    if skew:
        entry['skewCentre'] = float(skew.group(1))
    NAMED[f'{fn}()'] = entry

for local in ('duckAttackRange', 'duckReleaseRange', 'trimRange'):
    if local in LAYOUT:
        NAMED[local] = named_range(local, LAYOUT)

# ---- the layout ----------------------------------------------------------
ADD = re.compile(
    r'std::make_unique<juce::AudioParameter(Bool|Float|Choice)>\('
    r'\s*IDs::(\w+)\s*,\s*"([^"]+)"\s*,\s*(.+?)\)\);',
    re.S,
)

parameters = []
for kind, pid, name, rest in ADD.findall(LAYOUT):
    rest = ' '.join(rest.split())
    entry = {'id': pid, 'name': name, 'type': kind.lower()}

    if kind == 'Bool':
        entry['default'] = rest.strip() == 'true'

    elif kind == 'Choice':
        head, _, tail = rest.rpartition(',')
        entry['default'] = int(tail.strip())
        if 'choices' in head:
            entry['choices'] = DIVISIONS
        else:
            entry['choices'] = re.findall(r'"([^"]*)"', head)
        entry['defaultLabel'] = entry['choices'][entry['default']]

    else:  # Float
        head, _, tail = rest.rpartition(',')
        entry['default'] = float(tail.strip().rstrip('f'))
        head = head.strip()
        if head in NAMED:
            entry.update(NAMED[head])
        else:
            m = RANGE_CALL.search(head)
            if not m:
                # A four-argument range carries its skew factor inline.
                m4 = re.search(
                    r'juce::NormalisableRange<float>\(\s*([-\d.]+)f?\s*,\s*([-\d.]+)f?\s*,'
                    r'\s*([-\d.]+)f?\s*,\s*([-\d.]+)f?\s*\)', head)
                if not m4:
                    sys.exit(f'unparsed range for {pid}: {head}')
                entry.update({'min': float(m4.group(1)), 'max': float(m4.group(2)),
                              'step': float(m4.group(3)), 'skewFactor': float(m4.group(4))})
            else:
                entry['min'] = float(m.group(1))
                entry['max'] = float(m.group(2))
                if m.group(3) is not None:
                    entry['step'] = float(m.group(3))

    parameters.append(entry)

payload = {
    'pluginVersion': VERSION,
    'parameterCount': len(parameters),
    'noteDivisions': DIVISIONS,
    'parameters': parameters,
}

out = ROOT / 'src/data/apvts.json'
out.write_text(json.dumps(payload, indent=2) + '\n', encoding='utf-8')
print(f'parsed {len(parameters)} parameters and {len(DIVISIONS)} note divisions '
      f'from plug-in {VERSION} -> {out.relative_to(ROOT)}')
