import { useMemo, useState } from 'react';
import { APVTS_PARAMETERS, GROUP_BY_CATEGORY, PARAMETER_GROUPS } from '../data/parameters';

/* The value shown for each parameter is the plug-in's own default, taken from
   the generated manifest. There used to be a hand-written override table here
   that supplied a different value for every parameter -- none of its ids
   existed in the plug-in, and its numbers disagreed with the plug-in on 18 of
   32 controls. A page documenting defaults must not carry a second, private
   opinion about what they are. */
type Parameter = (typeof APVTS_PARAMETERS)[number];

const formatValue = (parameter: Parameter): string => {
  if (parameter.type === 'toggle') return parameter.defaultValue ? 'On' : 'Off';
  if (parameter.type === 'choice') return parameter.options[parameter.defaultValue] ?? String(parameter.defaultValue);
  // Every continuous parameter carries a unit -- the generator refuses to emit
  // one without it -- so there is no unitless branch to fall back to.
  return `${parameter.defaultValue} ${parameter.unit}`;
};

const groupOf = (parameter: Parameter) => GROUP_BY_CATEGORY[parameter.category] ?? 'Global & Sync';

export const ParameterGuide = () => {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<string>('All');
  const [activeId, setActiveId] = useState<string>(APVTS_PARAMETERS[0].id);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return APVTS_PARAMETERS.filter((parameter) => {
      const matchesGroup = group === 'All' || groupOf(parameter) === group;
      if (!matchesGroup) return false;
      if (!needle) return true;
      return [parameter.name, parameter.id, parameter.description, parameter.dspDetail]
        .some((field) => field.toLowerCase().includes(needle));
    });
  }, [query, group]);

  const active = useMemo(
    () => APVTS_PARAMETERS.find((parameter) => parameter.id === activeId) ?? APVTS_PARAMETERS[0],
    [activeId],
  );

  return (
    <section id="parameters" className="section scroll-mt-24">
      <div className="shell">
        <div className="section-head">
          <p className="eyebrow">APVTS Manifest</p>
          <h2>Every parameter, documented</h2>
          <p className="lede">
            All {APVTS_PARAMETERS.length} automatable APVTS parameters in Tempo Delay, with the purpose of each control and
            the note on how it behaves inside the engine. Ranges and defaults are read from the plug-in
            source, not transcribed.
          </p>
        </div>

        <div className="panel p-4 sm:p-5 grid gap-4 mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              className="field sm:flex-1"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search parameters by name, ID or behaviour"
              aria-label="Search 32 parameters"
            />
            <p className="chip shrink-0" role="status" aria-live="polite">
              Showing {filtered.length} / 32
            </p>
          </div>

          <div className="chip-row" role="group" aria-label="Parameter categories">
            <button
              type="button"
              className="chip"
              aria-pressed={group === 'All'}
              onClick={() => setGroup('All')}
            >
              All
            </button>
            {PARAMETER_GROUPS.map((name) => (
              <button
                key={name}
                type="button"
                className="chip"
                aria-pressed={group === name}
                onClick={() => setGroup(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 param-list">
            {filtered.map((parameter) => (
              <button
                key={parameter.id}
                type="button"
                className="param-row"
                aria-pressed={parameter.id === active.id}
                onClick={() => setActiveId(parameter.id)}
              >
                <span className="row-top">
                  <span>
                    <span className="p-name block">{parameter.name}</span>
                    <span className="p-id">{parameter.id}</span>
                  </span>
                  <span className="p-val">{formatValue(parameter)}</span>
                </span>
                <p>{parameter.description}</p>
              </button>
            ))}

            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">No parameter matches that search.</p>
            ) : null}
          </div>

          <div className="lg:col-span-5">
            <div className="panel inspector">
              <div>
                <p className="eyebrow mb-2">{groupOf(active)}</p>
                <h3>{active.name}</h3>
                <code className="param-id block mt-1">{active.id}</code>
              </div>

              <div className="value-box">
                <h4>APVTS value</h4>
                <span className="v">{formatValue(active)}</span>
              </div>

              <div>
                <h4>Purpose</h4>
                <p>{active.description}</p>
              </div>

              <div className="value-box">
                <h4>C++ implementation</h4>
                <p className="impl">{active.dspDetail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
