import { useState, useCallback } from 'react';
import { useRecoilState } from "recoil"
import { EntryInputTextboxAtom } from "../atoms"
import styles from './Input.module.css';
import { canEntryBeAddedToEntriesList } from '../utils/inputUtils';
import TextareaAutosize from 'react-textarea-autosize';
import Dropdown from 'react-dropdown';
import './Dropdown.css';
import { useEffect } from 'react';

export default function EntryInputTextbox({localTierList, setLocalTierList}) {
    const [entryInputTextboxContent, setEntryInputTextboxContent] = useRecoilState(EntryInputTextboxAtom);
    const [currentTier, setCurrentTier] = useState(0);

    const entriesList = localTierList.slice().flat();

    // add term to entry
    const onSubmit = useCallback((e, value) => {  
        e.preventDefault();
        if (value === 'nflteams') {
            const NFLTeams = getNFLTeams().sort();
            setLocalTierList([NFLTeams]);
            setEntryInputTextboxContent('');
        } else if (value === 'colors') {
            const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'black', 'gray', 'white'].sort();
            setLocalTierList([colors]);
            setEntryInputTextboxContent('');
        } else {
            if (canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList)) {
                const copy = localTierList.slice();
                copy[currentTier].push(entryInputTextboxContent);
                setLocalTierList(copy);
                setEntryInputTextboxContent('');
            }
        }
    }, [currentTier, entriesList, entryInputTextboxContent, localTierList, setEntryInputTextboxContent, setLocalTierList]);

    const canAddToText = canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList);

    const options = localTierList.map((_, index) => ({
        label: `TIER ${index + 1}`,
        value: index
    }));

    const anyTierIsEmpty = localTierList.some(tier => tier.length === 0);

    if (!anyTierIsEmpty) {
        options.push({
            label: `TIER ${localTierList.length + 1} (NEW)`,
            value: localTierList.length
        });
    }

    // auto-detect "clear all" and reset the current tier accordingly
    useEffect(() => {
        if (localTierList.length === 1 && localTierList[0].length === 0) {
            setCurrentTier(0);
        }
    }, [localTierList]);

    const addingMessage = `ADDING ITEM #${localTierList[currentTier]?.length + 1 ?? '1'}${localTierList.length > 1 ? ' INTO' : ''}`;
    
    return (
        <div className={styles.textboxAndHelperContainer}>
            <form onSubmit={e => onSubmit(e, entryInputTextboxContent)}>
                    <label>
                        <TextareaAutosize
                            type="text"
                            value={entryInputTextboxContent}
                            className={styles.textbox}
                            placeholder="Enter item here"
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    onSubmit(event, entryInputTextboxContent);
                                }
                            }}
                            onChange={(event) => {
                                setEntryInputTextboxContent(event.target.value)
                            }}
                            minRows={1}
                        />
                    </label>
                </form>
                <div className={styles.textboxHelper + ' ' + (canAddToText ? styles.enabledTextboxHelper : styles.disabledTextboxHelper)}>
                    {canAddToText || entryInputTextboxContent.length === 0 ? addingMessage : 'CANNOT ADD ITEM TO'}
                    {localTierList.length > 1 && <span>
                        <Dropdown
                            options={options}
                            onChange={option => {
                                const {value} = option;

                                if (value === localTierList.length) {
                                    localTierList.push([]);
                                }
                                setCurrentTier(value);
                            }}
                            value={options[currentTier]}
                            placeholder={'SELECT TIER'}
                        />
                    </span>}
                </div>
        </div>
    );
}

function getNFLTeams() {
    return getAFCTeams().concat(getNFCTeams());
}

function getAFCTeams() {
    return [
        'Chiefs',
        'Chargers',
        'Raiders',
        'Broncos',

        'Patriots',
        'Bills',
        'Jets',
        'Dolphins',

        'Steelers',
        'Ravens',
        'Browns',
        'Bengals',

        'Texans',
        'Colts',
        'Jaguars',
        'Titans'
    ];
}

function getNFCTeams() {
    return [
        'Seahawks',
        'Cardinals',
        '49ers',
        'Rams',

        'Cowboys',
        'Eagles',
        'Football Team',
        'Giants',

        'Packers',
        'Vikings',
        'Bears',
        'Lions',

        'Saints',
        'Falcons',
        'Panthers',
        'Buccaneers'
    ];
}