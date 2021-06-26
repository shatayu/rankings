import Ranker from './Ranker';
import Input from './Input/Input';
import Results from './Results/Results';
import {useState} from 'react'

function App() {
  // const [entries, setEntries] = useState([]);
  // const [responsesGraph, setResponsesGraph] = useState({});
  // const [results, setResults] = useState([]);
  // const [currentPage, setCurrentPage] = useState(0);

  // const pages = [
  //   <Input key={0} onSubmit={(entries) => {
  //     setEntries(entries);
  //     setCurrentPage(currentPage + 1);
  //   }}/>,
  //   <Ranker key={1} entries={entries} onFinish={(responsesGraph, results) => {
  //     setResponsesGraph(responsesGraph);
  //     setResults(results);
  //     setCurrentPage(currentPage + 1);
  //   }}/>,
  //   <Results key={2} responsesGraph={responsesGraph} results={results}/>
  // ]

  // return pages[currentPage];

  return <Ranker />;
}

export default App;
