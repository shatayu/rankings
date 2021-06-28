import { useState, useCallback, useEffect } from 'react';
import styles from './Input.module.css';
import axios from 'axios';

export default function Input({onFinalizeEntries}) {

    const [value, setValue] = useState('');
    const [entries, setEntries] = useState([]);
    const [hasUserFinalizedRankings, setHasUserFinalizedRankings] = useState(false);

    // test API calls out
    useEffect(() => {
        async function putNewList() {
            // console.log(window.location.href);
            // const url = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists';
            
            // const body = {
            //     question: 'MWAHAHAHAHA EVIL',
            //     list: ['g', 'i', 'h']
            // };
            // // console.log(result.body);

            // const awaitResult = await axios.put(url, body);
            // console.log(awaitResult);

            // const newID = awaitResult.data.split(" ")[2];
            // console.log(newID);

            // const getURI = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists/' + newID;
            // const awaitGetResult = await axios.get(getURI);
            // console.log('get result');
            // console.log(awaitGetResult.data);
        }

        putNewList();

        // const url = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists/test';
        // axios.get(url).then(response => console.log(response));
    }, []);

    useEffect(() => {
        if (hasUserFinalizedRankings) {
        onFinalizeEntries(entries);
        }
    }, [entries, hasUserFinalizedRankings, onFinalizeEntries])

    const onSubmit = useCallback((e, value) => {
        e.preventDefault();
        const spaceLessValue = value.replace(' ', '');
        if (!entries.map(term => term.replace(' ', '')).includes(spaceLessValue) && spaceLessValue.length > 0) {
            setEntries([...entries, value]);
            setValue('');
        }
    }, [entries]);

    return (
        <div className={styles.container}>
            <div className={styles.textboxContainer}>
                <form onSubmit={e => onSubmit(e, value)}>
                    <label>
                    <input
                        type="text"
                        value={value}
                        className={styles.textbox}
                        placeholder="Enter item here"
                        onChange={(event) => {
                            setValue(event.target.value)
                        }}
                    />
                    </label>
                </form>
            </div>
            <div className={styles.buttonContainer}>
                <div className={value.length > 0 && !entries.map(term => term.replace(' ', '')).includes(value.replace(' ', '')) ? styles.button : styles.disabledButton} onClick={e => onSubmit(e, value)}>Add to List</div>
                <div className={entries.length > 1 || (value.length > 0 && entries.length > 0) ? styles.button : styles.disabledButton} onClick={e => {
                    if (!entries.map(term => term.replace(' ', '')).includes(value.replace(' ', ''))) {
                        if (value.length > 0) {
                            onSubmit(e, value);
                            setHasUserFinalizedRankings(true);
                        } else if (entries.length > 1) {
                            setHasUserFinalizedRankings(true);
                        }
                    }
                }}>Start Ranking</div>
            </div>
            <div className={styles.entryContainer}>
                {entries.map((value, i) => <InputElement key={i} value={value} onRemove={() => {
                    setEntries(entries.filter(entry => entry !== value));
                }} />)}
            </div>
        </div>
    );
}

function InputElement({value, onRemove}) {
    return (
        <div className={styles.entry}>
            {value}
            <DeleteIcon onRemove={onRemove} />
        </div>
    );
}

function DeleteIcon({onRemove}) {
    return (
        <svg className={styles.svgIcon} onClick={onRemove} viewBox="0 0 20 20">
            <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
        </svg>
    );
}