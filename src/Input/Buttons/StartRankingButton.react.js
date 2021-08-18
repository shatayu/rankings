import GenericButton from './GenericButton';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import { EntryInputTextboxAtom, ResponsesGraphAtom, PageNumberAtom, TierListAtom } from '../../atoms';
import { generateEmptyGraph } from '../../utils/graphUtils';
import { canEntryBeAddedToEntriesList } from '../../utils/inputUtils';
import styles from '../Input.module.css';
import PageNumbers from '../../PageNumbers';

export default function StartRankingButton({localTierList, setLocalTierList}) {
    const entryInputTextboxContent = useRecoilValue(EntryInputTextboxAtom);
    const setPageNumber = useSetRecoilState(PageNumberAtom);

    const setResponsesGraph = useSetRecoilState(ResponsesGraphAtom);
    const setTierList = useSetRecoilState(TierListAtom);

    const entriesList = localTierList.slice().flat();

    // TODO: add warning that shows up if you try to start ranking
    // with an item in the textbox

    return (
        <GenericButton
            icon={<Arrow className={styles.buttonIcon} />}
            text={getCounterString(entriesList)}
            isEnabled={canStartRanking(entryInputTextboxContent, localTierList)}
            onClick={() => {
                setResponsesGraph(generateEmptyGraph(entriesList));

                setTierList(localTierList);
                setPageNumber(PageNumbers.RANKER);
            }}
            isDeleteButton={false}
        />
    )
}

function getCounterString(entriesList) {
    return entriesList.length < 2 ?
        `CAN'T RANK ${entriesList.length} ITEM${entriesList.length === 0 ? 'S' : ''}` :
        `RANK ${entriesList.length} ITEMS`;
}

function canStartRanking(entry, tierList) {
    const entriesList = tierList.slice().flat();
    return entriesList.length > 1 || (canEntryBeAddedToEntriesList(entry, entriesList) && entriesList.length > 0);
}