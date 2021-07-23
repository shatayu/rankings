import GenericButton from './GenericButton';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import { EntryState, InputState } from '../../atoms';
import { generateEmptyGraph } from '../../utils/graphUtils';
import { canEntryBeAddedToEntriesList } from '../../utils/inputUtils';


export default function StartRankingButton() {
    const [entriesList, setEntriesList] = useRecoilState(EntryState('entriesList'));
    const setResponsesGraph = useSetRecoilState(EntryState('responsesGraph'));
    const [entryInputTextboxContent, setEntryInputTextboxContent] = useRecoilState(InputState('entryInputTextboxContent'));

    return (
        <GenericButton
            icon={<Arrow />}
            isEnabled={canStartRanking(entryInputTextboxContent, entriesList)}
            onClick={() => {
                if (canEntryBeAddedToEntriesList(entryInputTextboxContent, entriesList)) {
                    // TODO: refactor this into using a method from the textbox component
                    setEntriesList([...entriesList, entryInputTextboxContent]);
                    setEntryInputTextboxContent('');

                    setResponsesGraph(generateEmptyGraph(entriesList));
                }
            }}
        />
    )
}

function canStartRanking(entry, entriesList) {
    return entriesList.length > 1 || (canEntryBeAddedToEntriesList(entry, entriesList) && entriesList.length > 0);
}