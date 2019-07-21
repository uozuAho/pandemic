import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';

import * as types from '../../constants/actionTypes';
import {
    animationDealCardsInitComplete,
    animationDealCardsComplete,
    animationInsertEpidemicCardsComplete,
    animationDrawInfectionCardComplete,
    animationMoveComplete
} from '../../actions/globalActions';

function* endDealAnimations() {
    yield put(animationDealCardsInitComplete());
    yield put(animationDealCardsComplete());
    yield put(animationInsertEpidemicCardsComplete());

    while (true) {
        const state = yield select();
        if (state.status === 'prepare') {
            yield put(animationDrawInfectionCardComplete());
        } else {
            break;
        }
    }
}

export function* consoleWatchDealCardsInit() {
    yield* takeEvery(types.DEAL_CARDS_INIT, endDealAnimations);
}

function* endMoveAnimations() {
    yield put(animationMoveComplete());
}

export function* consoleWatchMoveToCity() {
    yield* takeEvery(types.PLAYER_MOVE_TO_CITY, endMoveAnimations);
}
