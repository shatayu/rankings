import GenericButton from '../../Input/Buttons/GenericButton';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { ReactComponent as NewRanking } from '../../assets/new_ranking.svg';
import { UserSortedRankingsAtom, UserQuestionsAskedAtom, ResponsesGraphAtom, PageNumberAtom, EntryInputTextboxAtom, TitleAtom, TierListAtom } from '../../atoms';
import { generateEmptyGraph } from '../../utils/graphUtils.js';
import styles from '../../Input/Input.module.css';
import { useEffect } from 'react';

export default function RedoRankingsButton() {
    const resetUserSortedRankings = useResetRecoilState(UserSortedRankingsAtom);
    const resetUserQuestionsAsked = useResetRecoilState(UserQuestionsAskedAtom);
    const resetResponsesGraph = useResetRecoilState(ResponsesGraphAtom);
    const resetPageNumber = useResetRecoilState(PageNumberAtom);
    const resetEntryInputTextboxAtom = useResetRecoilState(EntryInputTextboxAtom);
    const resetTitleAtom = useResetRecoilState(TitleAtom);
    const resetTierList = useResetRecoilState(TierListAtom);

    const userSortedRankings = useRecoilValue(UserSortedRankingsAtom);
    const userQuestionsAsked = useRecoilValue(UserQuestionsAskedAtom);
    const responsesGraph = useRecoilValue(ResponsesGraphAtom);
    const tierList = useRecoilValue(TierListAtom);
    const entryInputTextboxContents = useRecoilValue(EntryInputTextboxAtom);
    const title = useRecoilValue(TitleAtom);

    const emptyGraph = generateEmptyGraph(tierList.slice().flat());

    useEffect(() => {
        if (
            userSortedRankings.length === 0 &&
            userQuestionsAsked.length === 0 &&
            responsesGraph == null &&
            entryInputTextboxContents.length === 0 &&
            title.length === 0 &&
            tierList.length === 1 &&
            tierList[0].length === 0
        ) {
            resetPageNumber();
        }
    }, [emptyGraph, responsesGraph, resetPageNumber, userQuestionsAsked.length, userSortedRankings.length, entryInputTextboxContents.length, title.length, tierList]);

    return (
        <GenericButton
            icon={<NewRanking className={styles.buttonIcon} />}
            text='NEW RANKING'
            isEnabled={true}
            onClick={() => {
                resetUserSortedRankings();
                resetUserQuestionsAsked();
                resetResponsesGraph();
                resetEntryInputTextboxAtom();
                resetTitleAtom();
                resetTierList();
            }}
            isDeleteButton={false}
        />
    )
}