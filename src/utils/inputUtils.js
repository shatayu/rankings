export function canEntryBeAddedToEntriesList(entry, entriesList) {
    console.log(entriesList);
    const spaceLessEntry = entry.replace(' ', '');
    const isEntryUnique = !entriesList.map(term => term.replace(' ', ''))
            .includes(spaceLessEntry);
    
    return spaceLessEntry.length > 0 && isEntryUnique;
}