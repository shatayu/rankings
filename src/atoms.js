import {atom} from 'recoil';
import PageNumbers from './PageNumbers';

export const TitleAtom = atom({
    key: 'TitleAtom',
    default: 'pepe'
})

export const EntryInputTextboxAtom = atom({
    key: 'EntryInputTextboxAtom',
    default: ''
});

export const EntriesListAtom = atom({
    key: 'EntriesListAtom',
    default: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
});

export const ResponsesGraphAtom = atom({
    key: 'ResponsesGraphAtom',
    default: null
});

export const PageNumberAtom = atom({
    key: 'PageNumberAtom',
    default: PageNumbers.TIER_FINALIZER
});

export const TierListAtom = atom({
    key: 'TierListAtom',
    default: [
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h']
    ]
})

export const UserQuestionsAskedAtom = atom({
    key: 'UserQuestionsAsked',
    default: []
});

export const UserSortedRankingsAtom = atom({
    key: 'UserSortedRankings',
    default: []
});
