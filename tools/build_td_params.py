"""Generate src/data/parameters.ts from the parsed plug-in manifest.

Every machine-checkable fact -- id, type, range, step, default, option list --
comes from src/data/apvts.json, which parse_td_params.py extracts from the
plug-in source. Only the prose is written by hand, and it is keyed by the
plug-in's own parameter id, so a parameter that is renamed or removed in the
plug-in fails here instead of silently keeping stale copy.

This file exists because the previous version of parameters.ts was transcribed:
none of its 32 ids matched the plug-in, 18 of 32 carried a wrong range or
default, both note-division lists were in reverse order under different labels,
and Diffusion was documented as a 0-100% knob when the plug-in has an on/off
switch.
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / 'src/data/apvts.json').read_text(encoding='utf-8'))

# category -> the chip it folds onto is decided in parameters.ts; this table
# only says which fine-grained category each parameter belongs to.
PROSE = {
    'master_enable': ('Power', 'Global & Sync',
        'Master DSP processing toggle with click-free crossfaded bypass.',
        'Executes realtime-safe crossfaded bypass without digital transients.'),
    'tempo_sync_enable': ('Tempo Sync', 'Global & Sync',
        'Switches between millisecond delay timing and host tempo sync.',
        'Queries the DAW transport clock, or uses Manual BPM, to turn a note division into a sample interval.'),
    'bpm_manual': ('Manual BPM', 'Global & Sync',
        'Manual project tempo clock source when host transport sync is unlinked.',
        'Provides a deterministic master clock fallback for unlinked standalone or host sessions.'),
    'note_division_left': ('Left Division', 'L/R Timing',
        'Rhythmic note division for the left delay channel.',
        'Selects one of sixteen grid positions, from a whole note down to a 32nd triplet.'),
    'note_division_right': ('Right Division', 'L/R Timing',
        'Rhythmic note division for the right delay channel.',
        'Set independently of the left channel, which is what produces asymmetric stereo patterns.'),
    'delay_ms_left': ('Left Time', 'L/R Timing',
        'Free millisecond delay time for the left channel when Sync is off.',
        'Direct millisecond buffer offset using fractional-sample interpolation.'),
    'delay_ms_right': ('Right Time', 'L/R Timing',
        'Free millisecond delay time for the right channel when Sync is off.',
        'Independent right-channel offset, for slapbacks that are not a musical division.'),
    'feedback_left_pct': ('Feedback Left', 'Feedback & Routing',
        'Feedback gain for the left delay buffer.',
        'Stops short of 100% by design: the loop is bounded so it cannot run away.'),
    'feedback_right_pct': ('Feedback Right', 'Feedback & Routing',
        'Feedback gain for the right delay buffer.',
        'Stops short of 100% by design: the loop is bounded so it cannot run away.'),
    'ping_pong_enable': ('Ping-Pong', 'Feedback & Routing',
        'Engages cross-channel stereo ping-pong routing.',
        'Switches the feedback matrix so repeats alternate across the stereo field.'),
    'hp_filter_hz': ('High-Pass Filter', 'Tone Shaping',
        'High-pass filter inside the feedback loop.',
        'Removes low-end build-up from decaying repeats, so the echo does not crowd the source.'),
    'lp_filter_hz': ('Low-Pass Filter', 'Tone Shaping',
        'Low-pass filter inside the feedback loop.',
        'Darkens successive repeats, which is what makes a long tail sit behind the dry signal.'),
    'feedback_saturation_pct': ('Feedback Saturation', 'Tone Shaping',
        'Soft-clipping stage inside the feedback path.',
        'Adds progressive harmonic content to each pass, so repeats colour as they decay.'),
    'width_pct': ('Stereo Width', 'Spatial & Output',
        'Mid/side width of the wet signal, from mono to twice natural width.',
        'Scales side energy relative to mid.'),
    'mix_pct': ('Mix', 'Spatial & Output',
        'Dry/wet output blend.',
        'Crossfades the unprocessed input against the processed signal.'),
    'input_trim_db': ('Input Trim', 'Gain Structure',
        'Input gain before delay processing.',
        'Scales the signal entering the delay buffer.'),
    'wet_gain_db': ('Wet Gain', 'Gain Structure',
        'Level of the wet path alone.',
        'Adjusts the processed signal before it is summed with the dry.'),
    'output_trim_db': ('Output Trim', 'Gain Structure',
        'Master output level.',
        'Final trim after the dry/wet mix.'),
    'freeze_enable': ('Freeze', 'Advanced Processing',
        'Holds the current buffer contents indefinitely.',
        'Locks buffer playback and mutes new input, so the captured phrase loops.'),
    'reverse_enable': ('Reverse', 'Advanced Processing',
        'Plays the delay buffer backwards.',
        'Reads the buffer in reverse frame order.'),
    'diffusion_enable': ('Diffusion', 'Advanced Processing',
        'Smears discrete repeats into a denser tail.',
        'An all-pass network on the delay taps. It is a switch, not an amount.'),
    'ducking_enable': ('Ducking Enable', 'Ducking Engine',
        'Ducks the wet signal while the input is playing.',
        'Tracks the input envelope and attenuates the wet path against it.'),
    'ducking_amount_pct': ('Ducking Amount', 'Ducking Engine',
        'How far the wet signal drops while the input is present.',
        'Sets the maximum attenuation applied to the wet path.'),
    'ducking_attack_ms': ('Ducking Attack', 'Ducking Engine',
        'How quickly the duck engages on a transient.',
        'Skewed towards the short end, where the useful settings are.'),
    'ducking_release_ms': ('Ducking Release', 'Ducking Engine',
        'How quickly the wet signal returns after the input stops.',
        'Skewed towards the short end, where the useful settings are.'),
    'modulation_enable': ('Modulation Enable', 'Modulation',
        'Engages LFO modulation of the delay time.',
        'A low-frequency oscillator moves the delay tap read position.'),
    'modulation_depth_pct': ('Modulation Depth', 'Modulation',
        'How far the LFO moves the delay time.',
        'Off by default, so enabling modulation alone changes nothing until depth is raised.'),
    'modulation_rate_hz': ('Modulation Rate', 'Modulation',
        'LFO speed when modulation is not tempo-synced.',
        'Skewed so the slow end, where chorus and tape wow live, gets most of the travel.'),
    'modulation_stereo_pct': ('Modulation Stereo Spread', 'Modulation',
        'How far apart the left and right LFOs run.',
        'A percentage, not an angle: 0% moves both channels together, 100% is the widest offset the engine applies.'),
    'modulation_sync_enable': ('Modulation Sync', 'Modulation',
        'Locks the LFO rate to the host tempo.',
        'Replaces the free-running rate with a note division.'),
    'modulation_note_division': ('Modulation Division', 'Modulation',
        'Note division for the tempo-synced LFO.',
        'The same sixteen-position grid the delay times use.'),
    'character_mode': ('Character Mode', 'Character System',
        'Selects between three voicings for the delay path.',
        'Digital is full bandwidth; Tape and Analog each impose their own bandwidth and saturation behaviour.'),
}

# The unit is carried in the id as its own token, but not always the last one:
# delay_ms_left ends in _left. Matching the suffix silently dropped the unit
# from both delay-time controls, so match the token anywhere in the id.
UNITS = {'pct': '%', 'hz': 'Hz', 'ms': 'ms', 'db': 'dB', 'bpm': 'BPM'}


def unit_for(pid):
    for token in pid.split('_'):
        if token in UNITS:
            return UNITS[token]
    return None


def ts(value):
    return json.dumps(value)


missing = [p['id'] for p in MANIFEST['parameters'] if p['id'] not in PROSE]
if missing:
    sys.exit(f'plug-in parameters with no prose entry: {", ".join(missing)}')
stale = [pid for pid in PROSE if pid not in {p['id'] for p in MANIFEST['parameters']}]
if stale:
    sys.exit(f'prose entries for parameters the plug-in no longer has: {", ".join(stale)}')

lines = [
    '/* GENERATED by tools/build_td_params.py from src/data/apvts.json.',
    ' *',
    " * Do not hand-edit: ids, types, ranges, defaults and option lists come from",
    ' * the plug-in source via tools/parse_td_params.py. Edit the prose table in',
    ' * build_td_params.py and re-run it.',
    ' *',
    " * Written this way because the previous hand-maintained version published 32",
    ' * parameter ids the plug-in has never had, 18 wrong ranges or defaults, both',
    ' * note-division lists reversed, and Diffusion as a knob when it is a switch.',
    ' */',
    '',
    f"export const PLUGIN_VERSION = {ts(MANIFEST['pluginVersion'])};",
    '',
    'export const APVTS_PARAMETERS = [',
]

for p in MANIFEST['parameters']:
    name, category, description, detail = PROSE[p['id']]
    fields = [f"id: {ts(p['id'])}", f"name: {ts(name)}", f"category: {ts(category)}"]
    if p['type'] == 'bool':
        fields += ['type: "toggle"', f"defaultValue: {ts(bool(p['default']))}"]
    elif p['type'] == 'choice':
        fields += ['type: "choice"', f"defaultValue: {p['default']}",
                   f"options: {ts(p['choices'])}"]
    else:
        fields += ['type: "knob"', f"defaultValue: {p['default']}",
                   f"min: {p['min']}", f"max: {p['max']}"]
        if 'step' in p:
            fields.append(f"step: {p['step']}")
        unit = unit_for(p['id'])
        if not unit:
            sys.exit(f"no unit could be derived from the id {p['id']}; every "
                     'continuous parameter on this page shows one, so a missing '
                     'unit is a naming change this script has not been taught')
        fields.append(f"unit: {ts(unit)}")
    fields += [f"description: {ts(description)}", f"dspDetail: {ts(detail)}"]
    lines.append('  { ' + ', '.join(fields) + ' },')

lines += [
    '] as const;',
    '',
    '/** The filter groups the design system exposes as category chips. */',
    'export const PARAMETER_GROUPS = [',
    "  'Global & Sync',",
    "  'L/R Timing',",
    "  'Tone Shaping',",
    "  'Character System',",
    "  'Ducking Engine',",
    "  'Modulation',",
    "  'Output',",
    '] as const;',
    '',
    'export type ParameterGroup = (typeof PARAMETER_GROUPS)[number];',
    '',
    "/** Folds the manifest's fine-grained categories onto the seven chips. */",
    'export const GROUP_BY_CATEGORY: Record<string, ParameterGroup> = {',
    "  'Global & Sync': 'Global & Sync',",
    "  'L/R Timing': 'L/R Timing',",
    "  'Feedback & Routing': 'L/R Timing',",
    "  'Tone Shaping': 'Tone Shaping',",
    "  'Character System': 'Character System',",
    "  'Advanced Processing': 'Character System',",
    "  'Ducking Engine': 'Ducking Engine',",
    "  Modulation: 'Modulation',",
    "  'Spatial & Output': 'Output',",
    "  'Gain Structure': 'Output',",
    '};',
    '',
]

(ROOT / 'src/data/parameters.ts').write_text('\n'.join(lines), encoding='utf-8')
print(f"generated parameters.ts: {len(MANIFEST['parameters'])} parameters from plug-in {MANIFEST['pluginVersion']}")
