import styles from './Input.module.css';
import { Toaster } from 'react-hot-toast';
import DeleteAllEntriesButton from './Buttons/DeleteAllEntriesButton.react';
import ShareLinkButton from './Buttons/ShareLinkButton.react';
import StartRankingButton from './Buttons/StartRankingButton.react';
import EntryInputTextbox from './EntryInputTextbox.react';
import AddedEntriesList from './AddedEntriesList.react';
import TitleTextbox from './TitleTextbox.react';
import { useUpdateListInfoAtoms } from '../utils/APIUtils';

export default function Input({onFinalizeEntries}) {
    useUpdateListInfoAtoms();
    return (
        <>
        <div className={styles.container}>
            <Toaster
                toastOptions={{
                    // Define default options
                    duration: 3000,
                    style: {
                        background: 'white',
                        color: '#111111',
                        minWidth: 205
                    },
                    success: {
                        iconTheme: {
                            primary: '#111111',
                            secondary: 'white',
                        },
                    },
                }}
            />
            <TitleTextbox />
            <div className={styles.textboxContainer}>
                <EntryInputTextbox />
            </div>
            <AddedEntriesList />
            <div className={styles.buttonContainer}>
                <DeleteAllEntriesButton />
                <ShareLinkButton />
                <StartRankingButton />
            </div>
        </div>
        <br />
        <br />
        </>
    );
}