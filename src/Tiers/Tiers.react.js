/*
 * List every entry alphabetically with prompt "Which of these belong in Tier #1?"
 * Below prompt give option to "Skip and Start Ranking"
 * User taps the items that belong in Tier #1
 * 
 * Prompt "Which of these belong in Tier #2"
 * Below prompt gives option to "Put everyone in Tier #2 and start ranking"
 * 
 * ...
 * 
 * At the end the user is shown each tier they've selected with the items in each tier
 * They can drag and drop items around
 */

import { useState } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { EntriesListAtom, TierListAtom, PageNumberAtom } from "../atoms";

import styles from './Tiers.module.css';

export default function Tiers() {
    const entriesList = useRecoilValue(EntriesListAtom);
    const [pageNumber, setPageNumber] = useRecoilState(PageNumberAtom);

    const setFinalTierList = useSetRecoilState(TierListAtom);

    const [tierListState, setTierListState] = useState({
        tierList: [[]],
        currentTier: 0
    });

    const {tierList, currentTier} = tierListState;

    let selectedTermsPriorTiers = [];
    for (let i = 0; i < tierListState.currentTier; ++i) {
        selectedTermsPriorTiers = selectedTermsPriorTiers.concat(tierList[i]);
    }

    const unselectedTerms = entriesList.filter(x => !selectedTermsPriorTiers.includes(x));

    const allTermsSelected = [].concat.apply([], tierList).length === entriesList.length;

    return (
        <div className={styles.container}>
            <div className={styles.header}>Which of these belong in Tier {currentTier + 1}?</div>
            <div className={styles.skip} onClick={() => {
                // start ranking
            }}>{currentTier === 0 ? "All of these, let's rank!" : `Put everything in Tier ${currentTier + 1} and start ranking!`}</div>

            <ul className={styles.unselectedTermsList}>
                {unselectedTerms.map(term =>
                    <li
                        key={term}
                        value={term}
                        className={styles.term + ' ' +
                            (tierList[currentTier].includes(term) ? styles.selectedTerm : styles.unselectedTerm)
                        }
                        onClick={(e) => {
                            const term = e.target.textContent;

                            if (tierList[currentTier].includes(term)) {
                                const index = tierList[currentTier].indexOf(term);

                                let copy = tierList.slice();
                                copy[currentTier].splice(index, 1);
                                setTierListState({
                                    ...tierListState,
                                    tierList: copy
                                });
                            } else {                            
                                let copy = tierList.slice();
                                copy[currentTier].push(term);
                                setTierListState({
                                    ...tierListState,
                                    tierList: copy
                                });
                            }
                        }}
                    >
                        {term}
                    </li>
                )}
            </ul>
            <div
                className={styles.continue}
                onClick={() => {
                    if (allTermsSelected) {
                        // start ranking
                        setFinalTierList(tierListState.tierList);
                        setPageNumber(pageNumber + 1);
                    } else {
                        setTierListState({
                            tierList: [...tierListState.tierList, []],
                            currentTier: currentTier + 1
                        });
                    }
                }}
            >
                {allTermsSelected ? 'Finalize tiers' : 'Pick Next Tier'}
            </div>
        </div>
    );
}