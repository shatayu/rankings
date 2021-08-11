import GenericButton from "../../Input/Buttons/GenericButton";
import { ReactComponent as PreviousIcon } from '../../assets/previous_question_arrow.svg';
import styles from '../../Input/Input.module.css'

export default function PreviousTierButton() {
    return (
        <GenericButton
            icon={<PreviousIcon className={styles.buttonIcon} />}
            text={'PREVIOUS'}
            isEnabled={true}
            onClick={() => {}}
            isDeleteButton={false}
        />
    );
}