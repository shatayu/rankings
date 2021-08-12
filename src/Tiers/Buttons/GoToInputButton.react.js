import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import GenericButton from '../../Input/Buttons/GenericButton';
import styles from '../../Input/Input.module.css';
import { useSetRecoilState } from 'recoil';
import { PageNumberAtom } from '../../atoms';
import PageNumbers from '../../PageNumbers';

export default function GoToInputButton() {
    const setPageNumber = useSetRecoilState(PageNumberAtom);

    return (
        <GenericButton
            icon={<Arrow className={styles.buttonIcon + ' ' + styles.reverseIcon} />}
            text='BACK TO INPUT'
            isEnabled={true}
            onClick={() => {
                setPageNumber(PageNumbers.INPUT);
            }}
            isDeleteButton={false}
        />
    );
}