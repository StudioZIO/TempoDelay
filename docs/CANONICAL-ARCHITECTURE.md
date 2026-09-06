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

Recorded with the Tempo Delay cookie-consent update on 2026-09-06. The source
commit and the production deployment URL are recorded in the change commit and
release notes; this document is the durable architecture rule, not a copy of a
Vercel deployment.
