import React, { useState, useMemo } from 'react';
import { APVTS_PARAMETERS } from '../data/parameters';

export const ParameterGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeParamId, setActiveParamId] = useState<string>('delay.masterEnable');

  const [paramValues, setParamValues] = useState<Record<string, number | string>>({
    'delay.masterEnable': 1,
    'delay.mode': 0,
    'delay.syncMode': 1,
    'delay.manualBpm': 120,
    'delay.divisionLeft': '1/4',
    'delay.divisionRight': '1/8D',
    'delay.timeMsLeft': 375,
    'delay.timeMsRight': 250,
    'delay.feedbackLeft': 45,
    'delay.feedbackRight': 45,
    'delay.pingPong': 1,
    'delay.highPassHz': 80,
    'delay.lowPassHz': 8000,
    'delay.saturation': 20,
    'delay.width': 120,
    'delay.mix': 35,
    'trim.input': 0,
    'trim.wetGain': 0,
    'trim.output': 0,
    'advanced.freeze': 0,
    'advanced.reverse': 0,
    'advanced.diffusion': 0,
    'ducking.enable': 0,
    'ducking.amount': 50,
    'ducking.attack': 20,
    'ducking.release': 200,
    'mod.enable': 0,
    'mod.rate': 1.0,
    'mod.depth': 25,
    'mod.stereoSpread': 90,
    'mod.tempoSync': 0,
    'mod.division': '1/8'
  });

  const categories = [
    'All',
    'Global & Sync',
    'Character System',
    'L/R Timing',
    'Feedback & Routing',
    'Tone Shaping',
    'Spatial & Output',
    'Gain Structure',
    'Advanced Processing',
    'Ducking Engine',
    'Modulation'
  ];

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

  const handleValueChange = (id: string, val: number | string) => {
    setParamValues((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <section id="parameters" className="py-16 bg-[#14161A] border-b border-gray-800/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#22D3EE] block mb-2">
            APVTS Parameter Manifest
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interactive Parameter Guide
          </h2>
          <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed">
            Exhaustive technical documentation for the 32 automatable APVTS parameters in StudioZIO Tempo Delay (Release 4.0.1). Search controls or test values in the live simulator.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-[#1D2026] p-4 sm:p-6 rounded-2xl border border-gray-800 mb-8 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 32 parameters (e.g., Mode, Ducking, Freeze, Modulation)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#14161A] border border-gray-700/80 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22D3EE] text-sm"
                aria-label="Search Parameters"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Parameter Count Indicator */}
            <div className="text-xs font-semibold text-gray-400 bg-[#14161A] px-3.5 py-2 rounded-xl border border-gray-800 shrink-0 text-center font-mono">
              Showing <span className="text-[#22D3EE] font-bold">{filteredParameters.length}</span> of 32 APVTS parameters
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none" role="tablist" aria-label="Parameter Categories">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[#22D3EE] ${
                    isActive
                      ? 'bg-[#22D3EE] text-[#14161A] shadow-md shadow-[#22D3EE]/20 font-bold'
                      : 'bg-[#14161A] text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout: Left Column Parameter Selector List / Right Column Active Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Parameter Cards List (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            {filteredParameters.length === 0 ? (
              <div className="p-8 text-center bg-[#1D2026] rounded-2xl border border-gray-800 text-gray-400">
                <p>No APVTS parameters match your query "{searchQuery}".</p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="mt-3 px-4 py-2 text-xs font-bold bg-[#22D3EE] text-[#14161A] rounded-lg hover:bg-[#06B6D4]"
                >
                  Reset Search Filters
                </button>
              </div>
            ) : (
              filteredParameters.map((param) => {
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
                    className={`p-4 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#22D3EE] ${
                      isSelected
                        ? 'bg-[#1D2026] border-[#22D3EE] shadow-lg shadow-[#22D3EE]/10'
                        : 'bg-[#1D2026]/60 border-gray-800/80 hover:border-gray-700 hover:bg-[#1D2026]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-[#22D3EE] animate-pulse' : 'bg-gray-600'}`} />
                        <div>
                          <span className="font-bold text-white text-base block">{param.name}</span>
                          <span className="text-[10px] font-mono text-gray-500">{param.id}</span>
                        </div>
                      </div>

                      {/* Current Value Preview */}
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-[#F5A524]">
                          {param.type === 'toggle' 
                            ? (currentValue === 1 ? 'Engaged / On' : 'Bypassed / Off')
                            : (param.type === 'choice' && param.options ? param.options[Number(currentValue)] || currentValue : `${currentValue} ${param.unit || ''}`)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {param.description}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Active Parameter Inspector Card (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="p-6 rounded-2xl bg-[#1D2026] border border-[#22D3EE]/40 shadow-2xl relative overflow-hidden space-y-6">
              
              {/* Decorative Corner Badge */}
              <div className="absolute top-0 right-0 bg-[#22D3EE] text-[#14161A] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl font-mono">
                APVTS Inspector
              </div>

              {/* Parameter Name & ID */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
                  {activeParam.category}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {activeParam.name}
                </h3>
                <code className="text-xs font-mono text-gray-500 block mt-0.5">{activeParam.id}</code>
              </div>

              {/* Control Test Harness */}
              <div className="p-4 rounded-xl bg-[#14161A] border border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Live APVTS Simulator</span>
                  <span className="font-mono text-sm font-bold text-[#F5A524]">
                    {activeParam.type === 'toggle'
                      ? (paramValues[activeParam.id] === 1 ? activeParam.options?.[1] || 'On' : activeParam.options?.[0] || 'Off')
                      : (activeParam.type === 'choice' && activeParam.options ? activeParam.options[Number(paramValues[activeParam.id])] || paramValues[activeParam.id] : `${paramValues[activeParam.id]} ${activeParam.unit || ''}`)}
                  </span>
                </div>

                {/* Control Type Inputs */}
                {activeParam.type === 'toggle' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleValueChange(activeParam.id, 0)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                        paramValues[activeParam.id] === 0
                          ? 'bg-red-500/20 text-red-300 border-red-500/50'
                          : 'bg-[#1D2026] text-gray-400 border-gray-800 hover:text-white'
                      }`}
                    >
                      {activeParam.options?.[0] || 'Off (Bypass)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleValueChange(activeParam.id, 1)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                        paramValues[activeParam.id] === 1
                          ? 'bg-[#22D3EE]/20 text-[#22D3EE] border-[#22D3EE]/50'
                          : 'bg-[#1D2026] text-gray-400 border-gray-800 hover:text-white'
                      }`}
                    >
                      {activeParam.options?.[1] || 'On (Engage)'}
                    </button>
                  </div>
                )}

                {activeParam.type === 'choice' && activeParam.options && (
                  <select
                    value={String(paramValues[activeParam.id])}
                    onChange={(e) => handleValueChange(activeParam.id, e.target.value)}
                    className="w-full py-2 px-3 bg-[#1D2026] border border-gray-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                    aria-label={`Select ${activeParam.name} value`}
                  >
                    {activeParam.options.map((opt, idx) => (
                      <option key={opt} value={idx}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {activeParam.type === 'knob' && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={activeParam.min}
                      max={activeParam.max}
                      step={activeParam.step || 1}
                      value={Number(paramValues[activeParam.id])}
                      onChange={(e) => handleValueChange(activeParam.id, parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#22D3EE] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                      aria-label={`${activeParam.name} range slider`}
                    />
                    <div className="flex justify-between text-[11px] font-mono text-gray-500">
                      <span>{activeParam.min} {activeParam.unit}</span>
                      <span>Default: {activeParam.defaultValue} {activeParam.unit}</span>
                      <span>{activeParam.max} {activeParam.unit}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Functional Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Functional Purpose
                </h4>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {activeParam.description}
                </p>
              </div>

              {/* DSP Engine Technical Implementation */}
              <div className="p-3.5 rounded-xl bg-[#14161A]/80 border border-gray-800/80">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#F5A524] mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  <span>C++ DSP Implementation</span>
                </div>
                <p className="text-xs text-gray-400 font-mono leading-normal">
                  {activeParam.dspDetail}
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
