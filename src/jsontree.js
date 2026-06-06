/**
 * JSON Tree library (a part of jsonTreeViewer)
 * http://github.com/summerstyle/jsonTreeViewer
 *
 * Copyright 2017 Vera Lobacheva (http://iamvera.com)
 * Released under the MIT license (LICENSE.txt)
 *
 * Vendored and modernized for granite-json-tree-viewer
 * Copyright 2026 Horacio Gonzalez (@LostInBrittany)
 * Released under the MIT license (LICENSE)
 *
 * Changes from the original:
 * - converted from an IIFE to an ES module, prototype tricks to ES classes
 * - the DOM is built with `createElement`/`textContent` instead of string
 *   templates and `innerHTML`, fixing the XSS vulnerability reported in
 *   summerstyle/jsonTreeViewer#21 for both simple AND complex nodes
 *   (the upstream PR only fixed simple nodes)
 * - `alert()` calls replaced: shift-click on a label now dispatches a
 *   composed `jsontree-jsonpath` custom event, and `loadData()` throws a
 *   `TypeError` on an invalid root instead of alerting
 * - object key order is preserved by default; pass `{ sortKeys: true }`
 *   to restore the original alphabetical sorting
 * - `toSourceJSON(true)` returns a real pretty-printed JSON string instead
 *   of an HTML string with `<br/>` and `&nbsp;`
 * - elements expose `part` attributes so trees rendered inside a shadow
 *   root can be styled from outside with `::part()`
 */

/* ---------- Utilities ---------- */

/**
 * Returns the JSON type of a value.
 *
 * @param {*} val - the value for a new node
 * @returns {string} ("object" | "array" | "null" | "boolean" | "number" | "string")
 */
function getType(val) {
  if (val === null) {
    return 'null';
  }

  switch (typeof val) {
    case 'number':
      return 'number';
    case 'string':
      return 'string';
    case 'boolean':
      return 'boolean';
    default:
  }

  if (Array.isArray(val)) {
    return 'array';
  }
  if (typeof val === 'object') {
    return 'object';
  }

  throw new TypeError(`jsonTree: bad type: ${Object.prototype.toString.call(val)}`);
}

/**
 * Applies a function to each child of an object or array,
 * flagging the last one.
 *
 * @param {Object|Array} obj - a list or a dict with child nodes
 * @param {Function} func - called with (label, value, isLast)
 * @param {boolean} sortKeys - if true, object keys are sorted alphabetically
 */
function forEachNode(obj, func, sortKeys) {
  const type = getType(obj);

  if (type === 'array') {
    const last = obj.length - 1;
    obj.forEach((item, i) => func(i, item, i === last));
  } else if (type === 'object') {
    const keys = Object.keys(obj);
    if (sortKeys) {
      keys.sort();
    }
    const last = keys.length - 1;
    keys.forEach((key, i) => func(key, obj[key], i === last));
  }
}

/**
 * Checks for a valid root node type.
 *
 * @param {*} jsonObj - a value for the root node
 * @returns {boolean} - true for an object or an array, false otherwise
 */
function isValidRoot(jsonObj) {
  switch (getType(jsonObj)) {
    case 'object':
    case 'array':
      return true;
    default:
      return false;
  }
}

/**
 * Helper: creates an element with a class list and an optional part attribute.
 */
function el(tag, classes, part) {
  const node = document.createElement(tag);
  node.className = classes;
  if (part) {
    node.setAttribute('part', part);
  }
  return node;
}

/* ---------- Nodes ---------- */

/**
 * A node is a structural element of an object or an array,
 * with its own label (a key of an object or an index of an array)
 * and a value of any JSON data type. The root object or array
 * is a node without a label.
 *
 * Base class with the behavior shared by simple and complex nodes.
 */
class JsonNode {
  constructor(label, settings) {
    this.label = label;
    this.settings = settings;
    this.parent = null;
    this.isRoot = false;
  }

  get isComplex() {
    return false;
  }

  /**
   * Mark node
   */
  mark() {
    this.el.classList.add('jsontree_node_marked');
  }

  /**
   * Unmark node
   */
  unmark() {
    this.el.classList.remove('jsontree_node_marked');
  }

  /**
   * Mark or unmark node
   */
  toggleMarked() {
    this.el.classList.toggle('jsontree_node_marked');
  }

  /**
   * Expands the parent node of this node
   *
   * @param {boolean} isRecursive - if true, expands all parent nodes
   *                                (from node to root)
   */
  expandParent(isRecursive) {
    if (!this.parent) {
      return;
    }

    this.parent.expand();
    this.parent.expandParent(isRecursive);
  }

