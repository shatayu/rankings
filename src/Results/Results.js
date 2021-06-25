import {useState, useCallback} from 'react';
import {shortestPath} from '../utils/graphUtils';
import styles from './Results.module.css';

export default function Results({results, graph}) {
    const [selections, setSelections] = useState([]);
    const [pathBetweenSelections, setPathBetweenSelections] = useState('');

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
                    const pathString = path.reduce((term, currentValue) => term + ' > ' + currentValue);
                    setPathBetweenSelections(pathString);
                }
            }
        } else {
            const otherTerm = temp[0] === value ? temp[1] : temp[0];
            setSelections([otherTerm]);
            setPathBetweenSelections('');
        }
        

    }, [graph, results, selections]);

    return (
    <div className={styles.container}>
        <div style={{textAlign: "center"}}>{results.map((term, i) => <ResultElement value={term} key={i} onSelection={onSelection} isSelected={selections.includes(term)}/>)}</div>
        <div className={styles.justification}>{pathBetweenSelections.length > 0 ? pathBetweenSelections : null}</div>
    </div>
    )
}

function ResultElement({value, onSelection, isSelected}) {
    const colorClasses = isSelected ? styles.element + ' ' + styles.selectedElement : styles.element;
    return <div className={colorClasses} onClick={() => onSelection(value)}>{value}</div>
}