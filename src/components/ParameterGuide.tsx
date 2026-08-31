import { useMemo, useState } from 'react';
import { APVTS_PARAMETERS } from '../data/parameters';

export const ParameterGuide = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeParamId, setActiveParamId] = useState('delay.masterEnable');

  const [paramValues] = useState<Record<string, number | string>>({
    'delay.masterEnable': 1, 'delay.mode': 0, 'delay.syncMode': 1, 'delay.manualBpm': 120,
    'delay.divisionLeft': '1/4', 'delay.divisionRight': '1/8D', 'delay.timeMsLeft': 375, 'delay.timeMsRight': 250,
    'delay.feedbackLeft': 45, 'delay.feedbackRight': 45, 'delay.pingPong': 1, 'delay.highPassHz': 80,
    'delay.lowPassHz': 8000, 'delay.saturation': 20, 'delay.width': 120, 'delay.mix': 35,
    'trim.input': 0, 'trim.wetGain': 0, 'trim.output': 0, 'advanced.freeze': 0, 'advanced.reverse': 0,
    'advanced.diffusion': 0, 'ducking.enable': 0, 'ducking.amount': 50, 'ducking.attack': 20, 'ducking.release': 200,
    'mod.enable': 0, 'mod.rate': 1.0, 'mod.depth': 25, 'mod.stereoSpread': 90, 'mod.tempoSync': 0, 'mod.division': '1/8'
  });

  const categories = ['All', 'Global & Sync', 'Character System', 'L/R Timing', 'Feedback & Routing', 'Tone Shaping', 'Spatial & Output', 'Gain Structure', 'Advanced Processing', 'Ducking Engine', 'Modulation'];

  const filteredParameters = useMemo(() => {
    return APVTS_PARAMETERS.filter((param) => {
      const matchesCategory = selectedCategory === 'All' || param.category === selectedCategory;
      const matchesSearch = 
        param.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        param.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        param.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        param.dspDetail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const activeParam = useMemo(() => {
    return APVTS_PARAMETERS.find((p) => p.id === activeParamId) || APVTS_PARAMETERS[0];
  }, [activeParamId]);

  return (
    <section id="parameters" className="py-16 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            APVTS Parameter Manifest
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interactive Parameter Guide
          </h2>
          <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed">
            Exhaustive technical documentation for all 32 automatable APVTS parameters in StudioZIO Tempo Delay (Release 4.0.1).
          </p>
        </div>

        <div className="bg-[#1D2026] p-4 sm:p-6 rounded-2xl border border-gray-800 mb-8 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 32 parameters (e.g., Mode, Ducking, Freeze, Modulation)..."
                className="w-full pl-4 pr-4 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                aria-label="Search Parameters"
              />
            </div>
            <div className="text-xs font-semibold text-gray-400 bg-[#14161A] px-3.5 py-2 rounded-xl border border-gray-800 shrink-0 text-center font-mono">
              Showing <span className="text-[#22D3EE] font-bold">{filteredParameters.length}</span> of 32 APVTS parameters
            </div>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Parameter Categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#22D3EE] text-[#14161A] font-bold'
                    : 'bg-[#14161A] text-gray-300 hover:text-white border border-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-3">
            {filteredParameters.map((param) => {
              const isSelected = activeParam.id === param.id;
              const currentValue = paramValues[param.id] ?? param.defaultValue;
              return (
                <div
                  key={param.id}
                  onClick={() => setActiveParamId(param.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${param.name} parameter`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveParamId(param.id);
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected ? 'bg-[#1D2026] border-[#22D3EE] shadow-lg shadow-[#22D3EE]/10' : 'bg-[#1D2026]/60 border-gray-800/80 hover:bg-[#1D2026]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-[#22D3EE]' : 'bg-gray-600'}`} />
                      <div>
                        <span className="font-bold text-white text-base block">{param.name}</span>
                        <span className="text-[10px] font-mono text-gray-500">{param.id}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#F5A524]">
                      {param.type === 'toggle' ? (currentValue === 1 ? 'On' : 'Off') : (param.type === 'choice' && param.options ? param.options[Number(currentValue)] || currentValue : `${currentValue} ${param.unit || ''}`)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{param.description}</p>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <div className="p-6 rounded-2xl bg-[#1D2026] border border-[#22D3EE]/40 shadow-2xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">{activeParam.category}</span>
                <h3 className="text-2xl font-black text-white mt-1">{activeParam.name}</h3>
                <code className="text-xs font-mono text-gray-500 block mt-0.5">{activeParam.id}</code>
              </div>

              <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">APVTS Simulator</span>
                <p className="text-sm font-bold text-[#F5A524] font-mono">{paramValues[activeParam.id]} {activeParam.unit}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Purpose</h4>
                <p className="text-sm text-gray-200">{activeParam.description}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14161A]/80 border border-gray-800/80">
                <span className="text-xs font-bold text-[#F5A524] block mb-1">C++ Implementation</span>
                <p className="text-xs text-gray-400 font-mono">{activeParam.dspDetail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
