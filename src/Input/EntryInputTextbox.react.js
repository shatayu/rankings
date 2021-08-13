import { useCallback } from 'react';
import { useRecoilState } from "recoil"
import { EntriesListAtom, EntryInputTextboxAtom } from "../atoms"
import styles from './Input.module.css';
import { canEntryBeAddedToEntriesList, addEntryToEntriesList } from '../utils/inputUtils';
import TextareaAutosize from 'react-textarea-autosize';

export default function EntryInputTextbox() {
    const [entryInputTextboxContent, setEntryInputTextboxContent] = useRecoilState(EntryInputTextboxAtom);
    const [entriesList, setEntriesList] = useRecoilState(EntriesListAtom);

    // add term to entry
    const onSubmit = useCallback((e, value) => {  
        e.preventDefault();
        if (value === 'nflteams') {
            const NFLTeams = getNFLTeams().sort();
            setEntriesList(NFLTeams);
            setEntryInputTextboxContent('');
        } else if (value === 'colors') {
            const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'black', 'gray', 'white'].sort();
            setEntriesList(colors);
            setEntryInputTextboxContent('');
        } else {
            if (canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList)) {
                addEntryToEntriesList(value, entriesList, setEntriesList);
                setEntryInputTextboxContent('');
            }
        }
    }, [entriesList, entryInputTextboxContent, setEntriesList, setEntryInputTextboxContent]);

    const canAddToText = canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList);
    
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
                    {canAddToText ? 'PRESS ENTER TO ADD' : (entryInputTextboxContent.length > 0 ? 'CANNOT ADD ITEM' : '\u200B')}
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