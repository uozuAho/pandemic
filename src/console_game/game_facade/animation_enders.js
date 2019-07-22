import { select, put, takeEvery } from 'redux-saga/effects';

import * as types from '../../constants/actionTypes';
import {
    animationDealCardsInitComplete,
    animationDealCardsComplete,
    animationInsertEpidemicCardsComplete,
    animationDrawInfectionCardComplete,
    animationMoveComplete,
    animationCardDiscardFromHandComplete,
    animationDrawCardsInitComplete,
    animationInfectNeighborComplete,
    animationCureDiseaseComplete
} from '../../actions/globalActions';
import { drawCardsHandle } from '../../actions/cardActions';
import { getCurrentPlayer } from '../../selectors';

export const animationEndWatchers = [
    watchDealCardsInit(),
    watchMoveToCity(),
    watchDiscardInit(),
    watchDrawCardsInit(),
    watchInfectNeighbour(),
    watchCureDisease(),
    watchDrawCardsHandleInit(),
    watchInfectCity()
];

function* endDealAnimations() {
    yield put(animationDealCardsInitComplete());
    yield put(animationDealCardsComplete());

    // could be 'smarter' by checking state, but this is less code :)
    for (let i = 0; i < 100; i++) {
        const state = yield select();
        if (state.status === 'prepare') {
            yield put(animationInsertEpidemicCardsComplete());
            yield put(animationDrawInfectionCardComplete());
        } else {
            break;
        }
    }
}

function* watchDealCardsInit() {
    yield takeEvery(types.DEAL_CARDS_INIT, endDealAnimations);
}

function* endMoveAnimations() {
    yield put(animationMoveComplete());
}

function* watchMoveToCity() {
    yield takeEvery(types.PLAYER_MOVE_TO_CITY, endMoveAnimations);
}

function* endDiscardAnimation(action) {
    yield put(animationCardDiscardFromHandComplete(action.cardType, action.playerId, action.id));
}

function* watchDiscardInit() {
    yield takeEvery(types.CARD_DISCARD_FROM_HAND_INIT, endDiscardAnimation);
}

function* endDrawCardsInitAnimation() {
    yield put(animationDrawCardsInitComplete());
}

function* watchDrawCardsInit() {
    yield takeEvery(types.CARD_DRAW_CARDS_INIT, endDrawCardsInitAnimation);
}

function* endInfectNeighbourAnimation(action) {
    yield put(animationInfectNeighborComplete(action.cityId, action.originId, action.color));
}

function* watchInfectNeighbour() {
    yield takeEvery(types.INFECT_NEIGHBOR, endInfectNeighbourAnimation);
}

function* endCureDiseaseAnimation() {
    yield put(animationCureDiseaseComplete());
}

function* watchCureDisease() {
    yield takeEvery(types.PLAYER_CURE_DISEASE_COMPLETE, endCureDiseaseAnimation);
}

function* handleDrawCardsInit(action) {
    // not ending an animation, but this action is dispatched from a react component, tsk tsk
    const currentPlayer = yield select(getCurrentPlayer);
    yield put(drawCardsHandle(action.card, currentPlayer.id));
}

function* watchDrawCardsHandleInit() {
    yield takeEvery(types.CARD_DRAW_CARDS_HANDLE_INIT, handleDrawCardsInit);
}

function* handleInfectCity() {
    // not ending an animation, but this action is dispatched from a react component, tsk tsk
    yield put(animationDrawInfectionCardComplete());
}

function* watchInfectCity() {
    yield takeEvery(types.INFECT_CITY, handleInfectCity);
}
