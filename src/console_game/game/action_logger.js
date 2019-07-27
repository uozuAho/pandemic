import { call, takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../../constants/actionTypes';
import cities from '../../constants/cities';

export function* watchAllAndLog() {
    yield takeEvery('*', a => log(a));
}

function* log(action) {
    // choose one of these for variable log verbosity:

    // yield call(logInterestingStuff, action);
    // yield call(logActionType, action);
    yield call(logEntireAction, action);
}

function logEntireAction(action) {
    console.log(action);
}

function logActionType(action) {
    console.log(action.type);
}

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
