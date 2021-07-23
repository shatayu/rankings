import { useCallback } from 'react';
import { useRecoilState } from "recoil"
import { EntryState, InputState } from "../atoms"
import styles from './Input.module.css';
import { canEntryBeAddedToEntriesList } from './inputUtils';

export default function EntryInputTextbox() {
    const [entryInputTextboxContent, setEntryInputTextboxContent] = useRecoilState(InputState('entryInputTextboxContent'));
    const [entriesList, setEntriesList] = useRecoilState(EntryState('entriesList'));

    // add term to entry
    const onSubmit = useCallback((e, value) => {  
        e.preventDefault();
        if (canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList)) {
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