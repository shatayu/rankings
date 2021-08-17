import { TierListAtom } from '../atoms';
import { useRecoilValue } from 'recoil';

export function useGetDefaultTitle() {
    const tierList = useRecoilValue(TierListAtom);
   return getDefaultTitle(tierList);
}

export function getDefaultTitle(tierList) {
    const entriesList = tierList.slice().flat();
    return entriesList.length === 0 ? `New Title` : `My Top ${entriesList.length}`;
}

export function canEntryBeAddedToEntriesList(entry, entriesList) {
    const spaceLessEntry = entry.replaceAll(' ', '');
    const isEntryUnique = !entriesList.map(term => term.replaceAll(' ', ''))
            .includes(spaceLessEntry);

    return spaceLessEntry.length > 0 && isEntryUnique;
}

export function addEntryToEntriesList(entry, entriesList, setEntriesList) {
    // insert at the beginning
    let entriesListCopy = JSON.parse(JSON.stringify(entriesList));

    entriesListCopy.splice(0, 0, entry);
    setEntriesList(entriesListCopy);
}