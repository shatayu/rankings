import { useState, useEffect, useCallback } from 'react';
import { EntriesListAtom, ResponsesGraphAtom, UserSortedRankingsAtom, UserQuestionsAskedAtom, PageNumberAtom, TitleAtom, TierListAtom } from '../atoms';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getNextQuestion } from '../utils/sortUtils';
import { getQuestionNumber } from '../utils/graphUtils';
import React from 'react';
import Constants from '../Constants';
import Pair from '../Pair/Pair';
import styles from './Ranker.module.css';
import PageNumbers from '../PageNumbers';
import ProgressIndicator from './ProgressIndicator.react';

export default function Ranker() {
    const tierList = useRecoilValue(TierListAtom);
    const [currentTier, setCurrentTier] = useState(0);

    const [responsesGraph, setResponsesGraph] = useRecoilState(ResponsesGraphAtom);
    const [userQuestionsAsked, setUserQuestionsAsked] = useRecoilState(UserQuestionsAskedAtom);

    const title = useRecoilValue(TitleAtom);

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
        if (questionNumber === userQuestionsAsked.length + 1) {
            setUserQuestionsAsked([...userQuestionsAsked, [better, worse]]);
        } else {
            let copy = userQuestionsAsked.slice();
            copy[questionNumber - 1] = [better, worse];
            setUserQuestionsAsked(copy);
        }
        setQuestionNumber(questionNumber + 1);
    }, [questionNumber, setUserQuestionsAsked, updateResponseGraph, userQuestionsAsked]);

    // ask questions
    useEffect(() => {
        let {array, nextQuestion} = getNextQuestion(tierList, responsesGraph);
        
        if (nextQuestion != null) {
            const askedQuestionNumber = getQuestionNumber(userQuestionsAsked, nextQuestion[0], nextQuestion[1]);
            const better = askedQuestionNumber !== -1 ? userQuestionsAsked[askedQuestionNumber - 1][0] : null;
            setCurrentQuestion(<Pair a={nextQuestion[0]} b={nextQuestion[1]} onSelection={onSelection} highlightedTerm={better}/>)
        } else if (currentTier < tierList.length) {
            setCurrentTier(currentTier + 1);
        } else {
            setDoneRanking(true);
            setUserSortedRankings(array);  
            setPageNumber(PageNumbers.RESULTS);          
        }
    }, [responsesGraph, questionNumber, onSelection, entries, userQuestionsAsked, setUserSortedRankings, setPageNumber, tierList, currentTier]);

    if (responsesGraph == null) {
        return null;
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.title}>{title}</div>
                {currentQuestion}
                <ProgressIndicator
                    questionNumber={questionNumber}
                    setQuestionNumber={setQuestionNumber}
                    setCurrentQuestion={setCurrentQuestion}
                    userQuestionsAsked={userQuestionsAsked}
                    setUserQuestionsAsked={setUserQuestionsAsked}
                    responsesGraph={responsesGraph}
                    setResponsesGraph={setResponsesGraph}
                    tierList={tierList}
                    currentTier={currentTier}
                    onForwardClick={onSelection}
                    doneRanking={doneRanking}
                />
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