import styles from './Input.module.css';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import ShareLinkButton from './Buttons/ShareLinkButton.react';
import StartRankingButton from './Buttons/StartRankingButton.react';
import EntryInputTextbox from './EntryInputTextbox.react';
import TitleTextbox from './TitleTextbox.react';
import { useUpdateListInfoAtoms } from '../utils/APIUtils';
import TierFinalizer from '../Tiers/TierFinalizer.react';

export default function Input({onFinalizeEntries}) {
    useUpdateListInfoAtoms();

    const [localTierList, setLocalTierList] = useState([[]]);
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
                <EntryInputTextbox  {...{localTierList, setLocalTierList}} />
            </div>
            <TierFinalizer {...{localTierList, setLocalTierList}} />
            <div className={styles.buttonContainer}>
                <ShareLinkButton />
                <StartRankingButton {...{localTierList, setLocalTierList}} />
            </div>
        </div>
        <br />
        <br />
        </>
    );
}