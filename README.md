# virtual-dom-diff

simple virtual DOM diff

## install & usage

`npm install --save virtual-dom-diff`

```
//const diff = require('virtual-dom-diff');
import diff from 'virtual-dom-diff';

const patches = diff(oldNodes, newNodes);

```

## Options

```
/**
 *
 * @type {Object} VElement 实例后的VirtualDOM节点，通常实例后会生成真实的dom
 *
 * @type {Object} VNode 未实例后的VirtualDOM节点
 *
 * @type {Object} Patch
 * @type {Enums<UPDATE|INSERT|MOVE|REMOVE>} Patch.type
 * @type {VElement} Patch.current
 * @type {VNode} Patch.next
 * @type {VElement} Patch.before
 *
 * @param {Array<VElement>} oldCh 旧VirtualDOM列表
 * @param {Array<VNode>} newCh 新VirtualDOM列表
 * @param {Object} options
 * @param {String} options.key
 * @param {Function<VElement, VNode>: Boolean} options.isSameVNode
 * @returns {Array<Patch>}
 */
function virtualDOMDiff(oldCh, newCh, options) {}
```

### options.key

默认： `key`

### options.isSameVNode

默认：

```
function(oldItem, newItem) {
    return oldItem === newItem && oldItem[KEY_P] === newItem[KEY_P];
}
```

建议设置为：

```
options.isSameVNode = function(oldNode, newNode){
    return oldNode.tag === newNode.tag && oldNode.key === newNode.key
}
```

## Examples

```
import diff from 'virtual-dom-diff';

const Types = diff.Types;

const options = {};

options.isSameVNode = function(oldNode, newNode){
    return oldNode.tag === newNode.tag && oldNode.key === newNode.key
}

let list = [
        <p>a1</p>,
        <p key="x">a2</p>,
        <p>a3</p>,
        <p>a4</p>,
        <p>a5</p>
];

const nodes = mount(list);

const newList = [
    <p>a1</p>,
    <p>a2</p>,
    <a>a3</a>,
    <div key="x">a4</div>,
    <p>a5</p>
];

const patches = diff(list, newList, options);


list = [];

patches.forEach( patch => {
    let {current, next, before, type} = patch;

    if(type === Types.UPDATE) {
        //注：UPDATE可能是key相同， 但tag不一定相同
        if(isSameNode(current, next)) {
            //patch node eg. props
            current = patch(current, next);
        } else {
            current = replace(current, next);
        }

        list.push(current);
    } else if(type === Types.MOVE) {
        insertBefore(parent, current.dom, before.dom);
    } else if(type === Types.INSERT) {
        current = mount(next);
        insertBefore(parent, current.dom, before.dom);

        list.push(current);
    } else if(type === Types.REMOVE) {
        parent.removeChild(current.dom);
    }
} );

// loop...


```
