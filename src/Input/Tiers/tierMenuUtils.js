export function move(source, destination, droppableSource, droppableDestination) {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = [
        {
            index: listIDToIndex(droppableSource.droppableId),
            list: sourceClone
        },
        {
            index: listIDToIndex(droppableDestination.droppableId),
            list: destClone
        }
    ];

    return result;
};

export function moveMultiple(sourceArray, destinationArray, selectedItems, droppableSources, droppableDestinations) {
    const sourceClone = JSON.parse(JSON.stringify(sourceArray));
    const destClone = JSON.parse(JSON.stringify(destinationArray));

    droppableSources.forEach((droppableSource, index) => {
        const removed = sourceClone[droppableSource.index];
        const droppableDestination = droppableDestinations[index];

        destClone.splice(droppableDestination.index, 0, removed);
    });
    
    const bannedIndices = new Set(droppableSources.map(item => item.index));

    const items = [
        {
            index: listIDToIndex(droppableSources[0].droppableId),
            list: sourceClone.filter((term, index) => !bannedIndices.has(index))
        },
        {
            index: listIDToIndex(droppableDestinations[0].droppableId),
            list: destClone
        }
    ];

    return {
        items,
        newSelectedItems: selectedItems.map(item => ({
            ...item,
            index: destClone.indexOf(item.name)
        }))
    };
};

export function reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export function reorderMultiple(list, selectedItems, draggedItemStartIndex, draggedItemEndIndex) {
    if (draggedItemStartIndex === draggedItemEndIndex) {
        return {
            items: list,
            newSelectedItems: selectedItems
        };
    }

    const insertionIndex = draggedItemEndIndex + (draggedItemStartIndex < draggedItemEndIndex ? 1 : 0);
    const selectedItemNames = selectedItems.sort((a, b) => a.index - b.index).map(item => item.name);
    let newList = [];

    // add in everything before the list
    for (let i = 0; i < insertionIndex; ++i) {
        if (!selectedItemNames.includes(list[i])) {
            newList.push(list[i]);
        }
    }

    // add in all of the selected items
    for (let i = 0; i < selectedItemNames.length; ++i) {
        newList.push(selectedItemNames[i]);
    }

    // add in everything after
    for (let i = insertionIndex; i < list.length; ++i) {
        if (!selectedItemNames.includes(list[i])) {
            newList.push(list[i]);
        }
    }

    return {
        items: newList,
        newSelectedItems: selectedItems.map((item, i) => ({
            ...item,
            index: newList.indexOf(item.name)
        }))
    }
}

export function listIDToIndex(listID) {
    return parseInt(listID.replace('tier', ''));
}