  /**
   * Returns the JSON-path of this node
   *
   * @param {boolean} isInDotNotation - kind of notation for the returned
   *                                    json-path (bracket notation by default)
   * @returns {string}
   */
  getJSONPath(isInDotNotation) {
    if (this.isRoot) {
      return '$';
    }

    let currentPath;

    if (this.parent.type === 'array') {
      currentPath = `[${this.label}]`;
    } else {
      currentPath = isInDotNotation
        ? `.${this.label}`
        : `[${JSON.stringify(String(this.label))}]`;
    }

    return this.parent.getJSONPath(isInDotNotation) + currentPath;
  }

  /**
   * Dispatches a `jsontree-jsonpath` event with the JSON-path of this node.
   * Replaces the original library's `alert(this.getJSONPath())`.
   */
  _dispatchJSONPath() {
    this.el.dispatchEvent(
      new CustomEvent('jsontree-jsonpath', {
        detail: {
          path: this.getJSONPath(),
          dotPath: this.getJSONPath(true),
          node: this,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

/*
 * A node of a simple type (string, number, boolean, null)
 *
 * Markup:
 * <li class="jsontree_node">
 *     <span class="jsontree_label-wrapper">
 *         <span class="jsontree_label">"age"</span> :
 *     </span>
 *     <span class="jsontree_value-wrapper">
 *         <span class="jsontree_value jsontree_value_(number|boolean|string|null)">25</span>
 *         ,
 *     </span>
 * </li>
 */
class SimpleNode extends JsonNode {
  /**
   * @param {string|number} label - key name or array index
   * @param {string|number|boolean|null} val - a value of a simple type
   * @param {boolean} isLast - true if the node is last in its list of siblings
   * @param {Object} settings - tree settings
   */
  constructor(label, val, isLast, settings) {
    super(label, settings);

    const li = el('li', 'jsontree_node', 'node');

    const labelWrapper = el('span', 'jsontree_label-wrapper');
    const labelEl = el('span', 'jsontree_label', 'label');
    labelEl.textContent = `"${label}"`;
    labelWrapper.append(labelEl, ' : ');

    const valueWrapper = el('span', 'jsontree_value-wrapper');
    const valueEl = el(
      'span',
      `jsontree_value jsontree_value_${this.type}`,
      `value value-${this.type}`,
    );
    valueEl.textContent = this._displayValue(val);
    valueWrapper.append(valueEl);
    if (!isLast) {
      valueWrapper.append(',');
    }

    li.append(labelWrapper, valueWrapper);

    labelEl.addEventListener('click', (e) => {
      if (e.altKey) {
        this.toggleMarked();
        return;
      }

      if (e.shiftKey) {
        document.getSelection().removeAllRanges();
        this._dispatchJSONPath();
      }
    });

    this.el = li;
  }

  /**
   * String representation of the value, overridden per type.
   */
  _displayValue(val) {
    return String(val);
  }
}

class BooleanNode extends SimpleNode {
  get type() {
    return 'boolean';
  }
}

class NumberNode extends SimpleNode {
  get type() {
    return 'number';
  }
}

class StringNode extends SimpleNode {
  get type() {
    return 'string';
  }

  _displayValue(val) {
    return `"${val}"`;
  }
}

class NullNode extends SimpleNode {
  get type() {
    return 'null';
  }
}

/*
 * A node of a complex type (object, array)
 *
 * Markup:
 * <li class="jsontree_node jsontree_node_complex [jsontree_node_expanded]">
 *     <span class="jsontree_label-wrapper">
 *         <span class="jsontree_label">
 *             <span class="jsontree_expand-button"></span>
 *             "label"
 *         </span> :
 *     </span>
 *     <div class="jsontree_value-wrapper">
 *         <div class="jsontree_value">
 *             <b>{</b>
 *             <span class="jsontree_show-more">&hellip;</span>
 *             <ul class="jsontree_child-nodes"></ul>
 *             <b>}</b>
 *         </div>
 *         ,
 *     </div>
 * </li>
 */
class ComplexNode extends JsonNode {
  /**
   * @param {string|number|null} label - key name, array index, or null for the root
   * @param {Object|Array} val - a value of a complex type
   * @param {boolean} isLast - true if the node is last in its list of siblings
   * @param {Object} settings - tree settings
   */
  constructor(label, val, isLast, settings) {
    super(label, settings);

    const li = el('li', 'jsontree_node jsontree_node_complex', 'node');

    const valueWrapper = el('div', 'jsontree_value-wrapper');
    const valueEl = el(
      'div',
      `jsontree_value jsontree_value_${this.type}`,
      `value value-${this.type}`,
    );

    const openSym = document.createElement('b');
    openSym.textContent = this.sym[0];
    const closeSym = document.createElement('b');
    closeSym.textContent = this.sym[1];

    const moreContentEl = el('span', 'jsontree_show-more', 'show-more');
    moreContentEl.textContent = '…';

    const childNodesUl = el('ul', 'jsontree_child-nodes', 'child-nodes');

    valueEl.append(openSym, moreContentEl, childNodesUl, closeSym);
    valueWrapper.append(valueEl);
    if (!isLast) {
      valueWrapper.append(',');
    }

    if (label !== null) {
      const labelWrapper = el('span', 'jsontree_label-wrapper');
      const labelEl = el('span', 'jsontree_label', 'label');
      const expandButton = el('span', 'jsontree_expand-button', 'expand-button');
      labelEl.append(expandButton, `"${label}"`);
      labelWrapper.append(labelEl, ' : ');
      li.append(labelWrapper);

      labelEl.addEventListener('click', (e) => {
        if (e.altKey) {
          this.toggleMarked();
          return;
        }

        if (e.shiftKey) {
          document.getSelection().removeAllRanges();
          this._dispatchJSONPath();
          return;
        }

        this.toggle(e.ctrlKey || e.metaKey);
      });

      moreContentEl.addEventListener('click', (e) => {
        this.toggle(e.ctrlKey || e.metaKey);
      });
    } else {
      this.isRoot = true;
      li.classList.add('jsontree_node_expanded');
    }

    li.append(valueWrapper);

    this.el = li;
    this.childNodes = [];
    this.childNodesUl = childNodesUl;

    forEachNode(
      val,
      (childLabel, childVal, childIsLast) => {
        this.addChild(createNode(childLabel, childVal, childIsLast, settings));
      },
      settings.sortKeys,
    );

    this.isEmpty = this.childNodes.length === 0;
    if (this.isEmpty) {
      li.classList.add('jsontree_node_empty');
    }
  }

  get isComplex() {
    return true;
  }

  /*
   * Adds a child node to the list of child nodes
   *
   * @param {JsonNode} child - child node
   */
  addChild(child) {
    this.childNodes.push(child);
    this.childNodesUl.appendChild(child.el);
    child.parent = this;
  }

  /*
   * Expands this node
   *
   * @param {boolean} isRecursive - if true, expands all child nodes
   */
  expand(isRecursive) {
    if (this.isEmpty) {
      return;
    }

    if (!this.isRoot) {
      this.el.classList.add('jsontree_node_expanded');
    }

    if (isRecursive) {
      this.childNodes.forEach((item) => {
        if (item.isComplex) {
          item.expand(isRecursive);
        }
      });
    }
  }

  /*
   * Collapses this node
   *
   * @param {boolean} isRecursive - if true, collapses all child nodes
   */
  collapse(isRecursive) {
    if (this.isEmpty) {
      return;
    }

    if (!this.isRoot) {
      this.el.classList.remove('jsontree_node_expanded');
    }

    if (isRecursive) {
      this.childNodes.forEach((item) => {
        if (item.isComplex) {
          item.collapse(isRecursive);
        }
      });
    }
  }

  /*
   * Expands a collapsed node or collapses an expanded one
   *
   * @param {boolean} isRecursive - expand all child nodes if this node
   *                                is expanded, collapse them otherwise
   */
  toggle(isRecursive) {
    if (this.isEmpty) {
      return;
    }

    this.el.classList.toggle('jsontree_node_expanded');

    if (isRecursive) {
      const isExpanded = this.el.classList.contains('jsontree_node_expanded');

      this.childNodes.forEach((item) => {
        if (item.isComplex) {
          item[isExpanded ? 'expand' : 'collapse'](isRecursive);
        }
      });
    }
  }

  /**
   * Finds child nodes that match some conditions and handles them
   *
   * @param {Function} matcher
   * @param {Function} handler
   * @param {boolean} isRecursive
   */
  findChildren(matcher, handler, isRecursive) {
    if (this.isEmpty) {
      return;
    }

    this.childNodes.forEach((item) => {
      if (matcher(item)) {
        handler(item);
      }

      if (item.isComplex && isRecursive) {
        item.findChildren(matcher, handler, isRecursive);
      }
    });
  }
}

class ObjectNode extends ComplexNode {
  get type() {
    return 'object';
  }

  get sym() {
    return ['{', '}'];
  }
}

class ArrayNode extends ComplexNode {
  get type() {
    return 'array';
  }

  get sym() {
    return ['[', ']'];
  }
}

const NODE_CONSTRUCTORS = {
  boolean: BooleanNode,
  number: NumberNode,
  string: StringNode,
  null: NullNode,
  object: ObjectNode,
  array: ArrayNode,
};

/**
 * The factory for creating nodes of a defined type.
 *
 * @param {string|number|null} label - key name, array index, or null for the root
 * @param {*} val - a value of any valid JSON type
 * @param {boolean} isLast - true if the node is last in its list of siblings
 * @param {Object} settings - tree settings
 * @returns {JsonNode}
 */
function createNode(label, val, isLast, settings) {
  const Constructor = NODE_CONSTRUCTORS[getType(val)];
  return new Constructor(label, val, isLast, settings);
}

/* ---------- The tree ---------- */

/*
 * A json tree. It contains only one node (array or object) without
 * a property name. CSS-styles of .jsontree_tree define the main tree
 * styles like font-family, font-size and own margins.
 *
 * Markup:
 * <ul class="jsontree_tree clearfix">
 *     {Node}
 * </ul>
 */
export class JsonTree {
  /**
   * @param {Object|Array} jsonObj - data for the tree
   * @param {Element} domEl - DOM element, wrapper for the tree
   * @param {Object} [options]
   * @param {boolean} [options.sortKeys=false] - sort object keys
   *        alphabetically (the original library's behavior) instead of
   *        preserving insertion order
   */
  constructor(jsonObj, domEl, options = {}) {
    this.settings = {
      sortKeys: Boolean(options.sortKeys),
    };

    this.wrapper = el('ul', 'jsontree_tree clearfix', 'tree');

    this.rootNode = null;
    this.sourceJSONObj = jsonObj;

    this.loadData(jsonObj);
    this.appendTo(domEl);
  }

  /**
   * Fills new data into the current json tree
   *
   * @param {Object|Array} jsonObj - json-data
   * @throws {TypeError} if the root is not an object or an array
   */
  loadData(jsonObj) {
    if (!isValidRoot(jsonObj)) {
      throw new TypeError('jsonTree: the root should be an object or an array');
    }

    this.sourceJSONObj = jsonObj;

    this.rootNode = createNode(null, jsonObj, true, this.settings);
    this.wrapper.replaceChildren(this.rootNode.el);
  }

  /**
   * Appends the tree to a DOM element (or moves it to a new place)
   *
   * @param {Element} domEl
   */
  appendTo(domEl) {
    domEl.appendChild(this.wrapper);
  }

  /**
   * Expands tree nodes (objects or arrays) recursively
   *
   * @param {Function} [filterFunc] - if given, only direct children for
   *        which it returns true are expanded (non-recursively)
   */
  expand(filterFunc) {
    if (!this.rootNode.isComplex) {
      return;
    }

    if (typeof filterFunc === 'function') {
      this.rootNode.childNodes.forEach((item) => {
        if (item.isComplex && filterFunc(item)) {
          item.expand();
        }
      });
    } else {
      this.rootNode.expand(true);
    }
  }

  /**
   * Collapses all tree nodes (objects or arrays) recursively
   */
  collapse() {
    if (typeof this.rootNode.collapse === 'function') {
      this.rootNode.collapse(true);
    }
  }

  /**
   * Returns the source json-string
   *
   * @param {boolean} [isPrettyPrinted] - true for a pretty-printed string
   * @returns {string} - for example, '{"a":2,"b":3}'
   */
  toSourceJSON(isPrettyPrinted) {
    return JSON.stringify(this.sourceJSONObj, null, isPrettyPrinted ? 4 : undefined);
  }

  /**
   * Finds all nodes that match some conditions and handles them
   *
   * @param {Function} matcher
   * @param {Function} handler
   */
  findAndHandle(matcher, handler) {
    this.rootNode.findChildren(matcher, handler, true);
  }

  /**
   * Unmarks all nodes
   */
  unmarkAll() {
    this.rootNode.findChildren(
      () => true,
      (node) => node.unmark(),
      true,
    );
  }
}

/**
 * API-compatible entry point with the original library:
 * `jsonTree.create(jsonObj, domEl)`
 */
export const jsonTree = {
  /**
   * Creates a new tree from data and appends it to a DOM element
   *
   * @param {Object|Array} jsonObj - json-data
   * @param {Element} domEl - the wrapper element
   * @param {Object} [options] - see {@link JsonTree}
   * @returns {JsonTree}
   */
  create(jsonObj, domEl, options) {
    return new JsonTree(jsonObj, domEl, options);
  },
};

export default jsonTree;
