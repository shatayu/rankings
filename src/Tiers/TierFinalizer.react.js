import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { TierListAtom } from "../atoms";
import { useCallback } from 'react';


export default function TierFinalizer() {
  const [tierList, setTierList] = useRecoilState(TierListAtom);

    const reorder = (list, startIndex, endIndex) => {
        console.log(list);
        console.log(startIndex)
        console.log(endIndex);
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const move = (source, destination, droppableSource, droppableDestination) => {
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
        return tierList[listIDToIndex(listID)];
    }, [tierList]);

  function onDragEnd(result) {
    const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            console.log(source.droppableId);
            console.log(destination.droppableId);
            const items = reorder(
                getList(source.droppableId),
                source.index,
                destination.index
            );
            
            const index = listIDToIndex(source.droppableId);
            let newTiers = tierList.slice();
            newTiers[index] = items;

            setTierList(newTiers);
        } else {
            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination
            );

            let newTiers = tierList.slice();
            result.forEach(item => {
                newTiers[item.index] = item.list;
            });

            setTierList(newTiers);
        }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
        {tierList.map((tier, index) => (
            <Droppable key={index} droppableId={`tier${index}`}>
                {provided => (
                    <>
                    <div style={{color: 'white'}}>{`Tier ${index + 1}`}</div>
                    <ul style={{color: 'white'}} {...provided.droppableProps} ref={provided.innerRef}>
                        {tier.map((item, index) => {
                            return (
                                <Draggable key={item} draggableId={item} index={index}>
                                    {(provided) => (
                                        <li key={item} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            {item}
                                        </li>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </ul>
                    </>
                )}
            </Droppable>
        ))}
    </DragDropContext>
  );
}

function listIDToIndex(listID) {
    return parseInt(listID.replace('tier', ''));
}