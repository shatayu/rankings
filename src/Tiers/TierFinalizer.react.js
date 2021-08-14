import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import { TierListAtom } from "../atoms";
import { useCallback, useState, useEffect } from 'react';
import { ReactComponent as DragHandle } from '../assets/draghandle.svg';
import { ReactComponent as Trash } from '../assets/trash.svg';
import styles from './TierFinalizer.module.css';
import StartRankingButton from "./Buttons/StartRankingButton.react";
import AddTierButton from './Buttons/AddTierButton.react';
import GoToInputButton from "./Buttons/GoToInputButton.react";

export default function TierFinalizer() {
    const recoilTierList = useRecoilValue(TierListAtom);

    const [localTierList, setLocalTierList] = useState(recoilTierList);

    const [selectedItems, setSelectedItems] = useState({
        items: [],
        currentlyDraggedItem: null
    });

    const isItemSelected = useCallback(itemName => {
        return selectedItems.items.filter(item => item.name === itemName).length > 0;
    }, [selectedItems]);

    const onDragStart = useCallback((result) => {
        console.log(result);
    
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
            const items = reorder(
                localTierList[index],
                source.index,
                destination.index
            );
            
            let newTiers = JSON.parse(JSON.stringify(localTierList));
            newTiers[index] = items;
            
            setLocalTierList(newTiers);
        } else {
            // dropped in different lists, move to new list
            const sourceIndex = listIDToIndex(source.droppableId);
            const destIndex = listIDToIndex(destination.droppableId);
            const result = move(
                localTierList[sourceIndex],
                localTierList[destIndex],
                source,
                destination
            );
    
            let newTiers = JSON.parse(JSON.stringify(localTierList));
            result.forEach(item => {
                newTiers[item.index] = item.list;
            });
    
            setLocalTierList(newTiers);
        }
    }, [localTierList, selectedItems.items]);

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
        <br />
        <br />
        <div className={styles.titleContainer}>
            <div className={styles.title}>Confirm Tier Selection</div>
            <div className={styles.subtitle}>Drag any incorrectly placed item to the correct tier</div>
        </div>
        <DragDropContext onDragStart={onDragStart} onDragEnd={result => onDragEnd(result, localTierList, setLocalTierList)}>
            <div className={styles.allTiersContainer}>
                {localTierList.map((tier, tierIndex) => (
                    <div className={styles.oneTierContainer}>
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
                                                                const index = selectedItems.items.indexOf(term);
                                                                copy.splice(index, 1);
                                                            }
                                                            setSelectedItems({
                                                                currentlyDraggedItem: selectedItems.currentlyDraggedItem,
                                                                items: copy
                                                            });
                                                        }}
                                                    >
                                                        <DragHandle className={styles.dragHandleIcon}/>
                                                        <span className={styles.listItemText + ' ' + getSelectedItemStyle(term)}
                                                        >
                                                            {term}
                                                            {term === selectedItems.currentlyDraggedItem && selectedItems.items.length > 1 &&
                                                            <span className={styles.draggedItemCount}>{selectedItems.items.length}</span>
                                                            }
                                                        </span>
                                                    </div>
                                                );
                                            }}
                                        </Draggable>
                                    ))}
                                    {tier.length === 0 && (
                                        <DeleteTierButton key={`delete${tierIndex}`} {...{tierIndex, localTierList, setLocalTierList}} />
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
        <div className={styles.buttonContainer}>
            <GoToInputButton />
            <AddTierButton localTierList={localTierList} setLocalTierList={setLocalTierList} />
            <StartRankingButton localTierList={localTierList}/>
        </div>
        <br />
        <br />
        </>
    );
}

function DeleteTierButton({tierIndex, localTierList, setLocalTierList}) {
    return (
        <div className={styles.deleteIcon} onClick={() => {
            const copy = JSON.parse(JSON.stringify(localTierList));
            copy.splice(tierIndex, 1);
            setLocalTierList(copy);
        }}>
            <Trash />
            <div className={styles.deleteIconText}>DELETE TIER</div>
        </div>
    );
}

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

function listIDToIndex(listID) {
    return parseInt(listID.replace('tier', ''));
}