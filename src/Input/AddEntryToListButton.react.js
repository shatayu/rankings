import Button from './Button';
import { useRecoilState } from 'recoil';
import { ReactComponent as Plus } from '../assets/plus.svg';
import { EntryState, InputState } from '../atoms';
import { canEntryBeAddedToEntriesList } from './inputUtils';

export default function AddEntryToListButton() {
    const [entriesList, setEntriesList] = useRecoilState(EntryState('entriesList'));
    const [entryInputTextboxContent, setEntryInputTextboxContent] = useRecoilState(InputState('entryInputTextboxContent'));

    return (
        <Button
            icon={<Plus />}
            isEnabled={canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList)}
            onClick={() => {
                if (canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList)) {
                    // TODO: refactor this into using a method from the textbox component
                    setEntriesList([...entriesList, entryInputTextboxContent]);
                    setEntryInputTextboxContent('');
                }
            }}
        />
    )
}