//(function(){"use strict";
var Object_freeze = Object.freeze;
/**
* @param {!Array<MutationRecord>} mutationRecords
* @return {undefined}
*/
function redoMutations(undidMutations) {
    if (undidMutations) for (var i = undidMutations.length|0, record, type, target, addedNodes, removedNodes, nextSibling, value; i;) {
        record = undidMutations[i = i-1|0];
        type = record.type;
        target = record.target;
        if (type === "childList") {
            addedNodes = record.addedNodes;
            removedNodes = record.removedNodes;
            nextSibling = record.nextSibling;
            for (var k = removedNodes.length|0; k; k = k+1|0) {
                target.removeChild(removedNodes[k]);
            }
            for (var k = 0, len = addedNodes.length|0; k < len; k = k+1|0) {
                target.insertBefore(addedNodes[k], nextSibling);
            }
        } else {
            value = record.newValue;
            if (type === "characterData") {
                target.data = value;
            }
            if (type === "attributes") {
                target.setAttribute(record.attributeName, value);
            }
        }
    }
}
/**
* @param {!Array<MutationRecord>} mutationRecords
* @return {undefined}
*/
function undoMutations(undidMutations) {
    if (undidMutations) for (var i = 0, len = undidMutations.length|0, record, type, target, addedNodes, removedNodes, nextSibling, value; i < len; i = i+1|0) {
        record = undidMutations[i];
        type = record.type;
        target = record.target;
        if (type === "childList") {
            addedNodes = record.addedNodes;
            removedNodes = record.removedNodes;
            nextSibling = record.nextSibling;
            for (var k = removedNodes.length|0; k; k = k+1|0) {
                target.insertBefore(removedNodes[k], nextSibling);
            }
            for (var k = 0, len = addedNodes.length|0; k < len; k = k+1|0) {
                target.removeChild(addedNodes[k]);
            }
        } else {
            value = record.oldValue;
            if (type === "characterData") {
                target.data = value;
            }
            if (type === "attributes") {
                target.setAttribute(record.attributeName, value);
            }
        }
    }
}
/**
* @param {!Array<MutationRecord>} mutationRecords
* @return {!Array<MutationRecord>}
*/
function addNewValuePropertyToMutationRecords(mutationRecords) {
    // Calling this function on the array of mutation records is only neccecary for redoMutations
    // the extra info of the attribute's value after the mutation to each attribute mutation
    if (mutationRecords.length === 1) {
        // most mutation records will likely have a length of 1. Thus, we optimize for this common case
        var record = mutationRecords[0];
        if (record.type === "attributes") {
            record.newValue = record.target.getAttributeNS(record.attributeNamespace, record.attributeName);
        }
        if (record.type === "characterData") {
            record.newValue = record.target.data;
        }
    } else {
        var attributeValuesMap = new WeakMap();
        for (var i = mutationRecords.length|0, record, obj, target, attrName; i > 0; i = i-1|0) {
            record = mutationRecords[i];
            if (record.type === "attributes" || record.type === "characterData") {
                target = record.target;
                obj = attributeValuesMap.get(target);
                if (!obj) attributeValuesMap.set(target, (obj = {}));
                attrName = record.attributeName;
                record.newValue = obj[attrName] || target.getAttributeNS(record.attributeNamespace, attrName);
                obj[attrName] = target.oldValue;
            }
        }
        Object_freeze(record);
    }
    Object_freeze(mutationRecords);
    return mutationRecords;
}
///////////////////////////////////////////
////////////////// USAGE //////////////////
///////////////////////////////////////////
var observer = new MutationObserver(function(records) {
    addNewValuePropertyToMutationRecords(records);
    undoMutations(records);
    // now the DOM appears as though the mutations never happened
    redoMutations(records);
    // now the DOM looks like this mutation observer never interfered
});
// NOTE that when you use characterData, characterDataOldValue must also be set characterDataOldValue to true
// NOTE that when you use attributes, characterDataOldValue must also be set attributeOldValue to true
observer.observe(document.getElementById("observe-everything"), {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true
});
})();