import { useCallback } from 'react';
import { useRecoilState } from "recoil"
import { EntriesListAtom, EntryInputTextboxAtom } from "../atoms"
import styles from './Input.module.css';
import { canEntryBeAddedToEntriesList } from '../utils/inputUtils';

export default function EntryInputTextbox() {
    const [entryInputTextboxContent, setEntryInputTextboxContent] = useRecoilState(EntryInputTextboxAtom);
    const [entriesList, setEntriesList] = useRecoilState(EntriesListAtom);

    // add term to entry
    const onSubmit = useCallback((e, value) => {  
        e.preventDefault();
        if (canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList)) {
            console.log('adding ' + entryInputTextboxContent + ' to list');
            setEntriesList([...entriesList, value]);
            setEntryInputTextboxContent('');
        }
    }, [entriesList, entryInputTextboxContent, setEntriesList, setEntryInputTextboxContent]);
    
    return (
        <form onSubmit={e => onSubmit(e, entryInputTextboxContent)}>
            <label>
                <input
                    type="text"
                    value={entryInputTextboxContent}
                    className={styles.textbox}
                    placeholder="Enter item here"
                    onChange={(event) => {
                        setEntryInputTextboxContent(event.target.value)
                    }}
                />
            </label>
        </form>
    );
}