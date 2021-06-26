import { useState } from 'react';

export default function Input({onInput}) {
  const [value, setValue] = useState('');
  const [entries, setEntries] = useState([]);

  const onSubmit = (e, value) => {
    e.preventDefault();
    console.log('submitted');
    console.log(value);

    setEntries([...entries, value]);
  }

  return (
    <>
      <form onSubmit={e => onSubmit(e, value)}>
        <label>
          Name:
          <input type="text" value={value} onChange={(event) => {
            setValue(event.target.value)
          }}
          
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              console.log('enter');
            }
          }}
          />
        </label>
      </form>
      <div>
        {entries.map((value, i) => <InputElement key={i} value={value} onRemove={() => {}} />)}
      </div>
    
    </>
  );
}

function InputElement({value, onRemove}) {
  return <div onClick={onRemove}>
    {value}
  </div>
}