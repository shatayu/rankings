import { useEffect } from 'react';
import styles from './Input.module.css';
import axios from 'axios';
import {EntriesListAtom} from '../atoms';
import {useSetRecoilState} from 'recoil';
import DeleteAllEntriesButton from './Buttons/DeleteAllEntriesButton.react';
import ShareLinkButton from './Buttons/ShareLinkButton.react';
import AddEntryToListButton from './Buttons/AddEntryToListButton.react';
import StartRankingButton from './Buttons/StartRankingButton.react';
import EntryInputTextbox from './EntryInputTextbox.react';
import AddedEntriesList from './AddedEntriesList.react';

export default function Input({onFinalizeEntries}) {
    const setEntriesList = useSetRecoilState(EntriesListAtom);

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