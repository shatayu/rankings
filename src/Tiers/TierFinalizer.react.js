import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useCallback, useState, useEffect } from 'react';
import { ReactComponent as DragHandle } from '../assets/draghandle.svg';
import { ReactComponent as Trash } from '../assets/trash.svg';
import styles from './TierFinalizer.module.css';
import AddTierButton from './Buttons/AddTierButton.react';
import DeleteAllEntriesButton from '../Input/Buttons/DeleteAllEntriesButton.react';

export default function TierFinalizer({localTierList, setLocalTierList}) {
    const [selectedItems, setSelectedItems] = useState({
        items: [],
        currentlyDraggedItem: null
    });

    // clear selection
    useEffect(() => {
        window.addEventListener('mousedown', event => {
            setSelectedItems({
                items: [],
                currentlyDraggedItem: null
            });
        });
    }, []);

    const isItemSelected = useCallback(itemName => {
        return selectedItems.items.filter(item => item.name === itemName).length > 0;
    }, [selectedItems]);

    const onDragStart = useCallback((result) => {    
        // set every element which is not being dragged to dimmed
        setSelectedItems({
            items: selectedItems.items,
            currentlyDraggedItem: result.draggableId
        });

        // add a count of how many total items are being dragged

    }, [selectedItems.items]);

    const onDragEnd = useCallback((result) => {
        const { source, destination } = result;
    
        // dropped outside the list
        if (!destination) {
            setSelectedItems({
                ...selectedItems,
                currentlyDraggedItem: null
            })
            return;
        }

        // clear currently dragged item
        setSelectedItems({
            items: selectedItems.items,
            currentlyDraggedItem: null
        });
        
        if (source.droppableId === destination.droppableId) {
            // dropped in same list, just rearrange
            const index = listIDToIndex(source.droppableId);
                let items = null;
                if (selectedItems.items.length === 0) {
                    items = reorder(
                        localTierList[index],
                        source.index,
                        destination.index
                    );
                } else {
                    const result = reorderMultiple(
                        localTierList[index],
                        selectedItems.items,
                        source.index,
                        destination.index
                    );
                    items = result.items;
                    setSelectedItems({
                        items: result.newSelectedItems,
                        currentlyDraggedItem: null
                    });
                }
                          
                let newTiers = JSON.parse(JSON.stringify(localTierList));
                newTiers[index] = items;
                
                setLocalTierList(newTiers);
        } else {
            // dropped in different lists, move to new list
            const sourceIndex = listIDToIndex(source.droppableId);
            const destIndex = listIDToIndex(destination.droppableId);
            let newTiers = JSON.parse(JSON.stringify(localTierList));

            if (selectedItems.items.length === 0) {
                const result = move(
                    localTierList[sourceIndex],
                    localTierList[destIndex],
                    source,
                    destination
                );
        
                result.forEach(item => {
                    newTiers[item.index] = item.list;
                });
            } else {
                const result = moveMultiple(
                    localTierList[sourceIndex],
                    localTierList[destIndex],
                    selectedItems.items,
                    selectedItems.items.map((item, selectedItemIndex) => ({
                        ...source,
                        index: localTierList[sourceIndex].indexOf(item.name)
                    })),
                    selectedItems.items.map((item, selectedItemIndex) => ({
                        ...destination,
                        index: selectedItemIndex + destination.index
                    }))
                );

                result.items.forEach(item => {
                    newTiers[item.index] = item.list;
                });

                setSelectedItems({
                    items: result.newSelectedItems,
                    currentlyDraggedItem: null
                });
            }
            setLocalTierList(newTiers);
        }
    }, [localTierList, selectedItems, setLocalTierList]);

    const getSelectedItemStyle = useCallback(term => {
        const {currentlyDraggedItem} = selectedItems;
        if (isItemSelected(term)) {
            return currentlyDraggedItem === term || currentlyDraggedItem == null ?
                styles.selectedListItemText :
                styles.selectedListItemButOtherItemBeingDragged;
        } else {
            return '';
        }
    }, [isItemSelected, selectedItems]);
    

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
        <div className={styles.buttonContainer} onMouseDown={e => e.stopPropagation()}>
            <DeleteAllEntriesButton {...{setLocalTierList}}/>
            <AddTierButton localTierList={localTierList} setLocalTierList={setLocalTierList} />
        </div>
        <div className={styles.titleContainer}>
            <div className={styles.subtitle}>Drag items to move them between tiers</div>
        </div>
        <DragDropContext onDragStart={onDragStart} onDragEnd={result => onDragEnd(result, localTierList, setLocalTierList)}>
            <div className={styles.allTiersContainer}>
                {localTierList.map((tier, tierIndex) => (
                    <div className={styles.oneTierContainer} key={`tierContainer${tierIndex}`}>
                        <div className={styles.header}>{`Tier ${tierIndex + 1}`}</div>
                        <Droppable droppableId={`tier${tierIndex}`} key={`tier${tierIndex}`}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={styles.list + ' ' + (snapshot.isDraggingOver ? styles.listDraggedOver : '')}
                                >
                                    {tier.map((term, termIndex) => (
                                        <Draggable key={term} draggableId={term} index={termIndex}>
                                            {(provided, snapshot) => {
                                                return (
                                                    <div
                                                        key={term}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={styles.listItem}
                                                    >
                                                        <DragHandle className={styles.dragHandleIcon}/>
                                                        <span
                                                            className={styles.listItemText + ' ' + getSelectedItemStyle(term)}
                                                            onMouseDown={e => {
                                                                // prevent deselect from triggering
                                                                e.stopPropagation();
                                                            }}
                                                            onClick={() => {
                                                                let copy = selectedItems.items.slice();
                                                                if (!isItemSelected(term)) {
                                                                    copy.push({
                                                                        name: term,
                                                                        index: termIndex,
                                                                        tier: tierIndex
                                                                    });
    
                                                                    // filter out any selection that isn't in this item's tier
                                                                    copy = copy.filter(term => tier.includes(term.name));
                                                                } else {
                                                                    const index = selectedItems.items.map(item => item.name).indexOf(term);
                                                                    copy.splice(index, 1);
                                                                }
                                                                setSelectedItems({
                                                                    currentlyDraggedItem: selectedItems.currentlyDraggedItem,
                                                                    items: copy
                                                                });
                                                            }}
                                                        >
                                                            {term === selectedItems.currentlyDraggedItem && selectedItems.items.length > 1 && snapshot.isDragging
                                                            ? `${term} and ${selectedItems.items.length - 1} others` : term}
                                                        </span>
                                                    </div>
                                                );
                                            }}
                                        </Draggable>
                                    ))}
                                    {tier.length === 0 && (
                                        <DeleteTierButton
                                            key={`delete${tierIndex}`}
                                            {...{tierIndex, localTierList, setLocalTierList}}
                                        />
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
        </>
    );
}

function DeleteTierButton({tierIndex, localTierList, setLocalTierList}) {
    return (
        <div className={styles.deleteIcon} onMouseDown={e => e.stopPropagation()} onClick={() => {
            const copy = JSON.parse(JSON.stringify(localTierList));
            copy.splice(tierIndex, 1);
            setLocalTierList(copy);
        }}>
            <Trash />
            <div className={styles.deleteIconText}>DELETE TIER</div>
        </div>
    );
}

function moveMultiple(sourceArray, destinationArray, selectedItems, droppableSources, droppableDestinations) {
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

function move(source, destination, droppableSource, droppableDestination) {
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

function reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

function reorderMultiple(list, selectedItems, draggedItemStartIndex, draggedItemEndIndex) {
    if (draggedItemStartIndex === draggedItemEndIndex) {
        return {
            items: list,
            newSelectedItems: selectedItems
        };
    }

    const insertionIndex = draggedItemEndIndex + (draggedItemStartIndex < draggedItemEndIndex ? 1 : 0);
    const selectedItemNames = selectedItems.map(item => item.name);
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

function listIDToIndex(listID) {
    return parseInt(listID.replace('tier', ''));
}