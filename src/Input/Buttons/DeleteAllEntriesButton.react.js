import GenericButton from './GenericButton';
import { ReactComponent as Trash } from '../../assets/trash.svg'
import { useRecoilState } from 'recoil';
import { EntriesListAtom } from '../../atoms';

export default function DeleteAllEntriesButton() {
    const [entriesList, setEntriesList] = useRecoilState(EntriesListAtom);
    return (
        <GenericButton
            icon={<Trash />}
            text='CLEAR ALL'
            isEnabled={entriesList.length > 0}
            onClick={() => setEntriesList([])}
        />
    );
}