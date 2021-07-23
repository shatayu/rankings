import { useState, useCallback, useEffect } from 'react';
import Button from './Button';
import styles from './Input.module.css';
import axios from 'axios';
import copy from 'copy-to-clipboard';
import {EntryState} from '../atoms';
import {useRecoilState, useRecoilValue} from 'recoil';
import DeleteAllEntriesButton from './DeleteAllEntriesButton.react';
import ShareLinkButton from './ShareLinkButton.react';
import AddEntryToListButton from './AddEntryToListButton.react';

export default function Input({onFinalizeEntries}) {
    const [value, setValue] = useState('');
    const [entriesList, setEntriesList] = useRecoilState(EntryState('entriesList'));
    const [hasUserFinalizedRankings, setHasUserFinalizedRankings] = useState(false);

    const v = useRecoilValue(EntryState('entriesList'));
    console.log(v);

    // if user came from shared link then fill in list
    useEffect(() => {
        async function putNewList() {
            const listID = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

            if (listID.length > 0) {
                const getURI = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists/' + listID;
                const result = await axios.get(getURI);
                const list = result.data?.Item?.list ?? [];
                setEntriesList(list);
            }
        }

        putNewList();
    }, [setEntriesList]);

    // on user submit
    useEffect(() => {
        if (hasUserFinalizedRankings) {
            onFinalizeEntries(entriesList);
        }
    }, [entriesList, hasUserFinalizedRankings, onFinalizeEntries])

    // add term to entry
    const onSubmit = useCallback((e, value) => {  
        e.preventDefault();
        const spaceLessValue = value.replace(' ', '');
        if (!entriesList.map(term => term.replace(' ', '')).includes(spaceLessValue) && spaceLessValue.length > 0) {
            setEntriesList([...entriesList, value]);
            setValue('');
        }
    }, [entriesList, setEntriesList]);

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
                <DeleteAllEntriesButton />
                <ShareLinkButton />
                <AddEntryToListButton />
                {/* <div
                    className={value.length > 0 &&
                    !entriesList.map(term => term.replace(' ', '')).includes(value.replace(' ', '')) ?
                    styles.button + ' ' + styles.enabledButton : styles.button + ' ' + styles.disabledButton}
                    onClick={e => onSubmit(e, value)}>
                    <svg width="24" height="24" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
                    </div> */}
                <div className={entriesList.length > 1 || (value.length > 0 && entriesList.length > 0) ? styles.button + ' ' + styles.enabledButton : styles.button + ' ' + styles.disabledButton} onClick={e => {
                    if (!entriesList.map(term => term.replace(' ', '')).includes(value.replace(' ', ''))) {
                        if (value.length > 0) {
                            onSubmit(e, value);
                            setHasUserFinalizedRankings(true);
                        } else if (entriesList.length > 1) {
                            setHasUserFinalizedRankings(true);
                        }
                    }
                }}><svg width="24" height="24" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg></div>
            </div>
            <div className={styles.entryContainer}>
                {entriesList.map((value, i) => <InputElement key={i} value={value} onRemove={() => {
                    setEntriesList(entriesList.filter(entry => entry !== value));
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