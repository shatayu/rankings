import GenericButton from './GenericButton';
import { ReactComponent as Trash } from '../../assets/trash.svg'
import { useRecoilState } from 'recoil';
import { TitleAtom } from '../../atoms';
import styles from '../Input.module.css';

export default function DeleteAllEntriesButton({localTierList, setLocalTierList, setCurrentTier}) {
    const [title, setTitle] = useRecoilState(TitleAtom);
    return (
        <GenericButton
            icon={<Trash className={styles.buttonIcon} />}
            text='CLEAR ALL'
            isEnabled={(localTierList.length > 0 && localTierList[0].length > 0) || title.length > 0}
            onClick={() => {
                setLocalTierList([[]]);
                setTitle('');
            }}
            isDeleteButton={true}
        />
    );
}