import {useState, useCallback} from 'react';
import {shortestPath} from '../utils/graphUtils';
import styles from './Results.module.css';

export default function Results({results, graph, questionsAsked}) {
    const [selections, setSelections] = useState([]);
    const [pathBetweenSelections, setPathBetweenSelections] = useState([]);

    const onSelection = useCallback(value => {
        let temp = selections.slice();

        if (!temp.includes(value)) {
            if (temp.length > 1) {
                temp.pop();
            }
            temp.push(value);
            setSelections(temp);
            
            if (temp.length === 2) {
                const firstTermIndex = results.indexOf(temp[0]);
                const secondTermIndex = results.indexOf(temp[1]);
        
                const betterTermIndex = Math.min(firstTermIndex, secondTermIndex);
                const worseTermIndex = Math.max(firstTermIndex, secondTermIndex);
                
                const path = shortestPath(graph, results[betterTermIndex], results[worseTermIndex]);
        
                if (path.length > 1) {
                    let pathArray = []
                    for (let i = 0; i < path.length - 1; ++i) {
                        const current = path[i];
                        const next = path[i + 1];

                        let questionNumber = -1;
                        questionsAsked.forEach((question, index) => {
                            if (
                                (question[0] === current && question[1] === next) ||
                                (question[0] === next && question[1] === current)
                            ) {
                                questionNumber = index;
                            }
                        });

                        const pathString = ('(Q' + String(questionNumber + 1) + ') You said ' + current + ' is better than ' + next);

                        const pathEntry = <div key={i}>{pathString}</div>
                        pathArray.push(pathEntry);
                    }

                    setPathBetweenSelections(pathArray);
                }
            }
        } else {
            if (temp.length === 2) {
                const otherTerm = temp[0] === value ? temp[1] : temp[0];
                setSelections([otherTerm]);
                setPathBetweenSelections([]);
            } else {
                setSelections([]);
                setPathBetweenSelections([]);
            }
        }
        

    }, [graph, questionsAsked, results, selections]);

    const fillerExplanation = <span className={styles.fillerJustification}>Click any pair of terms to learn why one's higher than the other</span>

    return (
        <div className={styles.container}>
            <div style={{textAlign: "center"}}>{results.map((term, i) => <ResultElement value={term} key={i} onSelection={onSelection} isSelected={selections.includes(term)}/>)}</div>
            <div className={styles.justification}>{pathBetweenSelections.length > 0 ? pathBetweenSelections : fillerExplanation}</div>
        </div>
    )
}

function ResultElement({value, onSelection, isSelected}) {
    const colorClasses = isSelected ? styles.element + ' ' + styles.selectedElement : styles.element;
    return <div className={colorClasses} onClick={() => onSelection(value)}>{value}</div>
}