import Constants from '../Constants';

export function iterativeMergeSort(arr, comparisonGraph) {
    /*
    super inefficient way but will do for MVP
    if (canCompare(a, b)) then run comparison; otherwise just break and return the last comparison broken on
    show that
    */
    // https://stackoverflow.com/questions/32041092/implementing-merge-sort-iteratively

    /*
     * TODO: Refactor this sort to modern styling and use state variables so that this can
     * be paused and resumed as the user fills comparisons in
     */

    let sorted = arr.slice();
    let n = sorted.length;
    let buffer = new Array(n);

    for (let size = 1; size < n; size *= 2) {
        for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {
            let left = leftStart;
            let right = Math.min(left + size, n);
            let leftLimit = right;
            let rightLimit = Math.min(right + size, n)
            let i = left;

            while (left < leftLimit && right < rightLimit) {
                if (canCompare(sorted[left], sorted[right], comparisonGraph)) {
                    if (isWorseThan(sorted[left], sorted[right], comparisonGraph)) {
                        buffer[i++] = sorted[left++];
                    } else {
                        buffer[i++] = sorted[right++];
                    }
                } else {
                    return {
                        array: sorted,
                        nextQuestion: [sorted[left], sorted[right]]
                    }
                }

            }

            while (left < leftLimit) {
                buffer[i++] = sorted[left++];
            }

            while (right < rightLimit) {
                buffer[i++] = sorted[right++];
            }
        }

        let temp = sorted;
        sorted = buffer;
        buffer = temp;
    }
  
    return {
        array: sorted,
        nextQuestion: null
    };
}

export function canCompare(a, b, comparisonGraph) {
    return comparisonGraph[a][b] !== Constants.NOT_COMPARED;
}

export function isWorseThan(a, b, comparisonGraph) {
    return comparisonGraph[a][b] === Constants.WORSE;
}

export function isBetterThan(a, b, comparisonGraph) {
    return comparisonGraph[a][b] === Constants.BETTER;
}