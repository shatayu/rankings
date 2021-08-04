import axios from 'axios';
import { EntriesListAtom, TitleAtom } from '../atoms';
import { useSetRecoilState } from 'recoil';

export function isSharedLink() {
    return getListID().length > 0;
}

function getListID() {
    const pathname = window.location.pathname;
    return pathname.substr(1, pathname.length - 2);
}

export async function useUpdateListInfoAtoms() {
    const setEntriesList = useSetRecoilState(EntriesListAtom);
    const setTitle = useSetRecoilState(TitleAtom);

    if (isSharedLink()) {
        const listInfo = await getListInfo();
        setEntriesList(listInfo.list);
        setTitle(listInfo.title);
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