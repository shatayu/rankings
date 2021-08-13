import GenericButton from "../../Input/Buttons/GenericButton";
import { ReactComponent as SkipToRankingIcon } from '../../assets/skip_to_ranking.svg';
import styles from '../../Input/Input.module.css'
import { useSetRecoilState } from 'recoil'
import { TierListAtom, PageNumberAtom } from '../../atoms';
import PageNumbers from "../../PageNumbers";

export default function SkipToRankingButton({unselectedTerms, tierListState}) {
    const setFinalTierList = useSetRecoilState(TierListAtom);
    const setPageNumber = useSetRecoilState(PageNumberAtom);

    return (
        <GenericButton
            icon={<SkipToRankingIcon className={styles.buttonIcon} />}
            text={'SKIP TO RANKING'}
            isEnabled={true}
            onClick={() => {
                let tierList = JSON.parse(JSON.stringify(tierListState.tierList));
                if (tierList[tierList.length - 1].length === 0) {
                    tierList.pop();
                }
                tierList.push(unselectedTerms.slice());
                
                setFinalTierList(tierList);
                setPageNumber(PageNumbers.RANKER);
            }}
            isDeleteButton={false}
        />
    );
}