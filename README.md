# StudioZIO Tempo Delay (Release 4.0.3 - Schema 8)

![Plugin Formats](https://img.shields.io/badge/Formats-AU%20%7C%20VST3%20%7C%20AAX%20%7C%20Standalone-22D3EE?style=for-the-badge&logo=apple)
![Platform Support](https://img.shields.io/badge/Platform-macOS%20Apple%20Silicon%20(arm64)-F5A524?style=for-the-badge&logo=apple)
![License](https://img.shields.io/badge/License-Proprietary-gray?style=for-the-badge)

> **Official Product Web Application & Production Technical Documentation for StudioZIO Tempo Delay**
> 
> *Modern stereo delay featuring independent left/right timing, three character modes, advanced routing, modulation, ducking, diffusion, freeze and reverse processing.*

---

## 🎵 Product Baseline & Verified Capabilities

**StudioZIO Tempo Delay** is a modern stereo delay available as native Audio Unit (AUv2), VST3, AAX, and Standalone application for macOS Apple Silicon (arm64) systems.

- **Current Release**: 4.0.3 (Schema 8)
- **Validated Operating System**: macOS 12+ (Apple Silicon arm64: M1 / M2 / M3 / M4)
- **Validated DAWs**: Logic Pro, REAPER
- **APVTS Parameters**: 32 automatable parameters
- **Latency**: Zero reported processing latency

---

## ✨ Verified Feature Matrix

### Delay Engine
- Independent Left Delay (ms / note division)
- Independent Right Delay (ms / note division)
- Tempo Sync & Manual BPM (40–300 BPM)
- Independent Musical Note Divisions (16 grid subdivisions)
- Stereo Width Adjustment (0–200%)
- Feedback Left & Feedback Right
- Classic Stereo Ping-Pong Routing Mode

### Character System
- **Digital**: Clean, full bandwidth, transparent response.
- **Tape**: Warmer high-frequency response with musical saturation.
- **Analog**: Darker, vintage-inspired response with stronger coloration.

### Advanced Processing & Tone
- **High-Pass Filter** (12 dB/oct Butterworth)
- **Low-Pass Filter** (12 dB/oct Butterworth)
- **Feedback Saturation**
- **Freeze** (infinite buffer capture)
- **Reverse** (backward repeat playback)
- **Diffusion** (ambient tap smearing)
- **Ducking Engine** (Ducking Amount, Attack, Release)

### Gain Structure & Modulation
- **Gain Controls**: Input Trim, Wet Gain, Output Trim (-24 to +12 dB)
- **LFO Modulation**: Enable, Rate, Depth, Stereo Spread, Tempo Sync, Musical Division

### System Capabilities
- Integrated Preset Browser (Factory & User Presets)
- Host State Restore & Full DAW Automation
- 32 Automatable APVTS Parameters

---

## 🚀 Deployment Quickstart

The website toolchain requires Node.js 22.12 or newer within the Node 22 release line.

```bash
git clone https://github.com/StudioZIO/TempoDelay.git
cd TempoDelay
npm ci
npm run typecheck
npm run build
npm run verify:dist
```

Use `npm run dev` for local development and `npm run preview` to serve the generated production output.

### Vercel Deployment

**Production is deployed by the Vercel Git integration, from `main`, and by nothing else.** The Vercel project `tempo-delay` runs the `buildCommand` in `vercel.json` (`npm run typecheck && npm run build && npm run verify:dist`) and serves `dist/`. Every production deployment must name the commit it was built from. Do not run `vercel deploy` or `vercel --prod` from a workstation; to re-deploy without a content change, use Redeploy on the latest `main` deployment in the Vercel dashboard. The rule for every StudioZIO surface is in [`docs/CANONICAL-ARCHITECTURE.md`](docs/CANONICAL-ARCHITECTURE.md).

Before merging, run the full local gate:

```bash
npm run typecheck && npm run build && npm run verify:dist && npm run verify:a11y \
  && npm run assemble:vercel && npm run verify:vercel-config
```

`.github/workflows/deploy.yml` is a separate, manually triggered **preview** workflow. It installs the committed lockfile, typechecks and builds the application, verifies both `dist/` and the static payload created by the pinned Vercel CLI, uploads that exact `.vercel/output` as a commit-addressed artifact, and publishes it with `vercel deploy --prebuilt --target=preview`. It never targets production. The repository root and raw TypeScript source are not public deployment artifacts.

---

## 📜 Attribution

**StudioZIO** is an independent audio software company founded by producer and recording artist **[ZIO](https://zio-audio.vercel.app/)**.

© 2026 **StudioZIO**. All rights reserved.
