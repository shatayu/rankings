import {atom} from 'recoil';

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

