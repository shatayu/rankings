import axios from 'axios';
import { TitleAtom, SharedLinkAtom, TierListAtom, UserQuestionsAskedAtom, UserSortedRankingsAtom, PageNumberAtom, ResponsesGraphAtom } from '../atoms';
import { useSetRecoilState, useRecoilState } from 'recoil';
import PageNumbers from '../PageNumbers';

export function isSharedLink() {
    return getListID().length > 0;
}

function getListID() {
    const pathname = window.location.pathname;
    return pathname.substr(1, pathname.length - 2);
}

export async function useUpdateListInfoAtoms() {
    /*
    const body = {
        title,
        body: JSON.stringify({
            responsesGraph,
            tierList,
            userQuestionsAsked,
            userSortedRankings,
            pageNumber
        })
    }
    */


    const setTierList = useSetRecoilState(TierListAtom);
    const setTitle = useSetRecoilState(TitleAtom);
    const setUserQuestionsAsked = useSetRecoilState(UserQuestionsAskedAtom);
    const setUserSortedRankings = useSetRecoilState(UserSortedRankingsAtom);
    const setResponsesGraph = useSetRecoilState(ResponsesGraphAtom);
    const setPageNumber = useSetRecoilState(PageNumberAtom);
    const [sharedLinkInfo, setSharedLinkInfo] = useRecoilState(SharedLinkAtom);

    if (isSharedLink() && !sharedLinkInfo.hasLoaded) {
        const listInfo = await getListInfo();
        setTitle(listInfo.title);
        setPageNumber(listInfo.pageNumber);
        if (listInfo.pageNumber === PageNumbers.INPUT) {
            setTierList([listInfo.tierList.slice().flat()]);
        } else {
            setTierList(listInfo.tierList);
            setUserQuestionsAsked(listInfo.userQuestionsAsked);
            setUserSortedRankings(listInfo.userSortedRankings);
            setResponsesGraph(listInfo.responsesGraph);
        }

        setSharedLinkInfo({
            ...sharedLinkInfo,
            hasLoaded: true
        });
    }
}

async function getListInfo() {
    const getURI = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists/' + getListID();
    const result = await axios.get(getURI);

    return {
        ...(result?.data?.Item ?? {})
    };
}