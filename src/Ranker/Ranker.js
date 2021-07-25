import { useState, useEffect, useCallback } from 'react';
import { EntriesListAtom, ResponsesGraphAtom, UserSortedRankingsAtom, UserQuestionsAskedAtom, PageNumberAtom } from '../atoms';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { iterativeMergeSort } from '../utils/sortUtils';
import React from 'react';
import Constants from '../Constants';
import Pair from '../Pair/Pair';
import styles from './Ranker.module.css';
import PageNumbers from '../PageNumbers';

export default function Ranker() {
    const [responsesGraph, setResponsesGraph] = useRecoilState(ResponsesGraphAtom);
    const [userQuestionsAsked, setUserQuestionsAsked] = useRecoilState(UserQuestionsAskedAtom);

    const setUserSortedRankings = useSetRecoilState(UserSortedRankingsAtom);
    const setPageNumber = useSetRecoilState(PageNumberAtom);

    const entries = useRecoilValue(EntriesListAtom);

    let [currentQuestion, setCurrentQuestion] = useState(null);
    let [questionNumber, setQuestionNumber] = useState(1);
    let [doneRanking, setDoneRanking] = useState(false);

    // get response graph callback
    const updateResponseGraph = useCallback((better, worse) => {
        setResponsesGraph(createNewResponsesGraph(responsesGraph, better, worse));
    }, [responsesGraph, setResponsesGraph]);

    // get update callback
    const onSelection = useCallback((better, worse) => {
        updateResponseGraph(better, worse);
        setUserQuestionsAsked([...userQuestionsAsked, [better, worse]]);
        setQuestionNumber(questionNumber + 1);
    }, [questionNumber, setUserQuestionsAsked, updateResponseGraph, userQuestionsAsked]);

    // ask questions
    useEffect(() => {
        let {array, nextQuestion} = iterativeMergeSort(entries, responsesGraph);
        
        if (nextQuestion != null) {
            setCurrentQuestion(<Pair a={nextQuestion[0]} b={nextQuestion[1]} onSelection={onSelection} />)
        } else {
            setDoneRanking(true);
            setUserSortedRankings(array);  
            setPageNumber(PageNumbers.RESULTS);          
        }
    }, [responsesGraph, questionNumber, onSelection, entries, userQuestionsAsked, setUserSortedRankings, setPageNumber]);

    if (responsesGraph == null) {
        return null;
    }

    return (
        <>
            <div className={styles.container}>
                {currentQuestion}
                <ProgressIndicator questionNumber={questionNumber} n={entries.length} doneRanking={doneRanking}/>
            </div>
        </>
    );
}

function createNewResponsesGraph(responsesGraph, better, worse) {
    return {
        ...responsesGraph,
        [`${better}`]: {
            ...responsesGraph[`${better}`],
            [`${worse}`]: Constants.BETTER
        },
        [`${worse}`]: {
            ...responsesGraph[`${worse}`],
            [`${better}`]: Constants.WORSE
        }
    };
}

function ProgressIndicator({questionNumber, n, doneRanking}) {
    if (doneRanking) {
        return null;
    }

    // https://stackoverflow.com/questions/12346054/number-of-comparisons-in-merge-sort
    const log = Math.ceil(Math.log2(n));
    const maxNumberOfQuestions = n * log - 2 ** log + 1;
    return <div className={styles.progressIndicator}>{questionNumber} out of up to {maxNumberOfQuestions}</div>
}