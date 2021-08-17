import Ranker from './Ranker/Ranker.react';
import Input from './Input/Input.react';
import Results from './Results/Results.react';
import {useState} from 'react'
import {RecoilRoot, useRecoilValue} from 'recoil';
import { PageNumberAtom } from './atoms';
import PageNumbers from './PageNumbers';

function App() {
  return (
    <RecoilRoot>
      <RankingApp />
    </RecoilRoot>
  )
}

function RankingApp() {
  const [entries, setEntries] = useState([]);
  const [responsesGraph, setResponsesGraph] = useState({});
  const [results, setResults] = useState([]);
  const [questionsAsked, setQuestionsAsked] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageNumber = useRecoilValue(PageNumberAtom);

  const pages = [
    <Input key={PageNumbers.INPUT} onFinalizeEntries={(entries) => {
      setEntries(entries);
      setCurrentPage(currentPage + 1);
    }}/>,
    <Ranker key={PageNumbers.RANKER} entries={entries} onFinish={(responsesGraph, results, questionsAsked) => {
      setResponsesGraph(responsesGraph);
      setResults(results);
      setQuestionsAsked(questionsAsked);
      setCurrentPage(currentPage + 1);
    }}/>,
    <Results key={PageNumbers.RESULTS} graph={responsesGraph} results={results} questionsAsked={questionsAsked}/>
  ]

  return (
      <div style={{backgroundColor: '#111111'}}>
        {pages[pageNumber]}
      </div>
  );
}

export default App;
