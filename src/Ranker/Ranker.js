import { useState, useEffect, useCallback } from 'react';
import { iterativeMergeSort } from '../utils/sortUtils';
import React from 'react';
import Constants from '../Constants';
import Pair from '../Pair/Pair';
import {computeTransitiveClosure, generateEmptyGraph} from '../utils/graphUtils';
import styles from './Ranker.module.css';

export default function Ranker({entries, onFinish}) {
    let [questionsAsked, setQuestionsAsked] = useState([]);
    let [graph, setGraph] = useState(generateEmptyGraph(entries));
    let [responses, setResponses] = useState(generateEmptyGraph(entries));
    let [currentQuestion, setCurrentQuestion] = useState(null);
    let [questionNumber, setQuestionNumber] = useState(1);
    let [doneRanking, setDoneRanking] = useState(false);

    // get response graph callback
    const updateResponseGraph = useCallback((better, worse) => {
        let tempResponses = {
            ...responses
        }

        tempResponses[better][worse] = Constants.BETTER;
        tempResponses[worse][better] = Constants.WORSE;

        setResponses(responses);
    }, [responses]);

    // get transitive closure graph callback
    const updateTransitiveClosureGraph = useCallback((better, worse) => {
        let tempGraph = {
            ...graph
        }

        tempGraph[better][worse] = Constants.BETTER;
        tempGraph[worse][better] = Constants.WORSE;

        tempGraph = computeTransitiveClosure(tempGraph, entries);
        setGraph(tempGraph);
    }, [entries, graph]);

    // get update callback
    const onSelection = useCallback((better, worse) => {
        updateResponseGraph(better, worse);
        updateTransitiveClosureGraph(better, worse);
        setQuestionsAsked([...questionsAsked, [better, worse]]);
        setQuestionNumber(questionNumber + 1);
    }, [questionNumber, questionsAsked, updateResponseGraph, updateTransitiveClosureGraph]);

    // ask questions
    useEffect(() => {
        let {array, nextQuestion} = iterativeMergeSort(entries, graph);
        
        if (nextQuestion != null) {
            setCurrentQuestion(<Pair a={nextQuestion[0]} b={nextQuestion[1]} onSelection={onSelection} />)
        } else {
            setDoneRanking(true);
            onFinish(responses, array, questionsAsked);
        }
    }, [graph, questionNumber, onSelection, responses, entries, onFinish, questionsAsked]);

    return (
        <>
            <div className={styles.container}>
                {currentQuestion}
                <ProgressIndicator questionNumber={questionNumber} n={entries.length} doneRanking={doneRanking}/>
            </div>
        </>
    );
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