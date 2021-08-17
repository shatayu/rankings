import GenericButton from "../../Input/Buttons/GenericButton";
import { ReactComponent as Plus } from '../../assets/plus.svg';
import styles from '../../Input/Input.module.css'

export default function addTierButton({localTierList, setLocalTierList, selectedItems, setSelectedItems}) {
    const anyTierIsEmpty = localTierList.some(tier => tier.length === 0);

    const areItemsSelected = selectedItems.items.length > 0;
    
    const makeNewEmptyTier = () => {
        setLocalTierList([...localTierList, []]);
    }

    const selectedItemNames = new Set(selectedItems.items.map(item => item.name));
    const newLocalTierList = localTierList.map(tier => tier.filter(item => !selectedItemNames.has(item)));
    const wouldAnyTierBeEmpty = newLocalTierList.some(tier => tier.length === 0);

    const makeNewTierWithSelectedItems = () => {
        newLocalTierList.push([...selectedItems.items.map(item => item.name)]);
        setLocalTierList(newLocalTierList);
    }

    const buttonText = areItemsSelected ?
        `NEW TIER WITH ${selectedItems.items.length} ITEM${selectedItems.items.length !== 1 ? 'S' : ''}` :
        'ADD EMPTY TIER';

    return (
       <GenericButton
            icon={<Plus className={styles.buttonIcon} />}
            text={buttonText}
            isEnabled={!wouldAnyTierBeEmpty && !anyTierIsEmpty}
            onClick={areItemsSelected ? makeNewTierWithSelectedItems : makeNewEmptyTier}
            isDeleteButton={false}
       />
    );
}