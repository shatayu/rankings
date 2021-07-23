export function canEntryBeAddedToEntriesList(entry, entriesList) {
    console.log('entry');
    console.log(entry);
    console.log('entriesList');
    console.log(entriesList)
    const spaceLessEntry = entry.replace(' ', '')
    const doesEntryExist = !entriesList.map(term => term.replace(' ', ''))
            .includes(spaceLessEntry);
    
    return spaceLessEntry.length > 0 && !doesEntryExist;
}