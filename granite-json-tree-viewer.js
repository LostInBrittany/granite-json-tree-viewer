/**
 * `granite-json-tree-viewer`
 * A JSON tree viewer custom element based on https://github.com/summerstyle/jsonTreeViewer
 * Copyright 2018-2026 Horacio Gonzalez (@LostInBrittany)
 * Released under the MIT license (LICENSE)
 *
 * Using a vendored, modernized version of JSON Tree Viewer
 * http://github.com/summerstyle/jsonTreeViewer
 * Copyright 2017 Vera Lobacheva (http://iamvera.com)
 * Released under the MIT license (LICENSE.txt)
 */

import { LitElement, html, css } from 'lit';
import { JsonTree } from './src/jsontree.js';
import { jsonTreeStyles } from './src/jsontree-styles.js';

/**
 * A JSON tree viewer element.
 *
 * ```html
 * <granite-json-tree-viewer
 *     data='{"firstName":"John","lastName":"Smith"}'></granite-json-tree-viewer>
 * ```
 *
 * Interactions (inherited from jsonTreeViewer):
 * - click on an object/array label or on `…` to expand/collapse it
 *   (with Ctrl/Cmd: recursively)
 * - Alt+click on a label to mark/unmark a node
 * - Shift+click on a label fires a `jsontree-jsonpath` event with the
 *   JSON-path of the node (`detail: { path, dotPath, node }`)
 *
 * @customElement granite-json-tree-viewer
 * @fires jsontree-jsonpath - on Shift+click on a node label
 */
export class GraniteJsonTreeViewer extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }
      ul,
      ol {
        list-style: none;
        padding: 0;
        margin: 0;
      }
    `,
    jsonTreeStyles,
  ];

  static properties = {
    /**
     * The JSON data to display, as an object/array property or a JSON
     * string attribute. The root must be an object or an array.
     */
    data: { type: Object },
    /**
     * If true, object keys are sorted alphabetically (the behavior of the
     * original jsonTreeViewer). By default insertion order is preserved.
     */
    sortKeys: { type: Boolean, attribute: 'sort-keys' },
  };

  constructor() {
    super();
    this.data = null;
    this.sortKeys = false;
    this._tree = null;
  }

  /**
   * The underlying `JsonTree` instance (or null if no data is loaded),
   * for advanced use: `findAndHandle()`, `unmarkAll()`, node marking, etc.
   */
  get tree() {
    return this._tree;
  }

  render() {
    return html`<div id="tree"></div>`;
  }

  updated(changedProperties) {
    if (changedProperties.has('data') || changedProperties.has('sortKeys')) {
      this._renderTree();
    }
  }

  _renderTree() {
    const container = this.renderRoot.querySelector('#tree');
    container.replaceChildren();
    this._tree = null;

    if (this.data == null) {
      return;
    }

    this._tree = new JsonTree(this.data, container, { sortKeys: this.sortKeys });
  }

  /**
   * Expands tree nodes recursively, or, if `filterFunc` is given, only the
   * direct children for which it returns true.
   *
   * @param {Function} [filterFunc]
   */
  expand(filterFunc) {
    this._tree?.expand(filterFunc);
  }

  /**
   * Collapses all tree nodes recursively.
   */
  collapse() {
    this._tree?.collapse();
  }

  /**
   * Returns the source JSON as a string.
   *
   * @param {boolean} [isPrettyPrinted] - true for a pretty-printed string
   * @returns {string|undefined}
   */
  toSourceJSON(isPrettyPrinted) {
    return this._tree?.toSourceJSON(isPrettyPrinted);
  }

  /**
   * Unmarks all marked nodes.
   */
  unmarkAll() {
    this._tree?.unmarkAll();
  }
}

window.customElements.define('granite-json-tree-viewer', GraniteJsonTreeViewer);
