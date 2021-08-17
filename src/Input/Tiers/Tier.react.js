import {useCallback} from 'react';
import { ReactComponent as DragHandle } from '../../assets/draghandle.svg';
import { ReactComponent as Trash } from '../../assets/trash.svg';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './TierMenu.module.css';

export default function Tier({tier, tierIndex, localTierList, setLocalTierList, selectedItems, setSelectedItems}) {
    const isItemSelected = useCallback(itemName => {
        return selectedItems.items.filter(item => item.name === itemName).length > 0;
    }, [selectedItems]);

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

    return (
        <div className={styles.oneTierContainer}>
            <div className={styles.header} key={`header${tierIndex}`}>{localTierList.length > 1 ? `Tier ${tierIndex + 1}` : '\u0020'}</div>
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
                        {tier.length === 0 && localTierList.length > 1 && (
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