import { useState, useEffect, useCallback } from 'react';
import { iterativeMergeSort } from './sortUtils';
import React from 'react';
import Constants from './Constants';
import Pair from './Pair';
import {computeTransitiveClosure, generateEmptyGraph} from './graphUtils';

const teamNames = ['Jayson Tatum', 'Trae Young', 'Donovan Mitchell', 'Luka Doncic', 'Devin Booker'];

function Ranker() {
    let [graph, setGraph] = useState(generateEmptyGraph(teamNames));
    let [currentQuestion, setCurrentQuestion] = useState(null);
    let [questionNumber, setQuestionNumber] = useState(1);
    let [doneRanking, setDoneRanking] = useState(false);

    // handle graph update
    const onSelection = useCallback((better, worse) => {
        let tempGraph = {
            ...graph
        }

        tempGraph[better][worse] = Constants.BETTER;
        tempGraph[worse][better] = Constants.WORSE;

        tempGraph = computeTransitiveClosure(tempGraph, teamNames);
        setGraph(tempGraph);

        setQuestionNumber(questionNumber + 1);
    }, [graph, questionNumber])

    useEffect(() => {
        let {array, nextQuestion} = iterativeMergeSort(teamNames, graph);
        
        if (nextQuestion != null) {
            setCurrentQuestion(<Pair a={nextQuestion[0]} b={nextQuestion[1]} onSelection={onSelection} />)
        } else {
            array.reverse();
            setCurrentQuestion(
                <div style={{
                    backgroundColor: "#111111",
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    {array.map((term, i) => <div style={{color: "white", margin: 10}} key={i}>{term}</div>)}
                </div>
            );
            setDoneRanking(true);
        }
    }, [graph, questionNumber, onSelection]);

    // https://stackoverflow.com/questions/12346054/number-of-comparisons-in-merge-sort
    const n = teamNames.length;
    const maxNumberOfQuestions = Math.ceil(n * Math.log2(n) - 2 ** Math.log2(n) + 1)

    return <div>{currentQuestion}
            {doneRanking ? null : <span style={{
                position: 'fixed',
                top: '95vh',
                left: '50vw',
                transform: 'translate(-50%, -50%)',
                zIndex: '5',
                color: 'white'
            }}>{questionNumber} out of up to {maxNumberOfQuestions} </span>}</div>;
}

export default Ranker;