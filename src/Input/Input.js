import styles from './Input.module.css';
import DeleteAllEntriesButton from './Buttons/DeleteAllEntriesButton.react';
import ShareLinkButton from './Buttons/ShareLinkButton.react';
import AddEntryToListButton from './Buttons/AddEntryToListButton.react';
import StartRankingButton from './Buttons/StartRankingButton.react';
import EntryInputTextbox from './EntryInputTextbox.react';
import AddedEntriesList from './AddedEntriesList.react';

export default function Input({onFinalizeEntries}) {
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