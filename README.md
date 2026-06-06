# granite-json-tree-viewer

> A JSON tree viewer custom element, built with [Lit](https://lit.dev)

Based on [summerstyle/jsonTreeViewer](https://github.com/summerstyle/jsonTreeViewer),
vendored and modernized in [`src/jsontree.js`](src/jsontree.js) (see
[Vendored library](#vendored-library) below).

## Usage

```bash
npm i @granite-elements/granite-json-tree-viewer
```

```html
<script type="module">
  import '@granite-elements/granite-json-tree-viewer';
</script>

<granite-json-tree-viewer
    data='{"firstName":"John","lastName":"Smith","phones":["123-45-67","987-65-43"]}'></granite-json-tree-viewer>
```

The `data` attribute takes a JSON string; the `data` property takes an object
or an array. The root must be an object or an array.

### Interactions

- Click on an object/array label or on `…` to expand/collapse it
  (with Ctrl/Cmd held: recursively)
- Alt+click on a label to mark/unmark a node
- Shift+click on a label fires a `jsontree-jsonpath` event with the
  JSON-path of the node

### Attributes and properties

| Name | Type | Description |
|------|------|-------------|
| `data` | Object \| Array | The JSON data to display |
| `sort-keys` / `sortKeys` | Boolean | Sort object keys alphabetically (default: insertion order is preserved) |

### Methods

| Method | Description |
|--------|-------------|
| `expand([filterFunc])` | Expands all nodes recursively, or only the direct children matching `filterFunc` |
| `collapse()` | Collapses all nodes recursively |
| `toSourceJSON([isPrettyPrinted])` | Returns the source JSON as a string |
| `unmarkAll()` | Unmarks all marked nodes |
| `tree` (getter) | The underlying `JsonTree` instance, for advanced use (`findAndHandle()`, node marking…) |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `jsontree-jsonpath` | `{ path, dotPath, node }` | Fired on Shift+click on a node label |

### Styling

CSS custom properties:

| Custom property | Description | Default |
|-----------------|-------------|---------|
| `--jsontree-font-family` | Font of the tree | `'PT Mono', monospace` |
| `--jsontree-font-size` | Font size of the tree | `14px` |
| `--jsontree-label-color` | Color of the JSON labels | `#000` |
| `--jsontree-string-color` | Color of string values | `#025900` |
| `--jsontree-number-color` | Color of number values | `#000E59` |
| `--jsontree-boolean-color` | Color of boolean values | `#600100` |
| `--jsontree-null-color` | Color of null values | `#777` |
| `--jsontree-marked-background` | Background of marked labels | `#fff2aa` |

For anything else, the tree elements expose
[parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part):
`tree`, `node`, `label`, `value`, `value-string`, `value-number`,
`value-boolean`, `value-null`, `value-object`, `value-array`,
`expand-button`, `show-more`, `child-nodes`.

```css
granite-json-tree-viewer::part(label) {
  color: #444488;
}
```

## Vendored library

The original [jsonTreeViewer](https://github.com/summerstyle/jsonTreeViewer)
library (MIT, © Vera Lobacheva) is vendored in [`src/jsontree.js`](src/jsontree.js)
as an ES module, with some fixes:

- the DOM is built with `createElement`/`textContent` instead of `innerHTML`,
  fixing the XSS vulnerability reported in
  [summerstyle/jsonTreeViewer#21](https://github.com/summerstyle/jsonTreeViewer/pull/21)
  for both simple and complex nodes
- `alert()` calls replaced by the `jsontree-jsonpath` event and a thrown
  `TypeError` on invalid root data
- object key order is preserved by default (opt-in `sortKeys` option)
- `toSourceJSON(true)` returns a real pretty-printed JSON string instead of HTML

## Development

```bash
npm install
npm start     # serves the demo at demo/
npm test      # runs the test suite with @web/test-runner
```

## History

Versions 1.x of this element were based on Polymer 2.x and Bower.
Version 2.0.0 is a full rewrite with Lit; the Polymer `@apply` styling
mixins (`--jsontree-bg`, `--jsontree-tree`…) are replaced by the CSS custom
properties and `::part()`s documented above.

## License

[MIT](LICENSE) © Horacio Gonzalez. Vendored jsonTree library:
MIT © Vera Lobacheva.
