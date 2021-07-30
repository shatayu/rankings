import GenericButton from './GenericButton';
import { ReactComponent as Trash } from '../../assets/trash.svg'
import { useRecoilState } from 'recoil';
import { EntriesListAtom } from '../../atoms';
import styles from '../Input.module.css';

export default function DeleteAllEntriesButton() {
    const [entriesList, setEntriesList] = useRecoilState(EntriesListAtom);
    return (
        <GenericButton
            icon={<Trash className={styles.buttonIcon} />}
            text='CLEAR ALL'
            isEnabled={entriesList.length > 0}
            onClick={() => setEntriesList([])}
        />
    );
}