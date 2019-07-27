import { call, takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../../constants/actionTypes';
import cities from '../../constants/cities';

export function* watchAllAndLog() {
    yield takeEvery('*', a => log(a));
}

function* log(action) {
    // choose one of these for variable log verbosity:

    // yield call(logActionType, action);
    yield call(logInterestingStuff, action);
    // yield call(logEntireAction, action);
}

function logEntireAction(action) {
    console.log(action);
}

function logActionType(action) {
    console.log(action.type);
}

const NOT_INTERESTING_ACTION_STARTSWITH = [
    'ANIMATION_'
]

const NOT_INTERESTING_ACTIONS = [
    actionTypes.PLAYER_MOVE_SHOW_CITIES,
    actionTypes.PLAYER_MOVE_INIT,
    actionTypes.CREATE_GAME,
    actionTypes.CREATE_QUICK_GAME_INIT,
    actionTypes.CARD_DRAW_CARDS_INIT,
    actionTypes.CARD_DRAW_CARDS_HANDLE_INIT
]

function isInterestingAction(action) {
    if (NOT_INTERESTING_ACTIONS.includes(action.type)) {
        return false;
    }

    for (const notInterestingAction of NOT_INTERESTING_ACTION_STARTSWITH) {
        if (action.type.startsWith(notInterestingAction)) {
            return false;
        }
    }

    return true;
}

function logInterestingStuff(action) {
    if (isInterestingAction(action)) {
        logEntireAction(action);
    }
}

function logInterestingStuffMehhhhh(action) {
    switch (action.type) {
        case actionTypes.PLAYER_MOVE_TO_CITY:
            console.log(`move to ${cities[action.destinationId]}, source: ${action.source}`);
            break;
        case actionTypes.CARD_DRAW_CARDS_HANDLE:
            if (action.card.cardType === 'city') {
                console.log(`draw card: ${action.card.name}`);
            } else {
                console.log(`draw card: ${action.card.cardType}`);
            }
        // todo: EPIDEMIC_INCREASE not handled
        default:
            break;
    }
}
