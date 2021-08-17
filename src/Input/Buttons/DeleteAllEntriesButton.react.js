import GenericButton from './GenericButton';
import { ReactComponent as Trash } from '../../assets/trash.svg'
import { useRecoilState } from 'recoil';
import { TitleAtom } from '../../atoms';
import styles from '../Input.module.css';

export default function DeleteAllEntriesButton({localTierList, setLocalTierList, selectedItems, setSelectedItems}) {
    const [title, setTitle] = useRecoilState(TitleAtom);

    const areItemsSelected = selectedItems.items.length > 0;

    const clearAll = () => {
        setLocalTierList([[]]);
        setTitle('');
    };

    const deleteSelectedItems = () => {
        const selectedItemNames = new Set(selectedItems.items.map(item => item.name));
        const newLocalTierList = localTierList.map(tier => tier.filter(item => !selectedItemNames.has(item)));
        setLocalTierList(newLocalTierList);
        setSelectedItems({
            items: [],
            currentlyDraggedItem: null
        });
    };

    const buttonText = areItemsSelected ?
        `DELETE ${selectedItems.items.length} ITEM${selectedItems.items.length !== 1 ? 'S' : ''}` :
        'CLEAR ALL';

    return (
        <GenericButton
            icon={<Trash className={styles.buttonIcon} />}
            text={buttonText}
            isEnabled={(localTierList.length > 0 && localTierList[0].length > 0) || title.length > 0}
            onClick={areItemsSelected ? deleteSelectedItems : clearAll}
            isDeleteButton={true}
        />
    );
}