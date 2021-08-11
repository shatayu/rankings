import { PageNumberAtom, TitleAtom } from '../atoms';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { getNextQuestion } from '../utils/sortUtils';
import Constants from '../Constants';
import PageNumbers from '../PageNumbers';
import styles from './Ranker.module.css';
import { ReactComponent as PreviousQuestionArrow } from '../assets/previous_question_arrow.svg';
import { ReactComponent as NextQuestionArrow } from '../assets/next_question_arrow.svg';
import { getQuestionNumber } from '../utils/graphUtils';
import { useGetDefaultTitle } from '../utils/inputUtils';

export default function ProgressIndicator({
    questionNumber,
    setQuestionNumber,
    setCurrentQuestion,
    userQuestionsAsked,
    setUserQuestionsAsked,
    responsesGraph,
    setResponsesGraph,
    onForwardClick,
    tierList,
    currentTier,
    n,
    doneRanking
}) {
    const setPageNumber = useSetRecoilState(PageNumberAtom);
    const [title, setTitle] = useRecoilState(TitleAtom);
    const defaultTitle = useGetDefaultTitle();

    if (doneRanking) {
        return null;
    }
    
    // https://stackoverflow.com/questions/12346054/number-of-comparisons-in-merge-sort
    // const log = Math.ceil(Math.log2(n));
    // const maxNumberOfQuestions = n * log - 2 ** log + 1;

    const maxNumberOfQuestions = tierList.reduce((numberOfQuestions, tier) => {
        const n = tier.length;
        const log = Math.ceil(Math.log2(n));
        return numberOfQuestions + n * log - 2 ** log + 1;
    }, 0);
    
    const arrowProps = {
        width: 18,
        height: 18,
        margintop: 10
    }
    let {nextQuestion} = getNextQuestion(tierList, responsesGraph);
    const nextQuestionNumber = nextQuestion != null ? getQuestionNumber(userQuestionsAsked, nextQuestion[0], nextQuestion[1]) : -1;
    const shouldForwardBeEnabled = nextQuestion != null && nextQuestionNumber !== -1;
    
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <PreviousQuestionArrow {...arrowProps} color={'#BBBBBB'} onClick={() => {
                if (questionNumber > 1) {
                    const previousQuestion = userQuestionsAsked[questionNumber - 2];
                    const a = previousQuestion[0];
                    const b = previousQuestion[1];
                    setResponsesGraph({
                        ...responsesGraph,
                        [`${a}`]: {
                            ...responsesGraph[`${a}`],
                            [`${b}`]: Constants.NOT_COMPARED
                        },
                        [`${b}`]: {
                            ...responsesGraph[`${b}`],
                            [`${a}`]: Constants.NOT_COMPARED
                        }
                    });
                    setCurrentQuestion(previousQuestion);
                    setQuestionNumber(questionNumber - 1);
                } else {
                    if (title === defaultTitle) {
                        setTitle('');
                    }
                    setPageNumber(PageNumbers.INPUT);
                }
            }}/>
            <span className={styles.progressIndicator}>{questionNumber} out of up to {maxNumberOfQuestions}</span>
            <NextQuestionArrow {...arrowProps} color={shouldForwardBeEnabled? '#BBBBBB' : '#444444'} onClick={() => {
                // if the next question is nonnull and has been asked before then select the previously selected answer and move to next
                if (shouldForwardBeEnabled) {
                    const [better, worse] = userQuestionsAsked[nextQuestionNumber - 1];
                    onForwardClick(better, worse);
                }
            }}/>
        </div>
    );
}