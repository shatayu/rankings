import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from 'react';
// import { useRecoilState } from "recoil";
// import { TierListAtom } from "../atoms";


export default function TierFinalizer() {
  const [state, setState] = useState({ quotes1: ['a', 'b', 'c', 'd'], quotes2: ['e', 'f', 'g', 'h'] });
//   const [tierListState, setTierListState] = useRecoilState(TierListAtom);

  const reorder = (list, startIndex, endIndex) => {
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

        const result = {};
        result.sourceDrop = sourceClone;
        result.destDrop = destClone;

        return result;
    };

    function getList(listID) {
        if (listID === 'list1') {
            return state.quotes1;
        } else {
            return state.quotes2;
        }
    }

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

            console.log(items);
            console.log(source.droppableId)

            if (source.droppableId === 'list1') {
                const newState = {
                    ...state,
                    quotes1: items,
                };
                console.log(newState);

                console.log('1');
                setState(newState);
            } else {
                const newState = {
                    ...state,
                    quotes2: items
                };
                console.log(newState);
                console.log('2');
                setState(newState);
            }
        } else {
            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination
            );
            
            console.log('3');
            if (source.droppableId === 'list1') {
                setState({
                    quotes1: result.sourceDrop,
                    quotes2: result.destDrop
                });
            } else {
                setState({
                    quotes1: result.destDrop,
                    quotes2: result.sourceDrop
                });
            }

        }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list1">
        {provided => (
            <ul style={{color: 'white'}} {...provided.droppableProps} ref={provided.innerRef}>
               {state.quotes1.map((item, index) => {
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
        )}
      </Droppable>
      <Droppable droppableId="list2">
        {provided => (
            <ul style={{color: 'white'}} {...provided.droppableProps} ref={provided.innerRef}>
               {state.quotes2.map((item, index) => {
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
        )}
      </Droppable>
    </DragDropContext>
  );
}