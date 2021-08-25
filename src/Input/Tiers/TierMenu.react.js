import { DragDropContext } from "react-beautiful-dnd";
import { useCallback, useEffect } from 'react';
import styles from './TierMenu.module.css';
import AddTierButton from '../Buttons/AddTierButton.react';
import DeleteAllEntriesButton from '../Buttons/DeleteAllEntriesButton.react';
import ShareLinkButton from '../Buttons/ShareLinkButton.react';
import Tier from './Tier.react';
import { move, moveMultiple, reorder, reorderMultiple, listIDToIndex } from './tierMenuUtils';

export default function TierMenu({localTierList, setLocalTierList, selectedItems, setSelectedItems}) {
    // auto-scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onDragStart = useCallback((result) => {    
        const draggedItemTier = listIDToIndex(result.source.droppableId);
        // set every element which is not being dragged to dimmed
        setSelectedItems({
            items: selectedItems.items.some(item => item.tier !== draggedItemTier) ? [] : selectedItems.items,
            currentlyDraggedItem: result.draggableId
        });

        // if currently dragged item isn't in the same tier as other selected items
        // clear selected items
    }, [selectedItems.items, setSelectedItems]);

    const onDragEnd = useCallback((result) => {
        const { source, destination } = result;

        // clear currently dragged item
        setSelectedItems({
            items: selectedItems.items,
            currentlyDraggedItem: null
        });

        // dropped outside the list
        if (!destination) {
            return;
        }
        
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
    }, [localTierList, setLocalTierList, selectedItems, setSelectedItems]);

    return (
        <>
        <div className={styles.buttonContainer} onMouseDown={e => e.stopPropagation()}>
            <DeleteAllEntriesButton {...{localTierList, setLocalTierList, selectedItems, setSelectedItems}} />
            <AddTierButton {...{localTierList, setLocalTierList, selectedItems, setSelectedItems}} />
            <ShareLinkButton tierList={localTierList} />
        </div>
        <div className={styles.titleContainer}>
            <div className={styles.subtitle}>{localTierList.length > 1 ? 'Drag items to move them between tiers' : '\u0020'}</div>
        </div>
        <DragDropContext onDragStart={onDragStart} onDragEnd={result => onDragEnd(result, localTierList, setLocalTierList)}>
            <div className={styles.allTiersContainer}>
                {localTierList.map((tier, tierIndex) => (
                    <Tier key={`tierContainer${tierIndex}`} {...{
                        tier,
                        tierIndex,
                        localTierList,
                        setLocalTierList,
                        selectedItems,
                        setSelectedItems
                    }} />
                ))}
            </div>
        </DragDropContext>
        </>
    );
}