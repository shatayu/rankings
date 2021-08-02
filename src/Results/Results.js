import {useState, useCallback} from 'react';
import {getPathString} from '../utils/graphUtils';
import { UserSortedRankingsAtom, ResponsesGraphAtom, UserQuestionsAskedAtom } from '../atoms';
import styles from './Results.module.css';
import { useRecoilValue } from 'recoil';

export default function Results() {
    const results = useRecoilValue(UserSortedRankingsAtom);
    const graph = useRecoilValue(ResponsesGraphAtom);
    const questionsAsked = useRecoilValue(UserQuestionsAskedAtom);

    const [selections, setSelections] = useState([]);
    const [pathBetweenSelections, setPathBetweenSelections] = useState([]);

    const onSelection = useCallback(value => {
        let tempSelections = selections.slice();

        if (!tempSelections.includes(value)) {
            if (tempSelections.length > 1) {
                tempSelections.pop();
            }
            tempSelections.push(value);
            setSelections(tempSelections);
            
            if (tempSelections.length === 2) {
                setPathBetweenSelections(getPathString(tempSelections, results, graph, questionsAsked));
            }
        } else {
            if (tempSelections.length === 2) {
                const otherTerm = tempSelections[0] === value ? tempSelections[1] : tempSelections[0];
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
            <div style={{textAlign: "center"}}>
                {results.map((term, i) => 
                    <ResultElement value={term} key={term} onSelection={onSelection} isSelected={selections.includes(term)} />)}
            </div>
            <div className={styles.justification}>{pathBetweenSelections.length > 0 ? pathBetweenSelections : fillerExplanation}</div>
        </div>
    )
}

function ResultElement({value, onSelection, isSelected}) {
    const colorClasses = isSelected ? styles.element + ' ' + styles.selectedElement : styles.element;
    return <div className={colorClasses} onClick={() => onSelection(value)}>{value}</div>
}