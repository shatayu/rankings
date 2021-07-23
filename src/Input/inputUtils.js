export function canEntryBeAddedToEntriesList(entry, entriesList) {
    const spaceLessEntry = entry.replace(' ', '');
    const isEntryUnique = !entriesList.map(term => term.replace(' ', ''))
            .includes(spaceLessEntry);
    
    const decision = spaceLessEntry.length > 0 && isEntryUnique;
    console.log(decision)
    
    return spaceLessEntry.length > 0 && isEntryUnique;
}