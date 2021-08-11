import GenericButton from "../../Input/Buttons/GenericButton";
import {  useSetRecoilState, useRecoilState } from 'recoil';
import { ReactComponent as NextIcon } from '../../assets/next_question_arrow.svg';
import { TierListAtom, PageNumberAtom } from '../../atoms';
import styles from '../../Input/Input.module.css'

export default function NextTierButton({allTermsSelected, tierListState, setTierListState}) {
    const [pageNumber, setPageNumber] = useRecoilState(PageNumberAtom);
    const setFinalTierList = useSetRecoilState(TierListAtom);

    return (
        <GenericButton
            icon={<NextIcon className={styles.buttonIcon} />}
            text={allTermsSelected ? 'FINALIZE' : 'NEXT'}
            isEnabled={true}
            onClick={() => {
                if (allTermsSelected) {
                    // continue
                    setFinalTierList(tierListState.tierList);
                    setPageNumber(pageNumber + 1);
                } else {
                    setTierListState({
                        tierList: [...tierListState.tierList, []],
                        currentTier: tierListState.currentTier + 1
                    });
                }
            }}
            isDeleteButton={false}
        />
    );
}