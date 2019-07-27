import { call, takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../../constants/actionTypes';
import cities from '../../constants/cities';
import { animationEndWatchers } from "./animation_enders";

export function getConsoleActionWatchers() {
    return animationEndWatchers.concat([watchAllForConsole()]);
}

// verbose
function logEntireAction(action) {
    console.log(action);
}

// less verbose
function logActionType(action) {
    console.log(action.type);
}

// man of few words
function logInterestingStuff(action) {
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

function* log(action) {
    yield call(logActionType, action);
}

function* watchAllForConsole() {
    yield takeEvery('*', a => log(a));
}
