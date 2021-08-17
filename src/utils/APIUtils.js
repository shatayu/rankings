import axios from 'axios';
import { TitleAtom, SharedLinkAtom, TierListAtom } from '../atoms';
import { useSetRecoilState, useRecoilState } from 'recoil';

export function isSharedLink() {
    return getListID().length > 0;
}

function getListID() {
    const pathname = window.location.pathname;
    return pathname.substr(1, pathname.length - 2);
}

export async function useUpdateListInfoAtoms() {
    const setTierList = useSetRecoilState(TierListAtom);
    const setTitle = useSetRecoilState(TitleAtom);
    const [sharedLinkInfo, setSharedLinkInfo] = useRecoilState(SharedLinkAtom);

    if (isSharedLink() && !sharedLinkInfo.hasLoaded) {
        const listInfo = await getListInfo();
        setTierList([listInfo.list]);
        setTitle(listInfo.title);
        setSharedLinkInfo({
            ...sharedLinkInfo,
            hasLoaded: true
        })
    }
}

async function getListInfo() {
    const getURI = 'https://3ocshrauf1.execute-api.us-west-1.amazonaws.com/lists/' + getListID();
    const result = await axios.get(getURI);
    const list = result.data?.Item?.list ?? [];
    const title = result.data?.Item?.title;

    return {
        list,
        title
    };
}