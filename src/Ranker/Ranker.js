import { useState, useEffect, useCallback } from 'react';
import { EntriesListAtom, ResponsesGraphAtom, UserSortedRankingsAtom, UserQuestionsAskedAtom, PageNumberAtom } from '../atoms';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { iterativeMergeSort } from '../utils/sortUtils';
import React from 'react';
import Constants from '../Constants';
import Pair from '../Pair/Pair';
import styles from './Ranker.module.css';
import PageNumbers from '../PageNumbers';
import { ReactComponent as PreviousQuestionArrow } from '../assets/previous_question_arrow.svg';
import { ReactComponent as NextQuestionArrow } from '../assets/next_question_arrow.svg';


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
                <ProgressIndicator
                    questionNumber={questionNumber}
                    setQuestionNumber={setQuestionNumber}
                    setCurrentQuestion={setCurrentQuestion}
                    userQuestionsAsked={userQuestionsAsked}
                    setUserQuestionsAsked={setUserQuestionsAsked}
                    responsesGraph={responsesGraph}
                    setResponsesGraph={setResponsesGraph}
                    n={entries.length}
                    doneRanking={doneRanking}/>
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

function ProgressIndicator({
        questionNumber,
        setQuestionNumber,
        setCurrentQuestion,
        userQuestionsAsked,
        setUserQuestionsAsked,
        responsesGraph,
        setResponsesGraph,
        n,
        doneRanking
    }) {
    if (doneRanking) {
        return null;
    }

    // https://stackoverflow.com/questions/12346054/number-of-comparisons-in-merge-sort
    const log = Math.ceil(Math.log2(n));
    const maxNumberOfQuestions = n * log - 2 ** log + 1;

    const arrowProps = {
        width: 18,
        height: 18,
        margintop: 10
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <PreviousQuestionArrow {...arrowProps} color={questionNumber > 1 ? '#BBBBBB' : '#999999'} onClick={() => {
                if (questionNumber > 1) {
                    const previousQuestion = userQuestionsAsked[questionNumber - 2];
                    const a = previousQuestion[0];
                    const b = previousQuestion[1];
                    setCurrentQuestion(previousQuestion);
                    setQuestionNumber(questionNumber - 1);

                    // modify this behavior to support the forward button
                    setUserQuestionsAsked(userQuestionsAsked.slice(0, questionNumber - 2));
                    setResponsesGraph({
                        ...responsesGraph,
                        [`${a}`]: {
                            ...responsesGraph[`${a}`],
                            [`${b}`]: Constants.NOT_COMPARED
                        },
                        [`${b}`]: {
                            ...responsesGraph[`${b}`],
                            [`${a}`]: Constants.NOT_COMPARED
                        }
                    });
                }
            }}/>
            <span className={styles.progressIndicator}>{questionNumber} out of up to {maxNumberOfQuestions}</span>
            <NextQuestionArrow {...arrowProps} color={questionNumber < maxNumberOfQuestions - 2 ? '#BBBBBB' : '#999999'} />
        </div>
    );
}