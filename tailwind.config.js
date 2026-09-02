/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Every colour utility resolves to a StudioZIO design token declared in
      // src/styles/global.css. No literal colour value lives in this file.
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'surface-raised': 'var(--surface-raised)',
        'surface-overlay': 'var(--surface-overlay)',
        'surface-control': 'var(--surface-control)',
        'muted-foreground': 'var(--muted-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        'primary-deep': 'var(--primary-deep)',
        // The AA-safe step for small accent text; --primary itself measures
        // 4.3:1 here, so prose links use this one instead.
        'primary-text': 'var(--primary-text)',
        signal: 'var(--signal)',
        'signal-foreground': 'var(--signal-foreground)',
        destructive: 'var(--destructive)',
        border: 'var(--border)',
        hairline: 'var(--hairline)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        'meter-low': 'var(--meter-low)',
        'meter-mid': 'var(--meter-mid)',
        'meter-high': 'var(--meter-high)',
      },
      borderColor: {
        DEFAULT: 'var(--border)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        sans: ['"Inter Tight"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        measure: 'var(--measure)',
        shell: 'var(--shell)',
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
        float: 'var(--shadow-float)',
        'ring-primary': 'var(--glow-primary)',
      },
      letterSpacing: {
        tech: '0.18em',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
      },
    },
  },
  plugins: [],
};
