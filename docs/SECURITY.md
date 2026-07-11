# Security Policy

The Great Filter (filter.nixfred.com) is a public, MIT licensed, educational Fermi paradox simulator. This policy states which versions are supported, how to report a vulnerability privately, how secrets are handled, and the scope of the project.

## Supported versions

Only the current production release served at https://filter.nixfred.com is supported. Preview deployments and older tags are not supported and receive no security fixes. There is no long term support branch.

| Version | Supported |
|---|---|
| Current production (filter.nixfred.com) | Yes |
| Preview deployments | No |
| Older tags | No |

## Reporting a vulnerability

Report privately. Do not open a public issue for a security problem.

1. Preferred: open a private security advisory through GitHub on the repository at https://github.com/nixfred/filter under the Security tab, using "Report a vulnerability" (GitHub private vulnerability reporting).
2. Alternative: email frednix@gmail.com with "The Great Filter security" in the subject.

Please include the affected URL or file, a description of the issue, and steps to reproduce it. A short proof of concept helps.

### Response expectation

This is a solo maintained educational project, not a funded product. Expect an acknowledgement within about seven days and a status update within about thirty days. There is no guaranteed fix window and no bug bounty. Fixes are prioritized by severity and by risk to visitors.

## Scope

In scope:

1. Cross site scripting or code injection reachable through the shared scenario URL or any application input.
2. A Content Security Policy weakness or a missing security header that raises real risk.
3. Exposure of a secret, credential, or source map in the repository, build artifacts, or the deployed site.
4. A supply chain issue such as a vulnerable or malicious dependency.
5. A continuous integration or deployment weakness, for example a workflow that would leak credentials to a fork pull request.

Out of scope:

1. There is no server, no database, and no backend in this version. The site is static assets plus client side simulation. Reports assuming a server side component do not apply.
2. Denial of service that only affects the reporter's own browser tab, for example running a deliberately extreme local simulation. The simulation is client side and bounded; it does not affect shared infrastructure.
3. Findings against preview deployments, which are access controlled and not a supported surface.
4. Missing headers or configuration that carry no practical risk, reported only from an automated scanner without impact.

## Secret handling

1. No secret is committed to source, printed in a workflow log, embedded in a build artifact, or shipped in browser code.
2. Deployment credentials live only in GitHub environment secrets and are scoped as narrowly as practical to Cloudflare Pages deployment for one account.
3. GitHub secret scanning and push protection are enabled on the repository.
4. The Cloudflare Web Analytics beacon token that appears in the page HTML is a public site identifier, not a credential.
5. Analytics are cookieless and production only. No personal data is collected, no session replay, no fingerprinting.

## Safe harbor

Good faith security research on the production site is welcome. Please avoid privacy violations, avoid degrading the service for other visitors, and give a reasonable time to fix before any public disclosure. Testing against your own browser session only is expected, since the application runs entirely in the client.
</content>
