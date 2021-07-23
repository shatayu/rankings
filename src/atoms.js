import {atomFamily} from 'recoil';

export const InputState = atomFamily(
    {
        key: 'entryMakingTextboxContent',
        default: ''
    }
)

export const EntryState = atomFamily(
    {
        key: 'entriesList',
        default: [1, 2, 3]
    },
    {
        key: 'responsesGraph',
        default: {
            tomato: 'tasty'
        }
    }
);

