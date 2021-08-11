import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import { TierListAtom } from "../atoms";
import { useState, useCallback } from 'react';
import { ReactComponent as DragHandle } from '../assets/draghandle.svg';
import styles from './TierFinalizer.module.css';
import StartRankingButton from "./Buttons/StartRankingButton.react";
import AddTierButton from './Buttons/AddTierButton.react';

export default function TierFinalizer() {
    const recoilTierList = useRecoilValue(TierListAtom);

    const [localTierList, setLocalTierList] = useState(recoilTierList);

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const move = (source, destination, droppableSource, droppableDestination) => {
        console.log(destination);
        console.log(droppableDestination);
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

    const getList = useCallback((listID) => {
        return localTierList[listIDToIndex(listID)];
    }, [localTierList]);

    function onDragUpdate(result) {
        const { destination } = result;
        console.log(destination)

        /*
         * on drag start make the outlines visible
         * whenever you are hovering over a new tier change the
         * background color
         */ 
    }

    function onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                getList(source.droppableId),
                source.index,
                destination.index
            );
            
            const index = listIDToIndex(source.droppableId);
            let newTiers = localTierList.slice();
            newTiers[index] = items;
            
            setLocalTierList(newTiers);
        } else {
            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination
            );

            let newTiers = localTierList.slice();
            result.forEach(item => {
                newTiers[item.index] = item.list;
            });

            setLocalTierList(newTiers);
        }
  }

  return (
    <div className={styles.finalizerContainer}>
    <div className={styles.finalTitle}>Drag any drop anything that's in the wrong tier</div>
        <div className={styles.tiersAndButtonWrapper}>
            <div className={styles.allTiersContainerWrapper}>
                <div className={styles.allTiersContainer}>
                    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
                        {localTierList.map((tier, index) => (
                            <Droppable key={index} droppableId={`tier${index}`}>
                                {(provided, snapshot) => (
                                    <div className={styles.oneTierContainer + ' ' + (snapshot.isDraggingOver ? styles.oneTierContainerDraggedOver : '')} {...provided.droppableProps} ref={provided.innerRef}>
                                        <div className={styles.header}>{`Tier ${index + 1}`}</div>
                                        <div className={styles.listContainer}>
                                            {tier.map((item, index) => (
                                                    <Draggable key={item} draggableId={item} index={index}>
                                                        {(provided) => (
                                                            <div className={styles.listItem} key={item} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <DragHandle className={styles.dragHandleIcon} />
                                                                <span className={styles.listItemText}>{item}</span>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                )
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </DragDropContext>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <AddTierButton localTierList={localTierList} setLocalTierList={setLocalTierList} />
                <StartRankingButton localTierList={localTierList}/>
            </div>
        </div>
    </div>
  );
}

function listIDToIndex(listID) {
    return parseInt(listID.replace('tier', ''));
}