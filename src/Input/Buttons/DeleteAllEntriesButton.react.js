import GenericButton from './GenericButton';
import { ReactComponent as Trash } from '../../assets/trash.svg'
import { useRecoilState } from 'recoil';
import { EntryState } from '../../atoms';

export default function DeleteAllEntriesButton() {
    const [entriesList, setEntriesList] = useRecoilState(EntryState('entriesList'));
    return (
        <GenericButton
            icon={<Trash />}
            isEnabled={entriesList.length > 0}
            onClick={() => setEntriesList([])}
        />
    );
}