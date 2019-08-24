const diff = require("../lib/index");

const oldList = [
    { tag: "div", id: "a", dom: "native" },
    { tag: "div", id: "b", dom: "native" },
    { tag: "div", id: "c", dom: "native" },
    { tag: "div", id: "d", dom: "native" },
    { tag: "div", id: "e", key: "a", dom: "native" },
    { tag: "div", id: "f", key: "b", dom: "native" },
    { tag: "div", id: "g", dom: "native" },
    { tag: "div", id: "h", dom: "native" },
    { tag: "div", id: "i", dom: "native" }
];

const newList = [
    { tag: "div", id: 1 },
    { tag: "span", id: 2 },
    { tag: "p", id: 3, key: "b" },
    { tag: "div", id: 4 },
    { tag: "div", id: 5, key: "a" },
    { tag: "div", id: 6 }
];

{
    const patches = diff(oldList, newList, {
        isSameVNode(oldNode, newNode) {
            return oldNode.tag === newNode.tag && oldNode.key === newNode.key;
        }
    });
    console.dir(patches);
}
