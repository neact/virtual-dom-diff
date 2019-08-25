"use strict";

function isUndef(s) {
    return s === undefined;
}
function isDef(s) {
    return s !== undefined;
}

function createKeyToOldIdx(children, beginIdx, endIdx, KEY_P) {
    var i,
        map = {},
        key,
        ch;
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
            key = ch[KEY_P];
            if (key !== undefined) map[key] = i;
        }
    }
    return map;
}

var Types = {
    UPDATE: "UPDATE",
    REPLACE: "REPLACE",
    INSERT: "INSERT",
    MOVE: "MOVE",
    REMOVE: "REMOVE"
};

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
function virtualDOMDiff(oldCh, newCh, options) {
    options = options || {};
    var KEY_P = options.key || "key";

    var patches = [];
    var oldStartIdx = 0,
        newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVNode = oldCh[0];
    var oldEndVNode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVNode = newCh[0];
    var newEndVNode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld;

    var isSameVNode =
        options.isSameVNode ||
        function(oldItem, newItem) {
            return oldItem === newItem && oldItem[KEY_P] === newItem[KEY_P];
        };

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVNode)) {
            oldStartVNode = oldCh[++oldStartIdx];
        } else if (isUndef(oldEndVNode)) {
            oldEndVNode = oldCh[--oldEndIdx];
        } else if (isSameVNode(oldStartVNode, newStartVNode)) {
            patches.push({
                next: newStartVNode,
                current: oldStartVNode,
                type: Types.UPDATE
            });

            oldStartVNode = oldCh[++oldStartIdx];
            newStartVNode = newCh[++newStartIdx];
        } else if (isSameVNode(oldEndVNode, newEndVNode)) {
            patches.push({
                next: newEndVNode,
                current: oldEndVNode,
                type: Types.UPDATE
            });

            oldEndVNode = oldCh[--oldEndIdx];
            newEndVNode = newCh[--newEndIdx];
        } else if (isSameVNode(oldStartVNode, newEndVNode)) {
            patches.push({
                next: newEndVNode,
                current: oldStartVNode,
                type: Types.UPDATE
            });
            patches.push({
                before: oldCh[oldEndIdx + 1],
                current: oldStartVNode,
                type: Types.MOVE
            });

            oldStartVNode = oldCh[++oldStartIdx];
            newEndVNode = newCh[--newEndIdx];
        } else if (isSameVNode(oldEndVNode, newStartVNode)) {
            patches.push({
                next: newStartVNode,
                current: oldEndVNode,
                type: Types.UPDATE
            });
            patches.push({
                before: oldStartVNode,
                current: oldEndVNode,
                type: Types.MOVE
            });

            oldEndVNode = oldCh[--oldEndIdx];
            newStartVNode = newCh[++newStartIdx];
        } else {
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(
                    oldCh,
                    oldStartIdx,
                    oldEndIdx,
                    KEY_P
                );
            }

            idxInOld = oldKeyToIdx[newStartVNode[KEY_P]];

            if (isUndef(idxInOld) || isUndef(oldCh[idxInOld])) {
                patches.push({
                    before: oldStartVNode,
                    next: newStartVNode,
                    type: Types.INSERT
                });

                newStartVNode = newCh[++newStartIdx];
            } else {
                patches.push({
                    next: newStartVNode,
                    current: oldCh[idxInOld],
                    type: Types.UPDATE
                });

                if (oldStartVNode !== oldCh[idxInOld]) {
                    patches.push({
                        before: oldStartVNode,
                        current: oldCh[idxInOld],
                        type: Types.MOVE
                    });
                }

                oldCh[idxInOld] = undefined;
                newStartVNode = newCh[++newStartIdx];
            }
        }
    }

    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
        if (oldStartIdx > oldEndIdx) {
            for (; newStartIdx <= newEndIdx; newStartIdx++) {
                patches.push({
                    before: newCh[newEndIdx + 1],
                    next: newCh[newStartIdx],
                    type: Types.INSERT
                });
            }
        } else {
            for (; oldStartIdx <= oldEndIdx; oldStartIdx++) {
                if (isDef(oldCh[oldStartIdx])) {
                    patches.push({
                        current: oldCh[oldStartIdx],
                        type: Types.REMOVE
                    });
                }
            }
        }
    }

    return patches;
}

virtualDOMDiff.Types = Types;

module.exports = virtualDOMDiff;
