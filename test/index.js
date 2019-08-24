const assert = require("assert");
const diff = require("../lib/index");

const Types = diff.Types;

const options = {
    isSameVNode(oldNode, newNode) {
        return oldNode.tag === newNode.tag && oldNode.key === newNode.key;
    }
};

{
    //case 1
    const patches = diff(
        [],
        [{ tag: "div", id: 1 }, { tag: "div", id: 2, key: "a" }],
        options
    );

    assert.deepEqual(patches.map(node => node.type), [
        Types.INSERT,
        Types.INSERT
    ]);
}

{
    //case 2
    const patches = diff(
        [{ tag: "div", id: 1 }, { tag: "div", id: 2, key: "a" }],
        [],
        options
    );

    assert.deepEqual(patches.map(node => node.type), [
        Types.REMOVE,
        Types.REMOVE
    ]);
}

{
    //case 3
    const patches = diff(
        [{ tag: "div", id: 1 }, { tag: "div", id: 2, key: "a" }],
        [{ tag: "div", id: 1 }, { tag: "div", id: 2, key: "a" }],
        options
    );

    assert.deepEqual(patches.map(node => node.type), [
        Types.UPDATE,
        Types.UPDATE
    ]);
}

{
    //case 4
    const patches = diff(
        [{ tag: "div", id: 1 }, { tag: "div", id: 2, key: "a" }],
        [{ tag: "div", id: 1 }],
        options
    );

    assert.deepEqual(patches.map(node => node.type), [
        Types.UPDATE,
        Types.REMOVE
    ]);
}

{
    //case 5
    const patches = diff(
        [{ tag: "div", id: 1 }, { tag: "div", id: 2, key: "a" }],
        [{ tag: "div", id: 2, key: "a" }],
        options
    );

    assert.deepEqual(patches.map(node => node.type), [
        Types.UPDATE,
        Types.REMOVE
    ]);
}

{
    //case 6
    const patches = diff(
        [{ tag: "div", id: 1 }, { tag: "div", id: 2, key: "a" }],
        [{ tag: "div", id: 1 }, { tag: "p", id: 3 }],
        options
    );

    assert.deepEqual(patches.map(node => node.type), [
        Types.UPDATE,
        Types.INSERT,
        Types.REMOVE
    ]);
}

{
    //case 7
    const patches = diff(
        [
            { tag: "div", id: 1 },
            { tag: "div", id: 2, key: "a" },
            { tag: "p", id: 3 },
            { tag: "span", id: 4 },
            { tag: "a", id: 5 },
            { tag: "h1", id: 6 }
        ],
        [
            { tag: "div", id: 1 },
            { tag: "p", id: "a" },
            { tag: "p", id: "b" },
            { tag: "p", id: "c" }
        ],
        options
    );

    assert.deepEqual(patches.map(node => node.type), [
        "UPDATE",
        "INSERT",
        "INSERT",
        "INSERT",
        "REMOVE",
        "REMOVE",
        "REMOVE",
        "REMOVE",
        "REMOVE"
    ]);
}

{
    //case 7
    const patches = diff(
        [
            { tag: "div", id: 1 },
            { tag: "p", id: "a" },
            { tag: "p", id: "b" },
            { tag: "p", id: "c" }
        ],
        [
            { tag: "div", id: 1 },
            { tag: "div", id: 2, key: "a" },
            { tag: "p", id: 3 },
            { tag: "span", id: 4 },
            { tag: "a", id: 5 },
            { tag: "h1", id: 6 }
        ],

        options
    );

    assert.deepEqual(patches.map(node => node.type), [
        "UPDATE",
        "INSERT",
        "UPDATE",
        "INSERT",
        "INSERT",
        "INSERT",
        "REMOVE",
        "REMOVE"
    ]);
}

{
    const oldList = [
        { tag: "div", id: "a", dom: "native" },
        { tag: "div", id: "b", dom: "native", key: "c" },
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
        { tag: "span", id: 2, key: "c" },
        { tag: "p", id: 3, key: "b" },
        { tag: "div", id: 4 },
        { tag: "div", id: 5, key: "a" },
        { tag: "div", id: 6 }
    ];
    const patches = diff(oldList, newList, {
        isSameVNode(oldNode, newNode) {
            return oldNode.tag === newNode.tag && oldNode.key === newNode.key;
        }
    });
    assert.deepEqual(patches.map(node => node.type), [
        "UPDATE",
        "UPDATE",
        "UPDATE",
        "UPDATE",
        "MOVE",
        "UPDATE",
        "MOVE",
        "UPDATE",
        "MOVE",
        "REMOVE",
        "REMOVE",
        "REMOVE"
    ]);
}
