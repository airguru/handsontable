export default class NodesPool {
  constructor(nodeType) {
    this.nodeType = nodeType;
    this.pool = new Map();
  }

  obtain(...args) {
    // @TODO (perf-tip) This can be optimalized to make smaller pool of available nodes. Currently,
    // elements are created for all rows/cells. The pool with implemented LRU or similar strategy? or spatial hash map?
    if (args[0] === void 0) {
      throw new Error('Wrong node id');
    }

    const key = args.length > 1 ? args.join('x') : args[0];
    let node;

    if (this.pool.has(key)) {
      node = this.pool.get(key);
    } else {
      node = document.createElement(this.nodeType);
      // node.dataset.id = key; // Uncomment for debug purposes
      this.pool.set(key, node);
    }

    return node;
  }
}