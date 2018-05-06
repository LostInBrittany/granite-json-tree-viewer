[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/LostInBrittany/granite-json-tree-viewer)

# granite-json-tree-viewer

> Based on Polymer 2.x

A JSON tree viewer custom element based on https://github.com/summerstyle/jsonTreeViewer

## Usage example

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="../polymer/polymer.html">
    <link rel="import" href="granite-json-tree-viewer.html">
  </template>
</custom-element-demo>
```
-->
```html
<granite-json-tree-viewer 
    data='{"firstName":"Jonh","lastName":"Smith","phones":["123-45-67","987-65-43"]}'></granite-json-tree-viewer>
```

### Styling

`<granite-json-tree-viewer` provides the following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--jsontree-bg` | Mixin applied to the background of the tree | `{}`
`--jsontree-tree` | Mixin applied to the tree | `{}`
`--jsontree-child` | Mixin applied to the child elements | `{}`
`--jsontree-label` | Mixin applied to the JSON labels | `{}`
`--jsontree-value` | Mixin applied to the JSON values | `{}`
`--jsontree-value-string` | Mixin applied to the JSON string values | `{}`
`--jsontree-value-number` | Mixin applied to the JSON number values | `{}`
`--jsontree-value-boolean` | Mixin applied to the JSON boolean values | `{}`
`--jsontree-value-null` | Mixin applied to the JSON null values | `{}`
`--jsontree-expand-button` | Mixin applied to the expand button | `{}`

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
