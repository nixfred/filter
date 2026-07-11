# PENDING

Open decisions that could not be safely inferred. Every item has an executable fallback, so none of these silently blocks /goal.

## P001 Preview deployment access

Decision needed: should pull request preview URLs be public, or stay behind Cloudflare Access?
Owner: Fred.
Deadline gate: G6 (CI/CD configuration).
Safe fallback: protect previews with Cloudflare Access, one time PIN to frednix@gmail.com (ruling R012).
Impact of fallback: Fred authenticates once per browser to view previews, nobody else sees unfinished work.
Requirements affected: SEC008, SEC010.
Status: open.

## P002 Social preview image content

Decision needed: should the social card show a generated galaxy render, the title treatment, or a contact event (packet Q158 and Q159)?
Owner: Fred, with a proposal from the design pass.
Deadline gate: G5 (design refinement).
Safe fallback: generated galaxy render from an actual simulation frame with the title THE GREAT FILTER, produced from original project artwork per the manifest rule.
Impact of fallback: a good but not necessarily final card, replaceable in one commit.
Requirements affected: REL005.
Status: open.

## P003 Final launch approval

Decision needed: Fred approves the final visual and narrative treatment (packet definition of done item 15).
Owner: Fred.
Deadline gate: G-LAUNCH.
Safe fallback: none by design. This is a deliberate MANUAL blocking gate, the one place the playbook allows a hard stop for Fred's judgment.
Impact: production launch waits for explicit approval.
Requirements affected: REL006.
Status: open.

## P004 Quality threshold confirmation

Decision needed: confirm or adjust the R024 defaults once real measurements exist: calibrated bundle budget promotion values, Lighthouse floors, mobile frame rate targets, and the screen reader matrix.
Owner: Fred, with proposals from the build.
Deadline gate: G7 (release candidate validation).
Safe fallback: the R024 defaults stand as written.
Impact of fallback: gates enforce the proposed numbers, all of which were chosen conservatively.
Requirements affected: NFR001, NFR004, NFR005, ACC002, ACC005.
Status: open.

## P005 Cloudflare deploy token

Decision needed: Fred creates and sets a narrowly scoped Cloudflare API token (Account, Cloudflare Pages, Edit) as the CLOUDFLARE_API_TOKEN GitHub secret.
Owner: Fred (only he should mint the scoped token).
Deadline gate: G-LAUNCH (the deploy cannot run without it).
Safe fallback: the deploy workflows skip cleanly and report the skip; all other CI runs and gates pass. No pipeline breakage while the token is absent.
Impact of fallback: preview and production deploys do not run until the token is set. Everything else, including the full quality gate, runs.
Requirements affected: INT002, INT003, OPS005.
Command: gh secret set CLOUDFLARE_API_TOKEN --repo nixfred/filter
Status: open.
