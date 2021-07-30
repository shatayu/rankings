import GenericButton from './GenericButton';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import { EntriesListAtom, EntryInputTextboxAtom, ResponsesGraphAtom, PageNumberAtom } from '../../atoms';
import { generateEmptyGraph } from '../../utils/graphUtils';
import { canEntryBeAddedToEntriesList } from '../../utils/inputUtils';
import PageNumber from '../../PageNumbers';


export default function StartRankingButton() {
    const [entriesList, setEntriesList] = useRecoilState(EntriesListAtom);
    const [entryInputTextboxContent, setEntryInputTextboxContent] = useRecoilState(EntryInputTextboxAtom);
    const setResponsesGraph = useSetRecoilState(ResponsesGraphAtom);
    const setPageNumber = useSetRecoilState(PageNumberAtom);
    const numEntries = entriesList.length;

    return (
        <GenericButton
            icon={<Arrow />}
            text={entriesList.length < 2 ? `CAN'T RANK ${numEntries} ITEM${numEntries === 0 ? 'S' : ''}` : `RANK ${numEntries} ITEMS`}
            isEnabled={canStartRanking(entryInputTextboxContent, entriesList)}
            onClick={() => {
                if (canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList)) {
                    // TODO: refactor this into using a method from the textbox component
                    setEntriesList([...entriesList, entryInputTextboxContent]);
                    setEntryInputTextboxContent('');
                }

                setResponsesGraph(generateEmptyGraph(entriesList));
                setPageNumber(PageNumber.RANKER);
            }}
        />
    )
}

function canStartRanking(entry, entriesList) {
    return entriesList.length > 1 || (canEntryBeAddedToEntriesList(entry, entriesList) && entriesList.length > 0);
}