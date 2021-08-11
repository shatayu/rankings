import GenericButton from "../../Input/Buttons/GenericButton";
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import styles from '../../Input/Input.module.css'
import { useSetRecoilState, useRecoilState } from 'recoil'
import { TierListAtom, ResponsesGraphAtom, PageNumberAtom } from '../../atoms';
import PageNumbers from "../../PageNumbers";
import Constants from '../../Constants';

export default function StartRankingButton({localTierList}) {
    const setFinalTierList = useSetRecoilState(TierListAtom);
    const setPageNumber = useSetRecoilState(PageNumberAtom);
    const [responsesGraph, setResponsesGraph] = useRecoilState(ResponsesGraphAtom);

    return (
        <GenericButton
            icon={<Arrow className={styles.buttonIcon} />}
            text={'START RANKING'}
            isEnabled={true}
            onClick={() => {
                setFinalTierList(localTierList);

                const responsesGraphCopy = JSON.parse(JSON.stringify(responsesGraph));

                // everything in tier i is better than everything in tier i + 1... i + n
                for (let i = 0; i < localTierList.length; ++i) {
                    for (let j = 0; j < localTierList[i].length; ++j) {
                        const better = localTierList[i][j];

                        for (let k = i + 1; k < localTierList.length; ++k) {
                            for (let l = 0; l < localTierList[k].length; ++l) {
                                const worse = localTierList[k][l];

                                responsesGraphCopy[better][worse] = Constants.BETTER_BY_TIER;
                                responsesGraphCopy[worse][better] = Constants.WORSE_BY_TIER;
                            }
                        }
                    }
                }

                setResponsesGraph(responsesGraphCopy);                    
                setPageNumber(PageNumbers.RANKER);
            }}
            isDeleteButton={false}
        />
    );
}