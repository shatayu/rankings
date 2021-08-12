import GenericButton from "../../Input/Buttons/GenericButton";
import { ReactComponent as Plus } from '../../assets/plus.svg';
import styles from '../../Input/Input.module.css'

export default function addTierButton({localTierList, setLocalTierList}) {
    const anyTierIsEmpty = localTierList.some(tier => tier.length === 0);
    const oneTierHasMultipleItems = localTierList.some(tier => tier.length > 1);

    return (
       <GenericButton
            icon={<Plus className={styles.buttonIcon} />}
            text={'ADD TIER'}
            isEnabled={!anyTierIsEmpty && oneTierHasMultipleItems}
            onClick={() => {
                setLocalTierList([...localTierList, []]);
            }}
            isDeleteButton={false}
       />
    );
}