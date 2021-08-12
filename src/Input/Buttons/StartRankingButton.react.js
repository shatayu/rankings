import GenericButton from './GenericButton';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import { EntriesListAtom, EntryInputTextboxAtom, ResponsesGraphAtom, PageNumberAtom, TitleAtom, TierListAtom } from '../../atoms';
import { generateEmptyGraph } from '../../utils/graphUtils';
import { canEntryBeAddedToEntriesList, addEntryToEntriesList, useGetDefaultTitle } from '../../utils/inputUtils';
import styles from '../Input.module.css';
import PageNumbers from '../../PageNumbers';
import Constants from '../../Constants';

export default function StartRankingButton() {
    const [entriesList, setEntriesList] = useRecoilState(EntriesListAtom);
    const [entryInputTextboxContent, setEntryInputTextboxContent] = useRecoilState(EntryInputTextboxAtom);
    const [pageNumber, setPageNumber] = useRecoilState(PageNumberAtom);
    const [title, setTitle] = useRecoilState(TitleAtom);

    const setResponsesGraph = useSetRecoilState(ResponsesGraphAtom);
    const setTierList = useSetRecoilState(TierListAtom);
    const defaultTitle = useGetDefaultTitle();

    return (
        <GenericButton
            icon={<Arrow className={styles.buttonIcon} />}
            text={getCounterString(entriesList)}
            isEnabled={canStartRanking(entryInputTextboxContent, entriesList)}
            onClick={() => {
                const canAddEntryToEntriesList = canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList);
                const newEntriesList = canAddEntryToEntriesList ? [...entriesList, entryInputTextboxContent] : entriesList;
                if (canAddEntryToEntriesList) {
                    // TODO: refactor this into using a method from the textbox component
                    addEntryToEntriesList(entryInputTextboxContent, entriesList, setEntriesList);
                    setResponsesGraph(generateEmptyGraph(newEntriesList));
                    setEntryInputTextboxContent('');
                } else {
                    setResponsesGraph(generateEmptyGraph(newEntriesList));
                }

                if (title.length === 0) {
                    setTitle(defaultTitle)
                }

                const newEntryListLength = entriesList.length + (canAddEntryToEntriesList ? 1 : 0);
                if (newEntryListLength < Constants.SKIP_TO_RANKING_THRESHOLD) {
                    // fill in tiers automatically and go to ranker directly
                    setTierList([newEntriesList]);
                    setPageNumber(PageNumbers.RANKER);
                } else {
                    setPageNumber(pageNumber + 1);
                }
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

function canStartRanking(entry, entriesList) {
    return entriesList.length > 1 || (canEntryBeAddedToEntriesList(entry, entriesList) && entriesList.length > 0);
}