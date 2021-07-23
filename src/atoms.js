import {atomFamily} from 'recoil';

export const userState = atomFamily(
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