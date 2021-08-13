import GenericButton from "../../Input/Buttons/GenericButton";
import { useSetRecoilState, useRecoilState } from 'recoil';
import { ReactComponent as NextIcon } from '../../assets/next_question_arrow.svg';
import { TierListAtom, PageNumberAtom } from '../../atoms';
import styles from '../../Input/Input.module.css'

export default function NextTierButton({allTermsSelected, tierListState, setTierListState}) {
    const [pageNumber, setPageNumber] = useRecoilState(PageNumberAtom);
    const setFinalTierList = useSetRecoilState(TierListAtom);

    const {tierList, currentTier} = tierListState;

    const onLatestTier = currentTier === tierList.length - 1;

    return (
        <GenericButton
            icon={<NextIcon className={styles.buttonIcon} />}
            text={allTermsSelected && onLatestTier ? 'FINALIZE' : 'NEXT'}
            isEnabled={tierList[currentTier].length > 0}
            onClick={() => {
                if (onLatestTier && allTermsSelected) {
                    // continue
                    setFinalTierList(tierListState.tierList);
                    setPageNumber(pageNumber + 1);
                } else {
                    window.scrollTo(0, 0);
                    if (onLatestTier) {
                        let newTierList = tierListState.tierList;
                        if (newTierList[tierListState.currentTier + 1] == null) {
                            newTierList.push([]);
                        }
    
                        setTierListState({
                            tierList: newTierList,
                            currentTier: tierListState.currentTier + 1
                        });
                    } else {
                        setTierListState({
                            tierList: tierListState.tierList,
                            currentTier: tierListState.currentTier + 1
                        });
                    }
                }
            }}
            isDeleteButton={false}
        />
    );
}