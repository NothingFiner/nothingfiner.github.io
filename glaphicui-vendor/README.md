# glaphicUI — the deploy snapshot

The vite alias prefers the real sibling repo at `../glaphicUI/src`.
The CI runner checks out only this repo, so the deploy build falls
back to this committed copy of the library source (vite.config.ts).

- Pinned at glaphicUI `2ffa5ce4fc924a7c290fed6c31f322da96e1f63d`
  ("convergence: square-edged fly-together…"), 2026-11-06.
- Refresh: `rm -rf glaphicui-vendor && mkdir glaphicui-vendor &&
  cp -R ../glaphicUI/src glaphicui-vendor/src`.
- Update this line with the new pin at every refresh, and refresh
  before a deploy whose design rides the library's newer work.
