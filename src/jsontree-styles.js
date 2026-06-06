/**
 * Styles for the JSON Tree library, adapted from jsonTree.css
 * http://github.com/summerstyle/jsonTreeViewer
 *
 * Copyright 2017 Vera Lobacheva (http://iamvera.com)
 * Released under the MIT license (LICENSE.txt)
 *
 * Vendored and modernized for granite-json-tree-viewer:
 * - icons.svg is inlined as a data URI
 * - colors and fonts are exposed as CSS custom properties
 */

import { css } from 'lit';

export const jsonTreeStyles = css`
  /* Styles for the container of the tree (e.g. fonts, margins etc.) */
  .jsontree_tree {
    margin-left: 30px;
    font-family: var(--jsontree-font-family, 'PT Mono', monospace);
    font-size: var(--jsontree-font-size, 14px);
  }

  /* Styles for a list of child nodes */
  .jsontree_child-nodes {
    display: none;
    margin-left: 35px;
    margin-bottom: 5px;
    line-height: 2;
  }
  .jsontree_node_expanded
    > .jsontree_value-wrapper
    > .jsontree_value
    > .jsontree_child-nodes {
    display: block;
  }

  /* Styles for labels */
  .jsontree_label-wrapper {
    float: left;
    margin-right: 8px;
  }
  .jsontree_label {
    font-weight: normal;
    vertical-align: top;
    color: var(--jsontree-label-color, #000);
    position: relative;
    padding: 1px;
    border-radius: 4px;
    cursor: default;
  }
  .jsontree_node_marked > .jsontree_label-wrapper > .jsontree_label {
    background: var(--jsontree-marked-background, #fff2aa);
  }

  /* Styles for values */
  .jsontree_value-wrapper {
    display: block;
    overflow: hidden;
  }
  .jsontree_node_complex > .jsontree_value-wrapper {
    overflow: inherit;
  }
  .jsontree_value {
    vertical-align: top;
    display: inline;
  }
  .jsontree_value_null {
    color: var(--jsontree-null-color, #777);
    font-weight: bold;
  }
  .jsontree_value_string {
    color: var(--jsontree-string-color, #025900);
    font-weight: bold;
  }
  .jsontree_value_number {
    color: var(--jsontree-number-color, #000e59);
    font-weight: bold;
  }
  .jsontree_value_boolean {
    color: var(--jsontree-boolean-color, #600100);
    font-weight: bold;
  }

  /* Styles for active elements */
  .jsontree_expand-button {
    position: absolute;
    top: 3px;
    left: -15px;
    display: block;
    width: 11px;
    height: 11px;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTEiIGhlaWdodD0iMjIiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSI+PHN0b3Agb2Zmc2V0PSIwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCB4bGluazpocmVmPSIjYSIgY3g9IjkuNzM5IiBjeT0iOS43MTYiIGZ4PSI5LjczOSIgZnk9IjkuNzE2IiByPSIzLjcwOSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiLz48L2RlZnM+PGcgc3Ryb2tlPSIjMDAwIiBmaWxsPSJub25lIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTI5LjUgLTMzMy44NjIpIHRyYW5zbGF0ZSgwIC4xODgpIj48cmVjdCB0cmFuc2Zvcm09Im1hdHJpeCguOTYyIDAgMCAuOTcxIDQuOTQzIDExLjU0OCkiIHJ5PSIyIiByeD0iMiIgeT0iMzMyLjM2MiIgeD0iMTMwIiBoZWlnaHQ9IjEwLjMzNyIgd2lkdGg9IjEwLjQzMiIgb3BhY2l0eT0iLjUiLz48Zz48cGF0aCBkPSJNMTMyIDMzOS4xNzVoNiIgb3BhY2l0eT0iLjUiLz48cGF0aCBkPSJNMTM1IDMzNi4xNzV2NiIgb3BhY2l0eT0iLjUiLz48L2c+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMjkuNSAtMzMzLjg2MikiPjxyZWN0IHdpZHRoPSIxMC40MzIiIGhlaWdodD0iMTAuMzM3IiB4PSIxMzAiIHk9IjMzMi4zNjIiIHJ4PSIyIiByeT0iMiIgdHJhbnNmb3JtPSJtYXRyaXgoLjk2MiAwIDAgLjk3MSA0Ljk0MyAyMi43MzYpIiBvcGFjaXR5PSIuNSIvPjxwYXRoIGQ9Ik0xMzIgMzUwLjM2Mmg2IiBvcGFjaXR5PSIuNSIvPjwvZz48L2c+PC9zdmc+');
  }
  .jsontree_node_expanded
    > .jsontree_label-wrapper
    > .jsontree_label
    > .jsontree_expand-button {
    background-position: 0 -11px;
  }
  .jsontree_show-more {
    cursor: pointer;
  }
  .jsontree_node_expanded
    > .jsontree_value-wrapper
    > .jsontree_value
    > .jsontree_show-more {
    display: none;
  }
  .jsontree_node_empty > .jsontree_label-wrapper > .jsontree_label > .jsontree_expand-button,
  .jsontree_node_empty > .jsontree_value-wrapper > .jsontree_value > .jsontree_show-more {
    display: none !important;
  }
  .jsontree_node_complex > .jsontree_label-wrapper > .jsontree_label {
    cursor: pointer;
  }
  .jsontree_node_empty > .jsontree_label-wrapper > .jsontree_label {
    cursor: default !important;
  }
`;

export default jsonTreeStyles;
