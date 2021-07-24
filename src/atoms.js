import {atomFamily} from 'recoil';

export const InputState = atomFamily(
    {
        key: 'entryInputTextboxContent',
        default: ''
    }
)

export const EntryState = atomFamily(
    {
        key: 'entriesList',
        default: ['a', 'b', 'c']
    },
    {
        key: 'responsesGraph',
        default: null
    }
);

export const RankingsState = atomFamily(
    {
        key: 'responsesGraph',
        default: null
    },
    {
        key: 'questionsAsked',
        default: []
    },
)

