import { useState, useEffect, useCallback } from 'react';
import { iterativeMergeSort } from './utils/sortUtils';
import React from 'react';
import Constants from './Constants';
import Pair from './Pair/Pair';
import {computeTransitiveClosure, generateEmptyGraph} from './utils/graphUtils';
import Results from './Results/Results';

const teamNames = shuffle([
                        //    'Paul George',
                        //    'Kawhi Leonard',
                        //    'Chris Paul',
                        //    'Devin Booker',
                        //    'Giannis Antetokounmpo',
                        //    'Trae Young',
                        //    'Donovan Mitchell',
                        //    'Nikola Jokic',
                        //    'Luka Doncic',
                        //    'Jayson Tatum'

                        'Browns',
                        'Steelers',
                        'Colts',
                        'Bills',
                        'Ravens',
                        'Titans',
                        'Chiefs',
                        'Rams',
                        'Seahawks',
                        'Bears',
                        'Saints',
                        // 'Buccaneers',
                        // 'Football Team',
                        // 'Packers'

                        // 'a',
                        // 'b',
                        // 'c',
                        // 'd',
                        // 'e'

                        // 'bid',
                        // 'shillton',
                        // 'akhil kolluru',
                        // 'bhav jain',
                        // 'faker',
                        // 'frat boy andy',
                        // 'trump',

                        // ahri akali irelia miss fortune nidalee samira seraphine sona riven xayah
                            // 'ahri',
                            // 'akali',
                            // 'diana',
                            // 'evelynn',
                            // 'irelia',
                            // 'miss fortune',
                            // 'nidalee',
                            // 'riven',
                            // 'samira',
                            // 'xayah',
                        ]);

function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function Ranker() {
    let [graph, setGraph] = useState(generateEmptyGraph(teamNames));
    let [responses, setResponses] = useState(generateEmptyGraph(teamNames));
    let [currentQuestion, setCurrentQuestion] = useState(null);
    let [questionNumber, setQuestionNumber] = useState(1);
    let [doneRanking, setDoneRanking] = useState(false);

    // handle graph update
    const onSelection = useCallback((better, worse) => {
        console.log(better + ' > ' + worse);
        // update responses
        let tempResponses = {
            ...responses
        }

        tempResponses[better][worse] = Constants.BETTER;
        tempResponses[worse][better] = Constants.WORSE;

        setResponses(responses);

        // update the closure graph
        let tempGraph = {
            ...graph
        }

        tempGraph[better][worse] = Constants.BETTER;
        tempGraph[worse][better] = Constants.WORSE;

        tempGraph = computeTransitiveClosure(tempGraph, teamNames);
        setGraph(tempGraph);
        
        // update question counter
        setQuestionNumber(questionNumber + 1);
    }, [graph, questionNumber, responses])

    useEffect(() => {
        let {array, nextQuestion} = iterativeMergeSort(teamNames, graph);
        
        if (nextQuestion != null) {
            setCurrentQuestion(<Pair a={nextQuestion[0]} b={nextQuestion[1]} onSelection={onSelection} />)
        } else {
            array.reverse();
            setCurrentQuestion(
                <Results graph={responses} results={array} />
            );
            setDoneRanking(true);
        }
    }, [graph, questionNumber, onSelection, responses]);

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
                color: '#BBBBBB',
                fontSize: 20
            }}>{questionNumber} out of up to {maxNumberOfQuestions} </span>}</div>;
}

export default Ranker;