import Ranker from './Ranker/Ranker';
import Input from './Input/Input';
import Results from './Results/Results';
import {useState} from 'react'

function App() {
  const [entries, setEntries] = useState([]);
  const [responsesGraph, setResponsesGraph] = useState({});
  const [results, setResults] = useState([]);
  const [questionsAsked, setQuestionsAsked] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    <Input key={0} onFinalizeEntries={(entries) => {
      setEntries(entries);
      setCurrentPage(currentPage + 1);
    }}/>,
    <Ranker key={1} entries={entries} onFinish={(responsesGraph, results, questionsAsked) => {
      setResponsesGraph(responsesGraph);
      setResults(results);
      setQuestionsAsked(questionsAsked);
      setCurrentPage(currentPage + 1);
    }}/>,
    <Results key={2} graph={responsesGraph} results={results} questionsAsked={questionsAsked}/>
  ]

  return <div style={{backgroundColor: '#111111'}}>
    {pages[currentPage]}
  </div>
}

export default App;
