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

export function getPathString(selections, results, responsesGraph, tierList, questionsAsked) {
    selections.sort((a, b) => results.indexOf(a) - results.indexOf(b));

    // handle different tier case
    const upperSelectionTier = getTier(selections[0], tierList);
    const lowerSelectionTier = getTier(selections[1], tierList);
    if (upperSelectionTier !== lowerSelectionTier) {
        const pathString = `${selections[0]} is in Tier ${upperSelectionTier + 1} and ${selections[1]} is in Tier ${lowerSelectionTier + 1}`;
        const pathEntry = <div key={pathString}>{pathString}</div>;
        return [pathEntry];
    }

    const path = shortestPath(responsesGraph, selections[0], selections[1]);

    if (path.length > 1) {
        let pathArray = []
        for (let i = 0; i < path.length - 1; ++i) {
            const current = path[i];
            const next = path[i + 1];

            const questionNumber = getQuestionNumber(questionsAsked, current, next);
        
            const pathString = ('(Q' + String(questionNumber) + ') You said ' + current + ' is better than ' + next);

            const pathEntry = <div key={pathString}>{pathString}</div>
            pathArray.push(pathEntry);
        }

        return pathArray;
    } else {
        return [];
    }
}

function getTier(term, tierList) {
    let result = -1;
    tierList.forEach((tier, index) => {
        if (tier.includes(term)) {
            result = index;
        }
    });

    return result;
}

export function getQuestionNumber(questionsAsked, a, b) {
    let questionIndex = -1;
    questionsAsked.forEach((question, index) => {
        if (
            (question[0] === a && question[1] === b) ||
            (question[0] === b && question[1] === a)
        ) {
            questionIndex = index;
        }
    });

    if (questionIndex === -1) {
        return -1;
    }

    return questionIndex + 1;
}

