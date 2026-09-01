import { PluginShot } from './PluginShot';
import { Section } from './Section';

export const TempoDelayInterface = () => (
  <Section
    id="interface"
    eyebrow="The interface"
    title="One window, nothing buried"
    lede="The delay engine sits on the surface: sync, divisions, independent feedback per side, width and mix. Tone, modulation and routing are one tab away, never a nested page."
  >
    <PluginShot
      name="StudioZIO Tempo Delay 4.0.1"
      caption="Interface illustration — drawn, not a screen capture. Values shown are the default preset."
    >
      <svg viewBox="0 0 1160 810" role="img" aria-labelledby="td-gui-title" className="gui-render" xmlns="http://www.w3.org/2000/svg">
      <title id="td-gui-title">Illustration of the Tempo Delay interface: the primary delay engine with tempo sync, note divisions, independent feedback, width and mix, and the tone and filters tab.</title>
      <rect width="1160" height="810" rx="14" fill="var(--background)" stroke="var(--border)"/>
      <rect x="20" y="20" width="1120" height="64" rx="10" fill="var(--surface-raised)" stroke="var(--border)"/>
      <rect x="20" y="20" width="4" height="64" rx="2" fill="var(--primary)"/>
      <text x="42" y="50" fontFamily="var(--font-mono)" fontSize="17" fill="var(--primary-text)" textAnchor="start" fontWeight="700" letterSpacing="1.2">STUDIOZIO</text>
      <text x="160" y="50" fontFamily="var(--font-mono)" fontSize="14" fill="var(--foreground)" textAnchor="start" fontWeight="600" letterSpacing="2">TEMPO DELAY</text>
      <text x="42" y="70" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted-foreground)" textAnchor="start" fontWeight="400" letterSpacing="1.4">v4.0.1  |  AU / VST3 / STANDALONE</text>
      <rect x="1010" y="42" width="38" height="20" rx="10" fill="var(--primary)"/>
      <circle cx="1037" cy="52" r="7" fill="var(--foreground)"/>
      <text x="1060" y="57" fontFamily="var(--font-mono)" fontSize="11" fill="var(--foreground)" textAnchor="start" fontWeight="600" letterSpacing="1.4">POWER</text>
      <rect x="20" y="100" width="44" height="38" rx="8" fill="var(--surface-overlay)" stroke="var(--border)"/>
      <text x="42" y="124" fontFamily="var(--font-mono)" fontSize="13" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="1.4">&lt;</text>
      <rect x="72" y="100" width="44" height="38" rx="8" fill="var(--surface-overlay)" stroke="var(--border)"/>
      <text x="94" y="124" fontFamily="var(--font-mono)" fontSize="13" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="1.4">&gt;</text>
      <rect x="128" y="100" width="96" height="38" rx="8" fill="var(--surface-overlay)" stroke="var(--border)"/>
      <text x="176" y="124" fontFamily="var(--font-mono)" fontSize="10" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="1.4">BROWSE</text>
      <text x="246" y="124" fontFamily="var(--font-mono)" fontSize="11" fill="var(--muted-foreground)" textAnchor="start" fontWeight="400" letterSpacing="1.4">PRESET: Default Stereo Delay</text>
      <text x="950" y="124" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted-foreground)" textAnchor="end" fontWeight="400" letterSpacing="1.4">CHARACTER</text>
      <rect x="970" y="100" width="170" height="38" rx="8" fill="var(--surface-overlay)" stroke="var(--primary)"/>
      <circle cx="988" cy="119" r="4" fill="var(--primary)"/>
      <text x="1000" y="124" fontFamily="var(--font-mono)" fontSize="11" fill="var(--foreground)" textAnchor="start" fontWeight="400" letterSpacing="1.4">Digital</text>
      <rect x="20" y="158" width="1120" height="240" rx="10" fill="var(--surface-raised)" stroke="var(--border)"/>
      <text x="36" y="180" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted-foreground)" textAnchor="start" fontWeight="400" letterSpacing="1.6">PRIMARY DELAY ENGINE</text>
      <rect x="38" y="200" width="38" height="20" rx="10" fill="var(--primary)"/>
      <circle cx="65" cy="210" r="7" fill="var(--foreground)"/>
      <text x="86" y="215" fontFamily="var(--font-mono)" fontSize="10" fill="var(--foreground)" textAnchor="start" fontWeight="400" letterSpacing="1.4">TEMPO SYNC</text>
      <rect x="188" y="196" width="78" height="36" rx="8" fill="var(--surface-overlay)" stroke="var(--border)"/>
      <text x="227" y="219" fontFamily="var(--font-mono)" fontSize="11" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="1.4">TAP</text>
      <text x="128" y="258" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="400" letterSpacing="1.4">HOST TEMPO</text>
      <text x="128" y="288" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="400" letterSpacing="1.4">UNAVAILABLE</text>
      <text x="36" y="350" fontFamily="var(--font-mono)" fontSize="8" fill="var(--muted-foreground)" textAnchor="start" fontWeight="400" letterSpacing="1.4">LEFT</text>
      <rect x="72" y="332" width="96" height="32" rx="6" fill="var(--surface-overlay)" stroke="var(--primary)"/>
      <circle cx="86" cy="348" r="3.5" fill="var(--primary)"/>
      <text x="96" y="353" fontFamily="var(--font-mono)" fontSize="9" fill="var(--foreground)" textAnchor="start" fontWeight="400" letterSpacing="1.4">1/8D Dot</text>
      <text x="180" y="350" fontFamily="var(--font-mono)" fontSize="8" fill="var(--muted-foreground)" textAnchor="start" fontWeight="400" letterSpacing="1.4">RIGHT</text>
      <rect x="216" y="332" width="98" height="32" rx="6" fill="var(--surface-overlay)" stroke="var(--primary)"/>
      <circle cx="230" cy="348" r="3.5" fill="var(--primary)"/>
      <text x="240" y="353" fontFamily="var(--font-mono)" fontSize="9" fill="var(--foreground)" textAnchor="start" fontWeight="400" letterSpacing="1.4">1/8 Eighth</text>
      <text x="330" y="200" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.8">MANUAL BPM</text>
      <g>
      <circle cx="330" cy="270" r="38" fill="none" stroke="var(--surface-control)" strokeWidth="7.6"/>
      <circle cx="330" cy="270" r="38" fill="none" stroke="var(--primary)" strokeWidth="7.6" strokeLinecap="round" pathLength="100" strokeDasharray="22.50 100" transform="rotate(135 330 270)"/>
      <line x1="330" y1="270" x2="301.7" y2="249.4" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <text x="330" y="334" fontFamily="var(--font-mono)" fontSize="10" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.4">120.0 BPM</text>
      <text x="418" y="200" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.8">DELAY L</text>
      <g opacity="0.45">
      <circle cx="418" cy="270" r="38" fill="none" stroke="var(--surface-control)" strokeWidth="7.6"/>
      <circle cx="418" cy="270" r="38" fill="none" stroke="var(--primary)" strokeWidth="7.6" strokeLinecap="round" pathLength="100" strokeDasharray="31.50 100" transform="rotate(135 418 270)"/>
      <line x1="418" y1="270" x2="405.1" y2="237.5" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <text x="418" y="334" fontFamily="var(--font-mono)" fontSize="10" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.4">375.0 ms</text>
      <text x="506" y="200" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.8">DELAY R</text>
      <g opacity="0.45">
      <circle cx="506" cy="270" r="38" fill="none" stroke="var(--surface-control)" strokeWidth="7.6"/>
      <circle cx="506" cy="270" r="38" fill="none" stroke="var(--primary)" strokeWidth="7.6" strokeLinecap="round" pathLength="100" strokeDasharray="37.50 100" transform="rotate(135 506 270)"/>
      <line x1="506" y1="270" x2="506.0" y2="235.0" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <text x="506" y="334" fontFamily="var(--font-mono)" fontSize="10" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.4">250.0 ms</text>
      <text x="594" y="200" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.8">FEEDBACK L</text>
      <g>
      <circle cx="594" cy="270" r="38" fill="none" stroke="var(--surface-control)" strokeWidth="7.6"/>
      <circle cx="594" cy="270" r="38" fill="none" stroke="var(--primary)" strokeWidth="7.6" strokeLinecap="round" pathLength="100" strokeDasharray="30.00 100" transform="rotate(135 594 270)"/>
      <line x1="594" y1="270" x2="578.1" y2="238.8" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <text x="594" y="334" fontFamily="var(--font-mono)" fontSize="10" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.4">40.0 %</text>
      <text x="682" y="200" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.8">FEEDBACK R</text>
      <g>
      <circle cx="682" cy="270" r="38" fill="none" stroke="var(--surface-control)" strokeWidth="7.6"/>
      <circle cx="682" cy="270" r="38" fill="none" stroke="var(--primary)" strokeWidth="7.6" strokeLinecap="round" pathLength="100" strokeDasharray="30.00 100" transform="rotate(135 682 270)"/>
      <line x1="682" y1="270" x2="666.1" y2="238.8" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <text x="682" y="334" fontFamily="var(--font-mono)" fontSize="10" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.4">40.0 %</text>
      <circle cx="790" cy="270" r="10" fill="var(--surface-control)"/>
      <text x="806" y="275" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted-foreground)" textAnchor="start" fontWeight="400" letterSpacing="1.4">PING-P</text>
      <text x="898" y="200" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.8">WIDTH</text>
      <g>
      <circle cx="898" cy="270" r="44" fill="none" stroke="var(--surface-control)" strokeWidth="8.8"/>
      <circle cx="898" cy="270" r="44" fill="none" stroke="var(--primary)" strokeWidth="8.8" strokeLinecap="round" pathLength="100" strokeDasharray="75.00 100" transform="rotate(135 898 270)"/>
      <line x1="898" y1="270" x2="927.0" y2="299.0" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <text x="898" y="334" fontFamily="var(--font-mono)" fontSize="10" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.4">100.0 %</text>
      <text x="1016" y="200" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.8">MIX</text>
      <g>
      <circle cx="1016" cy="270" r="44" fill="none" stroke="var(--surface-control)" strokeWidth="8.8"/>
      <circle cx="1016" cy="270" r="44" fill="none" stroke="var(--primary)" strokeWidth="8.8" strokeLinecap="round" pathLength="100" strokeDasharray="26.25 100" transform="rotate(135 1016 270)"/>
      <line x1="1016" y1="270" x2="989.4" y2="238.8" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <text x="1016" y="334" fontFamily="var(--font-mono)" fontSize="10" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.4">35.0 %</text>
      <rect x="20.0" y="418" width="365.3333333333333" height="46" rx="8" fill="var(--primary)" stroke="var(--primary)"/>
      <text x="202.66666666666666" y="447" fontFamily="var(--font-mono)" fontSize="11" fill="var(--primary-foreground)" textAnchor="middle" fontWeight="600" letterSpacing="1.4">TONE &amp; FILTERS</text>
      <rect x="397.3333333333333" y="418" width="365.3333333333333" height="46" rx="8" fill="var(--surface-raised)" stroke="var(--border)"/>
      <text x="580.0" y="447" fontFamily="var(--font-mono)" fontSize="11" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="600" letterSpacing="1.4">MODULATION</text>
      <rect x="774.6666666666666" y="418" width="365.3333333333333" height="46" rx="8" fill="var(--surface-raised)" stroke="var(--border)"/>
      <text x="957.3333333333333" y="447" fontFamily="var(--font-mono)" fontSize="11" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="600" letterSpacing="1.4">ADVANCED &amp; ROUTING</text>
      <rect x="20" y="482" width="1120" height="250" rx="10" fill="var(--surface-raised)" stroke="var(--border)"/>
      <text x="36" y="506" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted-foreground)" textAnchor="start" fontWeight="400" letterSpacing="1.6">FEEDBACK TONE &amp; SATURATION</text>
      <line x1="20" y1="522" x2="1140" y2="522" stroke="var(--hairline)"/>
      <text x="420.0" y="560" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="400" letterSpacing="1.0">HIGH-PASS</text>
      <g>
      <circle cx="420.0" cy="618" r="34" fill="none" stroke="var(--surface-control)" strokeWidth="6.8"/>
      <circle cx="420.0" cy="618" r="34" fill="none" stroke="var(--primary)" strokeWidth="6.8" strokeLinecap="round" pathLength="100" strokeDasharray="7.50 100" transform="rotate(135 420.0 618)"/>
      <line x1="420.0" y1="618" x2="390.5" y2="627.6" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <text x="420.0" y="680" fontFamily="var(--font-mono)" fontSize="10" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.4">80 Hz</text>
      <text x="580.0" y="560" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="400" letterSpacing="1.0">LOW-PASS</text>
      <g>
      <circle cx="580.0" cy="618" r="34" fill="none" stroke="var(--surface-control)" strokeWidth="6.8"/>
      <circle cx="580.0" cy="618" r="34" fill="none" stroke="var(--primary)" strokeWidth="6.8" strokeLinecap="round" pathLength="100" strokeDasharray="46.50 100" transform="rotate(135 580.0 618)"/>
      <line x1="580.0" y1="618" x2="596.6" y2="591.8" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <text x="580.0" y="680" fontFamily="var(--font-mono)" fontSize="10" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.4">8.00 kHz</text>
      <text x="740.0" y="560" fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted-foreground)" textAnchor="middle" fontWeight="400" letterSpacing="1.0">SATURATION</text>
      <g>
      <circle cx="740.0" cy="618" r="34" fill="none" stroke="var(--surface-control)" strokeWidth="6.8"/>
      <circle cx="740.0" cy="618" r="34" fill="none" stroke="var(--primary)" strokeWidth="6.8" strokeLinecap="round" pathLength="100" strokeDasharray="22.50 100" transform="rotate(135 740.0 618)"/>
      <line x1="740.0" y1="618" x2="714.9" y2="599.8" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      <text x="740.0" y="680" fontFamily="var(--font-mono)" fontSize="10" fill="var(--foreground)" textAnchor="middle" fontWeight="400" letterSpacing="0.4">30.0 %</text>
      <rect x="20" y="758" width="1120" height="34" rx="8" fill="var(--surface-overlay)" stroke="var(--hairline)"/>
      <text x="38" y="780" fontFamily="var(--font-mono)" fontSize="9" fill="var(--primary-text)" textAnchor="start" fontWeight="600" letterSpacing="1.4">READY</text>
      <text x="96" y="780" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted-foreground)" textAnchor="start" fontWeight="400" letterSpacing="1.4">48.0 kHz  |  REALTIME SAFE  |  32 APVTS PARAMETERS</text>
      <text x="1122" y="780" fontFamily="var(--font-mono)" fontSize="9" fill="var(--muted-foreground)" textAnchor="end" fontWeight="400" letterSpacing="1.4">TEMPO SYNC: OK  |  CUTOFF CROSSING PROTECTION: ENFORCED</text>
      </svg>
    </PluginShot>
  </Section>
);
