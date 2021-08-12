import GenericButton from "../../Input/Buttons/GenericButton";
import { ReactComponent as PreviousIcon } from '../../assets/previous_question_arrow.svg';
import styles from '../../Input/Input.module.css'
import { useSetRecoilState, useRecoilState } from "recoil";
import { PageNumberAtom, TitleAtom } from "../../atoms";
import PageNumbers from "../../PageNumbers";
import { useGetDefaultTitle } from '../../utils/inputUtils';


export default function PreviousTierButton({tierListState, setTierListState}) {
    const [title, setTitle] = useRecoilState(TitleAtom);
    const defaultTitle = useGetDefaultTitle();

    const setPageNumber = useSetRecoilState(PageNumberAtom);
    return (
        <GenericButton
            icon={<PreviousIcon className={styles.buttonIcon} />}
            text={'PREVIOUS'}
            isEnabled={true}
            onClick={() => {
                const {currentTier} = tierListState;
                if (currentTier === 0) {
                    // clear title
                    if (title === defaultTitle) {
                        setTitle('');
                    }

                    // go back to input page
                    setPageNumber(PageNumbers.INPUT);
                } else {
                    // go back one tier
                    setTierListState({
                        ...tierListState,
                        currentTier: currentTier - 1
                    });
                }
            }}
            isDeleteButton={false}
        />
    );
}