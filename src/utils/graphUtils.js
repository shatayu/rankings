import Constants from '../Constants';
import {isBetterThan} from './sortUtils';

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

export function generateEmptyGraph(entries) {
    let temp = {}
    entries.forEach(p1 => {
        temp[p1] = {};

        entries.forEach(p2 => {
            temp[p1][p2] = Constants.NOT_COMPARED;
        })
    })

    return temp;
}

export function shortestPath(graph, source, target) {
    let visited = {};
    for (const team in graph) {
        visited[team] = false;
    }
    visited[source] = true;

    let parent = {
        source: null
    };

    let queue = [source];
    
    // generate shortest path from source to everywhere else
    while (queue.length > 0) {
        const current = queue.shift();

        // gather children
        let teamsCurrentIsBetterThan = [];
        for (const team in graph[current]) {
            if (!visited[team] && isBetterThan(current, team, graph)) {
                teamsCurrentIsBetterThan.push(team);
            }
        }

        teamsCurrentIsBetterThan.forEach(team => {
            parent[team] = current;
            visited[team] = true;
            queue.push(team);
        })
    }

    // find path from source to target
    let path = [];
    let current = target;

    while (current != null) {
        path.push(current);
        current = parent[current];
    }
    path.reverse();

    return path;
}

