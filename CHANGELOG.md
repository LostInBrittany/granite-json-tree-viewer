# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-06-06

Full rewrite with [Lit](https://lit.dev), replacing Polymer 2.x and Bower.
Published on npm as `@granite-elements/granite-json-tree-viewer`.

### Changed

- **Breaking:** rewritten as a Lit 3 element; HTML imports are gone, the
  element is now loaded as an ES module
  (`import '@granite-elements/granite-json-tree-viewer'`)
- **Breaking:** the Polymer `@apply` styling mixins (`--jsontree-bg`,
  `--jsontree-tree`, `--jsontree-label`…) are replaced by CSS custom
  properties (`--jsontree-font-family`, `--jsontree-string-color`…) and
  `::part()` selectors (`tree`, `node`, `label`, `value`, `value-string`,
  `expand-button`…)
- **Breaking:** object key order is now preserved by default; the original
  alphabetical sorting is available with the new `sort-keys` attribute
- **Breaking:** Shift+click on a label fires a `jsontree-jsonpath` event
  (`detail: { path, dotPath, node }`) instead of showing an `alert()`
- **Breaking:** invalid root data (not an object or array) now throws a
  `TypeError` instead of showing an `alert()`
- **Breaking:** `toSourceJSON(true)` returns a real pretty-printed JSON
  string instead of an HTML string with `<br/>` and `&nbsp;`
- The [jsonTreeViewer](https://github.com/summerstyle/jsonTreeViewer)
  library is now vendored in `src/jsontree.js` as an ES module instead of
  being fetched at runtime via `iron-ajax` and
  `granite-js-dependencies-grabber`; `icons.svg` is inlined as a data URI
- Relicensed from Apache-2.0 to MIT, matching the vendored library
- Tooling migrated from Bower / `polymer-cli` / `web-component-tester` to
  npm / `@web/dev-server` / `@web/test-runner`

### Added

- `expand([filterFunc])`, `collapse()`, `toSourceJSON([isPrettyPrinted])`
  and `unmarkAll()` methods, and a `tree` getter exposing the underlying
  `JsonTree` instance
- Test suite with `@web/test-runner`, including an XSS regression test

### Fixed

- XSS vulnerability: HTML in JSON keys or values was rendered via
  `innerHTML` ([summerstyle/jsonTreeViewer#21](https://github.com/summerstyle/jsonTreeViewer/pull/21)).
  The vendored library builds the DOM with `createElement`/`textContent`
  exclusively, covering both simple and complex nodes (the upstream PR
  only fixed simple nodes)

### Removed

- **Breaking:** the `cssPath`, `jsPath` and `debug` properties (no longer
  needed, nothing is fetched at runtime)
- Dependencies on `polymer`, `iron-ajax`,
  `granite-js-dependencies-grabber` and `webcomponentsjs`; the only
  runtime dependency is `lit`

## [1.1.0] - 2018-05-06

### Added

- Styling hooks as Polymer `@apply` CSS mixins (`--jsontree-bg`,
  `--jsontree-tree`, `--jsontree-label`, `--jsontree-value`…)

## [1.0.3] - 2018-05-04

### Fixed

- Usage example

## [1.0.0] - 2018-05-04

### Added

- Initial release: Polymer 2.x element wrapping
  [summerstyle/jsonTreeViewer](https://github.com/summerstyle/jsonTreeViewer),
  with a `data` property/attribute

[2.0.0]: https://github.com/LostInBrittany/granite-json-tree-viewer/compare/1.1.0...2.0.0
[1.1.0]: https://github.com/LostInBrittany/granite-json-tree-viewer/compare/1.0.3...1.1.0
[1.0.3]: https://github.com/LostInBrittany/granite-json-tree-viewer/compare/1.0.0...1.0.3
[1.0.0]: https://github.com/LostInBrittany/granite-json-tree-viewer/releases/tag/1.0.0
