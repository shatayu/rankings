import {atom} from 'recoil';

export const TitleAtom = atom({
    key: 'TitleAtom',
    default: ''
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
    default: 2
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
