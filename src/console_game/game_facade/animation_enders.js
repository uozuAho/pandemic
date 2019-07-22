import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';

import * as types from '../../constants/actionTypes';
import {
    animationDealCardsInitComplete,
    animationDealCardsComplete,
    animationInsertEpidemicCardsComplete,
    animationDrawInfectionCardComplete,
    animationMoveComplete,
    animationCardDiscardFromHandComplete
} from '../../actions/globalActions';

export const animationEndWatchers = [
    consoleWatchDealCardsInit(),
    consoleWatchMoveToCity(),
    consoleWatchDiscardInit()
];

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

function* consoleWatchDealCardsInit() {
    yield* takeEvery(types.DEAL_CARDS_INIT, endDealAnimations);
}

function* endMoveAnimations() {
    yield put(animationMoveComplete());
}

function* consoleWatchMoveToCity() {
    yield* takeEvery(types.PLAYER_MOVE_TO_CITY, endMoveAnimations);
}

function* endDiscardAnimation(action) {
    yield put(animationCardDiscardFromHandComplete(action.cardType, action.playerId, action.id));
}

function* consoleWatchDiscardInit() {
    yield* takeEvery(types.CARD_DISCARD_FROM_HAND_INIT, endDiscardAnimation);
}
