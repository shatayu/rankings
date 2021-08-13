import GenericButton from './GenericButton';
import { useRecoilState } from 'recoil';
import { ReactComponent as Plus } from '../../assets/plus.svg';
import { EntriesListAtom, EntryInputTextboxAtom } from '../../atoms';
import { canEntryBeAddedToEntriesList, addEntryToEntriesList } from '../../utils/inputUtils';
import styles from '../Input.module.css';

export default function AddEntryToListButton() {
    const [entriesList, setEntriesList] = useRecoilState(EntriesListAtom);
    const [entryInputTextboxContent, setEntryInputTextboxContent] = useRecoilState(EntryInputTextboxAtom);

    const isEnabled = canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList);

    const addToText = () => {
        if (canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList)) {
            // TODO: refactor this into using a method from the textbox component
            addEntryToEntriesList(entryInputTextboxContent, entriesList, setEntriesList);
            setEntryInputTextboxContent('');
        }
    }

    return (
        <div
        className={styles.addItemIconContainer + ' ' + (isEnabled ?  styles.enabledButton : styles.disabledButton)}
        onClick={() => {
            if (isEnabled) {
                addToText()
            }
        }}
    >
        <Plus className={styles.buttonIcon} />
    </div>
    )
}