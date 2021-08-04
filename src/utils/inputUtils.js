import { EntriesListAtom } from '../atoms';
import { useRecoilValue } from 'recoil';

export function useGetDefaultTitle() {
    const entriesList = useRecoilValue(EntriesListAtom);
    return entriesList.length === 0 ? `Enter Title` : `My Top ${entriesList.length}`;
}

export function canEntryBeAddedToEntriesList(entry, entriesList) {
    const spaceLessEntry = entry.replace(' ', '');
    const isEntryUnique = !entriesList.map(term => term.replace(' ', ''))
            .includes(spaceLessEntry);
    
    return spaceLessEntry.length > 0 && isEntryUnique;
}

export function addEntryToEntriesList(entry, entriesList, setEntriesList) {
    // insert in correct alphabetical order, ignoring case
    let entriesListCopy = entriesList.slice();

    const index = sortedIndex(entry, entriesListCopy);
    entriesListCopy.splice(index, 0, entry);
    setEntriesList(entriesListCopy);
}

function sortedIndex(value, array) {
    let low = 0;
    let high = array.length;

    while (low < high) {
        const mid = (low + high) >>> 1;
        if (array[mid].toUpperCase() < value.toUpperCase()) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
}