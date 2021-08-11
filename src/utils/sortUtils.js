import Constants from '../Constants';

export function getNextQuestion(tierList, comparisonGraph) {
    // go through each tier and try to find an unanswered question
    // also build a fully sorted result in case everything is sorted
    let fullySortedArray = [];
    for (let i = 0; i < tierList.length; ++i) {
        const newResult = iterativeMergeSort(tierList[i], comparisonGraph);
        if (newResult.nextQuestion != null) {
            return newResult;
        } else {
            fullySortedArray = fullySortedArray.concat(newResult.array);
        }
    }

    return {
        nextQuestion: null,
        array: fullySortedArray
    };
}

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
                    if (isBetterThan(sorted[left], sorted[right], comparisonGraph)) {
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
    return comparisonGraph[a][b] === Constants.WORSE || comparisonGraph[a][b] === Constants.WORSE_BY_TIER;
}

export function isBetterThan(a, b, comparisonGraph) {
    return comparisonGraph[a][b] === Constants.BETTER || comparisonGraph[a][b] === Constants.BETTER_BY_TIER;
}