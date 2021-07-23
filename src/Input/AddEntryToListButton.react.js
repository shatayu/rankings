import Button from './Button';
import { useRecoilState } from 'recoil';
import { ReactComponent as Plus } from '../assets/plus.svg';
import { EntryState, InputState } from '../atoms';

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

function canEntryBeAddedToEntriesList(entry, entriesList) {
    const spaceLessEntry = entry.replace(' ', '')
    const doesEntryExist = !entriesList.map(term => term.replace(' ', ''))
            .includes(spaceLessEntry);
    
    return spaceLessEntry.length > 0 && !doesEntryExist;
}