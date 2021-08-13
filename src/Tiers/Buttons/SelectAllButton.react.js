import GenericButton from "../../Input/Buttons/GenericButton";
import { ReactComponent as SelectAll } from '../../assets/select_all.svg';
import { ReactComponent as X } from '../../assets/x.svg';
import styles from '../../Input/Input.module.css'

export default function SelectAllButton({unselectedTerms, allTermsSelected, tierListState, setTierListState}) {
    return (
        <GenericButton
            icon={allTermsSelected ? <X className={styles.buttonIcon} /> : <SelectAll className={styles.buttonIcon} />}
            text={allTermsSelected ? 'UNSELECT ALL' : 'SELECT ALL'}
            isEnabled={true}
            onClick={() => {
                const {tierList, currentTier} = tierListState;
                let copy = JSON.parse(JSON.stringify(tierList));
                
                copy[currentTier] = allTermsSelected ? [] : [...new Set(copy[currentTier].concat(unselectedTerms))];

                setTierListState({
                    ...tierListState,
                    tierList: copy
                });
            }}
            isDeleteButton={false}
        />
    );
}