import { EntriesListAtom } from '../atoms';
import { useRecoilValue } from 'recoil';

export function useGetDefaultTitle() {
    const entriesList = useRecoilValue(EntriesListAtom);
    return entriesList.length === 0 ? `Enter Title` : `My Top ${entriesList.length}`;
}

export function canEntryBeAddedToEntriesList(entry, entriesList) {
    const spaceLessEntry = entry.replaceAll(' ', '');
    const isEntryUnique = !entriesList.map(term => term.replaceAll(' ', ''))
            .includes(spaceLessEntry);

    return spaceLessEntry.length > 0 && isEntryUnique;
}

export function addEntryToEntriesList(entry, entriesList, setEntriesList) {
    // insert at the beginning
    let entriesListCopy = JSON.parse(JSON.serialize(entriesList));

    entriesListCopy.splice(0, 0, entry);
    setEntriesList(entriesListCopy);
}