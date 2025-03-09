class LRUCache {
  constructor(capacity) {
    this.capacity = Number(capacity);
    this.lenght = 0;
    this.map = new Map();
    this.head = null;
    this.tail = null;
  }

  #removeNode(node) {
    if (!node) return;

    if (node.prev) {
      node.prev.next = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    }

    if (node === this.head) {
      this.head = node.next;
    }

    if (node === this.tail) {
      this.tail = node.prev;
    }
  }

  get(key) {
    if (!this.map.has(key)) return null;
    const node = this.map.get(key);

    this.#removeNode(node);
    node.prev = null;
    node.next = this.head;

    if (this.head !== null) {
      this.head.prev = node;
    }

    this.head = node;

    return node.value;
  }

  put(key, value) {
    // Check if the cache is full
    if (this.lenght === this.capacity) {
      // 1. remove the tail node
      if (!this.map.has(key)) {
        this.#removeNode(this.tail);
        this.lenght -= 1;
      }
    }

    // if key already exists, update the value
    if (this.map.has(key)) {
      // 1. remove older node
      this.#removeNode(this.map.get(key));
    }

    const node = {
      next: this.head,
      prev: null,
      key,
      value,
    };

    this.map.set(key, node);
    if (this.head !== null) {
      this.head.prev = node;
    }
    this.head = node;

    if (this.tail === null) {
      this.tail = node;
    }
    this.lenght += 1;
  }

  debug() {
    let current = this.head;

    const arr = [];

    while (current !== null) {
      arr.push({ key: current.key, value: current.value });
      current = current.next;
    }

    arr.forEach((item) => {
      console.log(item.key, "--->", item.value);
    });

    return arr;
  }
}

const cache = new LRUCache(2);

cache.put(3, 30);
cache.put(1, 10);
console.log(cache.get(1));
cache.put(2, 20);
console.log(cache.get(2));

console.log(cache.debug());
