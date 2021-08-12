import GenericButton from './GenericButton';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import { EntriesListAtom, EntryInputTextboxAtom, ResponsesGraphAtom, PageNumberAtom, TitleAtom } from '../../atoms';
import { generateEmptyGraph } from '../../utils/graphUtils';
import { canEntryBeAddedToEntriesList, addEntryToEntriesList, useGetDefaultTitle } from '../../utils/inputUtils';
import styles from '../Input.module.css';

export default function StartRankingButton() {
    const [entriesList, setEntriesList] = useRecoilState(EntriesListAtom);
    const [entryInputTextboxContent, setEntryInputTextboxContent] = useRecoilState(EntryInputTextboxAtom);
    const [pageNumber, setPageNumber] = useRecoilState(PageNumberAtom);
    const [title, setTitle] = useRecoilState(TitleAtom);

    const setResponsesGraph = useSetRecoilState(ResponsesGraphAtom);
    const defaultTitle = useGetDefaultTitle();

    return (
        <GenericButton
            icon={<Arrow className={styles.buttonIcon} />}
            text={getCounterString(entriesList)}
            isEnabled={canStartRanking(entryInputTextboxContent, entriesList)}
            onClick={() => {
                if (canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList)) {
                    // TODO: refactor this into using a method from the textbox component
                    addEntryToEntriesList(entryInputTextboxContent, entriesList, setEntriesList);
                    setResponsesGraph(generateEmptyGraph([...entriesList, entryInputTextboxContent]));
                    setEntryInputTextboxContent('');
                } else {
                    setResponsesGraph(generateEmptyGraph(entriesList));
                }

                setPageNumber(pageNumber + 1);

                if (title.length === 0) {
                    setTitle(defaultTitle)
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