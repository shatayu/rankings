import { useState, useEffect } from 'react';
import styles from './Input.module.css';
import axios from 'axios';
import {EntryState} from '../atoms';
import {useRecoilState} from 'recoil';
import DeleteAllEntriesButton from './DeleteAllEntriesButton.react';
import ShareLinkButton from './ShareLinkButton.react';
import AddEntryToListButton from './AddEntryToListButton.react';
import StartRankingButton from './StartRankingButton.react';
import EntryInputTextbox from './EntryInputTextbox.react';

/*
 * once the user clicks "Start Ranking"
 * - generate responsesGraph
 * - advance to Rankings page
 * 
 * What this looks like in code:
 * - generate responsesGraph
 * - on the app page "if responsesGraph != null && userPage == 2 then advance to next page"
 */ 

export default function Input({onFinalizeEntries}) {
    const [entriesList, setEntriesList] = useRecoilState(EntryState('entriesList'));
    const [hasUserFinalizedRankings, setHasUserFinalizedRankings] = useState(false);

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

    return (
        <div className={styles.container}>
            <div className={styles.textboxContainer}>
                <EntryInputTextbox />
            </div>
            <div className={styles.buttonContainer}>
                <DeleteAllEntriesButton />
                <ShareLinkButton />
                <AddEntryToListButton />
                <StartRankingButton />
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