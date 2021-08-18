import styles from './Input.module.css';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import StartRankingButton from './Buttons/StartRankingButton.react';
import EntryInputTextbox from './EntryInputTextbox.react';
import TitleTextbox from './TitleTextbox.react';
import { useUpdateListInfoAtoms, isSharedLink } from '../utils/APIUtils';
import TierMenu from './Tiers/TierMenu.react';
import { useRecoilValue } from 'recoil';
import { TierListAtom } from '../atoms';
import { useEffect } from 'react';

export default function Input({onFinalizeEntries}) {
    useUpdateListInfoAtoms();

    // recoil states are too slow for drag and drop, so we use a local list
    // and sync it in StartRankingButton
    const recoilTierList = useRecoilValue(TierListAtom);
    const [localTierList, setLocalTierList] = useState(recoilTierList);

    const [selectedItems, setSelectedItems] = useState({
        items: [],
        currentlyDraggedItem: null
    });

    // if recoil list updates externally via link share update
    useEffect(() => {
        if (isSharedLink()) {
            setLocalTierList(recoilTierList);
        }
    }, [recoilTierList]);

    return (
        <>
        <div className={styles.container} onMouseDown={() => {
            setSelectedItems({
                items: [],
                currentlyDraggedItem: null
            });
        }}>
            <Toaster
                toastOptions={{
                    // Define default options
                    duration: 3000,
                    style: {
                        background: 'white',
                        color: '#111111',
                    },
                    success: {
                        iconTheme: {
                            primary: '#111111',
                            secondary: 'white',
                        },
                    },
                }}
            />
            <TitleTextbox localTierList={localTierList}/>
            <div className={styles.textboxContainer}>
                <EntryInputTextbox  {...{localTierList, setLocalTierList}} />
            </div>
            <TierMenu {...{localTierList, setLocalTierList, selectedItems, setSelectedItems}} />
            <div className={styles.buttonContainer}>
                <StartRankingButton {...{localTierList, setLocalTierList}} />
            </div>
        </div>
        <br />
        <br />
        </>
    );
}