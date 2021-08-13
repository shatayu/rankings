import {useState, useCallback} from 'react';
import {getPathString} from '../utils/graphUtils';
import { UserSortedRankingsAtom, ResponsesGraphAtom, UserQuestionsAskedAtom, TitleAtom, TierListAtom } from '../atoms';
import styles from './Results.module.css';
import { useRecoilValue } from 'recoil';
import CopyResultsButton from './Buttons/CopyResultsButton.react';
import { Toaster } from 'react-hot-toast';
import RedoRankingButton from './Buttons/RedoRankingButton.react';
import NewRankingButton from './Buttons/NewRankingButton.react';

export default function Results() {
    const results = useRecoilValue(UserSortedRankingsAtom);
    const graph = useRecoilValue(ResponsesGraphAtom);
    const questionsAsked = useRecoilValue(UserQuestionsAskedAtom);
    const title = useRecoilValue(TitleAtom);
    const tierList = useRecoilValue(TierListAtom);

    const [selections, setSelections] = useState([]);
    const [pathBetweenSelections, setPathBetweenSelections] = useState([]);

    const onSelection = useCallback(value => {
        let tempSelections = JSON.parse(JSON.stringify(selections));

        if (!tempSelections.includes(value)) {
            if (tempSelections.length > 1) {
                tempSelections.pop();
            }
            tempSelections.push(value);
            setSelections(tempSelections);
            
            if (tempSelections.length === 2) {
                setPathBetweenSelections(getPathString(tempSelections, results, graph, tierList, questionsAsked));
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
        

    }, [graph, questionsAsked, results, selections, tierList]);

    const fillerExplanation = <span className={styles.fillerJustification}>Click any pair of terms to learn why one's higher than the other</span>

    return (
        <div className={styles.container}>
            <Toaster
                toastOptions={{
                    // Define default options
                    duration: 3000,
                    style: {
                        background: 'white',
                        color: '#111111',
                        minWidth: 205,
                        fontSize: 16
                    },
                    success: {
                        iconTheme: {
                            primary: '#111111',
                            secondary: 'white',
                        },
                    },
                }}
            />
            <div className={styles.title}>{title}</div>
            <div className={styles.resultsList}>
                {results.map((term, i) => 
                    <ResultElement key={term} value={term} index={i} onSelection={onSelection} isSelected={selections.includes(term)} />)}
            </div>
            <div className={styles.justification}>{pathBetweenSelections.length > 0 ? pathBetweenSelections : fillerExplanation}</div>
            <div className={styles.buttonRow}>
                <CopyResultsButton />
                <RedoRankingButton />
                <NewRankingButton />
            </div>
            <br />
            <br />
        </div>
    )
}

function ResultElement({value, index, onSelection, isSelected}) {
    const colorClasses = isSelected ? styles.element + ' ' + styles.selectedElement : styles.element;
    return (
        <div className={colorClasses} onClick={() => onSelection(value)}>
            <span className={styles.resultNumber}>{`${index + 1}. `}</span>
            {value}
        </div>
    );
}