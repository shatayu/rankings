import { useState, useEffect } from 'react';
import styles from './Input.module.css';
import axios from 'axios';
import {EntryState} from '../atoms';
import {useRecoilState} from 'recoil';
import DeleteAllEntriesButton from './Buttons/DeleteAllEntriesButton.react';
import ShareLinkButton from './Buttons/ShareLinkButton.react';
import AddEntryToListButton from './Buttons/AddEntryToListButton.react';
import StartRankingButton from './Buttons/StartRankingButton.react';
import EntryInputTextbox from './EntryInputTextbox.react';
import AddedEntriesList from './AddedEntriesList.react';

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
            <AddedEntriesList />
        </div>
    );
}