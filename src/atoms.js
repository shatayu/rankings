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
    default: []
});

export const ResponsesGraphAtom = atom({
    key: 'ResponsesGraphAtom',
    default: null
});

export const PageNumberAtom = atom({
    key: 'PageNumberAtom',
    default: 0
});

export const UserQuestionsAskedAtom = atom({
    key: 'UserQuestionsAsked',
    default: []
});

export const UserSortedRankingsAtom = atom({
    key: 'UserSortedRankings',
    default: []
});
