# StudioZIO web estate — canonical architecture

This document is the source-of-truth record for the public StudioZIO product
sites. It lives in the canonical Tempo Delay repository so a future website
change has one place to check before touching a product or plugin repository.

## Canonical repositories and production surfaces

| Surface | Canonical repository | Production Vercel project | Public URL |
| --- | --- | --- | --- |
| Hub | `StudioZIO/StudioZIO-Web` | `studiozio` | `https://studiozio.vercel.app/` |
| Mastering Suite | `StudioZIO/StudioZIO-Mastering-Suite-Site` | `studiozio_mastering_suite` | `https://studioziomasteringsuite.vercel.app/` |
| Tempo Delay | `StudioZIO/TempoDelay` | `tempo-delay` | `https://www.tempodelay.tech/` |

Each production surface is deployed from its own canonical repository. The
`StudioZIO-Master-Plugin-Suite` repository is source for the plug-in and is not
a website source-of-truth; website trees must not be copied back into it.

## Shared UI contract

The three sites share the StudioZIO Core Design System v1: the dark blue-black
surface ramp, cyan primary, Space Grotesk display face, Inter Tight body face,
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

## Cookie and analytics contract

All three surfaces use the same Google Analytics 4 property (`G-VL8Z542XMP`)
and Consent Mode v2 behavior:

1. Consent defaults are denied for Türkiye, the EEA, the UK and Switzerland;
   the rest of the network retains the existing granted default.
2. A first visit presents a fixed, accessible “Cookie preference” banner with
   “Decline” and “Accept” actions. It never shifts the page layout.
3. The choice is stored as `studiozio-consent` (`granted` or `denied`) and is
   replayed before the GA4 config call on return visits.
4. The footer always exposes a “Cookies” button so the choice can be reopened
   and withdrawn. The button has visible keyboard focus and an action role.
5. Copy is deliberately plain: Google Analytics counts visits; there is no
   advertising and no profiling.

Tempo Delay implements the same contract in its React/Vite bundle rather than
adding a second executable page script. This preserves the Tempo output
contract: one fingerprinted first-party module, one Google tag, and one inline
GA4 initializer pinned by the Content-Security-Policy hash.

## Change and deployment rule

Website changes start in the matching canonical repository, pass its local
typecheck/build/accessibility/output verifiers, and are then promoted through
the matching Vercel project. Production HTML, download links and screenshots
are verified on the public domain after promotion. Changes in one surface do
not authorize rebuilding or repointing another surface.

Recorded with the Tempo Delay cookie-consent update on 2026-09-06. The source
commit and the production deployment URL are recorded in the change commit and
release notes; this document is the durable architecture rule, not a copy of a
Vercel deployment.
