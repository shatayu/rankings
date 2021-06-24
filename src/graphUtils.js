import Constants from './Constants';

export function computeTransitiveClosure(graph, list) {
    let closure = generateEmptyGraph(list);

    for (const i in graph) {
        for (const j in graph) {
            closure[i][j] = graph[i][j];
        }
    }

    for (const k in graph) {
        for (const i in graph) {
            for (const j in graph) {
                closure[i][j] = (closure[i][j] === Constants.BETTER) || (closure[i][k] === Constants.BETTER && closure[k][j] === Constants.BETTER) ? Constants.BETTER : graph[i][j];
            }
        }
    }

    return closure;
}

export function generateEmptyGraph(names) {
    let temp = {}
    names.forEach(p1 => {
        temp[p1] = {};

        names.forEach(p2 => {
            temp[p1][p2] = Constants.NOT_COMPARED;
        })
    })

    return temp;
}

