import { useState, useCallback, useEffect } from 'react';
import Button from './Button';
import styles from './Input.module.css';
import axios from 'axios';
import copy from 'copy-to-clipboard';

export default function Input({onFinalizeEntries}) {
    const [value, setValue] = useState('');
    const [entries, setEntries] = useState([]);
    const [hasUserFinalizedRankings, setHasUserFinalizedRankings] = useState(false);

    // if user came from shared link then fill in list
    useEffect(() => {
        async function putNewList() {
            const listID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

            if (listID.length > 0) {
                const getURI = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists/' + listID;
                const result = await axios.get(getURI);
                const list = result.data?.Item?.list ?? [];
                setEntries(list);
            }
        }

        putNewList();
    }, []);

    // on user submit
    useEffect(() => {
        if (hasUserFinalizedRankings) {
            onFinalizeEntries(entries);
        }
    }, [entries, hasUserFinalizedRankings, onFinalizeEntries])

    // add term to entry
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
            <Button isEnabled={true} icon={null} onClick={() => {}}/>
            <div className={entries.length > 1 ? styles.button + ' ' + styles.enabledButton : styles.button + ' ' + styles.disabledButton} onClick={async () => {
                    // send URL up to DB
                    const url = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists';
            
                    const body = {
                        question: '',
                        list: entries
                    };

                    const result = await axios.put(url, body);

                    const baseURL = window.location.href.substr(0, window.location.href.lastIndexOf('/')) + '/';
                    copy(baseURL + result.data.new_id);

                    // add UI
                }}><svg width="24" height="24" viewBox="0 0 24 24"><path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z"/></svg></div>
                <div
                    className={value.length > 0 &&
                    !entries.map(term => term.replace(' ', '')).includes(value.replace(' ', '')) ?
                    styles.button + ' ' + styles.enabledButton : styles.button + ' ' + styles.disabledButton}
                    onClick={e => onSubmit(e, value)}>
                    <svg width="24" height="24" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg></div>
                <div className={entries.length > 1 || (value.length > 0 && entries.length > 0) ? styles.button + ' ' + styles.enabledButton : styles.button + ' ' + styles.disabledButton} onClick={e => {
                    if (!entries.map(term => term.replace(' ', '')).includes(value.replace(' ', ''))) {
                        if (value.length > 0) {
                            onSubmit(e, value);
                            setHasUserFinalizedRankings(true);
                        } else if (entries.length > 1) {
                            setHasUserFinalizedRankings(true);
                        }
                    }
                }}><svg width="24" height="24" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg></div>
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