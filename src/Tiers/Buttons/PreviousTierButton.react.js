import GenericButton from "../../Input/Buttons/GenericButton";
import { ReactComponent as PreviousIcon } from '../../assets/previous_question_arrow.svg';
import styles from '../../Input/Input.module.css'
import { useSetRecoilState } from "recoil";
import { PageNumberAtom } from "../../atoms";
import PageNumbers from "../../PageNumbers";

export default function PreviousTierButton({tierListState, setTierListState}) {
    console.log(tierListState);
    const setPageNumber = useSetRecoilState(PageNumberAtom);
    return (
        <GenericButton
            icon={<PreviousIcon className={styles.buttonIcon} />}
            text={'PREVIOUS'}
            isEnabled={true}
            onClick={() => {
                const {currentTier} = tierListState;
                if (currentTier === 0) {
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