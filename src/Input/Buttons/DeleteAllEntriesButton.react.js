import GenericButton from './GenericButton';
import { ReactComponent as Trash } from '../../assets/trash.svg'
import { useRecoilState } from 'recoil';
import { EntriesListAtom, TitleAtom } from '../../atoms';
import styles from '../Input.module.css';

export default function DeleteAllEntriesButton() {
    const [entriesList, setEntriesList] = useRecoilState(EntriesListAtom);
    const [title, setTitle] = useRecoilState(TitleAtom);
    return (
        <GenericButton
            icon={<Trash className={styles.buttonIcon} />}
            text='CLEAR ALL'
            isEnabled={entriesList.length > 0 || title.length}
            onClick={() => {
                setEntriesList([]);
                setTitle('');
            }}
            isDeleteButton={true}
        />
    );
}