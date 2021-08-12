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
import { useRecoilValue } from "recoil";
import { EntriesListAtom, TierListAtom } from "../atoms";
import NextTierButton from './Buttons/NextTierButton.react';
import PreviousTierButton from './Buttons/PreviousTierButton.react';
import SkipToRankingButton from './Buttons/SkipToRankingButton.react';
import SelectAllButton from './Buttons/SelectAllButton.react';

import styles from './Tiers.module.css';

export default function Tiers() {
    const entriesList = useRecoilValue(EntriesListAtom);
    const recoilTierList = useRecoilValue(TierListAtom);

    const [tierListState, setTierListState] = useState({
        tierList: recoilTierList,
        currentTier: 0
    });

    const {tierList, currentTier} = tierListState;

    let selectedTermsPriorTiers = [];
    for (let i = 0; i < tierListState.currentTier; ++i) {
        selectedTermsPriorTiers = selectedTermsPriorTiers.concat(tierList[i]);
    }

    const unselectedTerms = entriesList.filter(x => !selectedTermsPriorTiers.includes(x));

    const allTermsSelected = selectedTermsPriorTiers.length + tierList[currentTier].length === entriesList.length;

    const buttonRow =  (
        <div className={styles.buttonContainer}>
        <PreviousTierButton {...{
            tierListState,
            setTierListState
        }}/>
        <SelectAllButton {...{
            unselectedTerms,
            allTermsSelected,
            tierListState,
            setTierListState
        }} />
        <SkipToRankingButton {...{
            unselectedTerms,
            tierListState,
            setTierListState
        }} />
        <NextTierButton {...{
            allTermsSelected,
            tierListState,
            setTierListState
        }}/>
        </div>
    );
    
    return (
        <div className={styles.container}>
            <div className={styles.header}>Which of these belong in Tier {currentTier + 1}?</div>
           {buttonRow}
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
                                // remove term from list
                                const index = tierList[currentTier].indexOf(term);

                                let copy = tierList.slice();
                                copy[currentTier].splice(index, 1);
                                setTierListState({
                                    ...tierListState,
                                    tierList: copy
                                });
                            } else {          
                                // add term to list                  
                                let copy = JSON.parse(JSON.stringify(tierList));

                                copy = copy.map(tier => tier.filter(existingTerm => existingTerm !== term));
                                copy = copy.filter((tier, index) => index === currentTier || tier.length > 0);
                                copy[currentTier].push(term);

                                setTierListState({
                                    currentTier: currentTier,
                                    tierList: copy
                                });
                            }
                        }}
                    >
                        {term}
                    </li>
                )}
            </ul>

            {document.body.scrollHeight > window.innerHeight && <div className={styles.bottomButtonRow}>{buttonRow}</div>}
        </div>
    );
}