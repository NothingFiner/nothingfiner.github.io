# glaphicUI — the deploy snapshot

The vite alias prefers the real sibling repo at `../glaphicUI/src`.
The CI runner checks out only this repo, so the deploy build falls
back to this committed copy of the library source (vite.config.ts).

- Pinned at glaphicUI `eacf65c` (the Prints-lab commit, 2026-11-06),
  refreshed 2026-11-07 from the working tree, which additionally
  carries the tape ink token's rename (`--glaphic-tape-hot` →
  `--glaphic-tape-color`) and the a11y round: the switch's
  accessible-name `label` property and the pool menu's navigation
  landmark (both awaiting the library's next cut).
- Refresh: `rm -rf glaphicui-vendor && mkdir glaphicui-vendor &&
  cp -R ../glaphicUI/src glaphicui-vendor/src`.
- Update this line with the new pin at every refresh, and refresh
  before a deploy whose design rides the library's newer work.
