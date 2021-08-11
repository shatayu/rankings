import GenericButton from '../../Input/Buttons/GenericButton';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { ReactComponent as Redo } from '../../assets/redo.svg';
import { UserSortedRankingsAtom, UserQuestionsAskedAtom, ResponsesGraphAtom, EntriesListAtom, PageNumberAtom } from '../../atoms';
import { generateEmptyGraph } from '../../utils/graphUtils.js';
import styles from '../../Input/Input.module.css';
import { useEffect } from 'react';
import PageNumbers from '../../PageNumbers';


export default function RedoRankingsButton() {
    const entriesList = useRecoilValue(EntriesListAtom);

    const resetUserSortedRankings = useResetRecoilState(UserSortedRankingsAtom);
    const resetUserQuestionsAsked = useResetRecoilState(UserQuestionsAskedAtom);
    const setResponsesGraph = useSetRecoilState(ResponsesGraphAtom);
    const setPageNumber = useSetRecoilState(PageNumberAtom);

    const userSortedRankings = useRecoilValue(UserSortedRankingsAtom);
    const userQuestionsAsked = useRecoilValue(UserQuestionsAskedAtom);
    const responsesGraph = useRecoilValue(ResponsesGraphAtom);

    const emptyGraph = generateEmptyGraph(entriesList);

    useEffect(() => {
        if (
            userSortedRankings.length === 0 &&
            userQuestionsAsked.length === 0 &&
            JSON.stringify(responsesGraph) === JSON.stringify(emptyGraph)
        ) {
            setPageNumber(PageNumbers.TIER_FINALIZER);
        }
    }, [emptyGraph, responsesGraph, setPageNumber, userQuestionsAsked.length, userSortedRankings.length])

    return (
        <GenericButton
            icon={<Redo className={styles.buttonIcon} />}
            text='REDO'
            isEnabled={true}
            onClick={() => {
                resetUserSortedRankings();
                resetUserQuestionsAsked();
                setResponsesGraph(emptyGraph);
            }}
            isDeleteButton={false}
        />
    )
}