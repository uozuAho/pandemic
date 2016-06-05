import { takeEvery, delay } from 'redux-saga';
import { select, put } from 'redux-saga/effects';

import * as types from './constants/actionTypes';
import { moveShowCities } from './actions/mapActions';
import { discardFromHand, addToPlayerDiscard, drawCardsInit, drawCardsHandle, epidemicIncrease,
  epidemicInfect, epidemicIntensify, discardBottomInfectionCard, discardTopInfectionCard } from './actions/cardActions';
import { eradicateDisease, infectCity, infectNeighbor, initOutbreak, completeOutbreak,
  queueOutbreak, infectCities } from './actions/diseaseActions';
import { victory, defeat, passTurn } from './actions/globalActions';
import * as sel from './selectors';


function* showAvailableCities() {
  const cities = yield select(sel.getAvailableCities);
  yield put(moveShowCities(cities));
}

function* discardCard(playerId, cityId) {
  yield put(discardFromHand('city', playerId, cityId));
  yield put(addToPlayerDiscard('city', cityId));
}

function* processMoveToCity(action) {
  const currentPlayer = yield select(sel.getCurrentPlayer);
  switch (action.source) {
    case 'direct':
      yield discardCard(currentPlayer.id, action.destinationId);
      break;
    case 'charter':
      yield discardCard(currentPlayer.id, action.originId);
      break;
  }
}

function* checkForEradication({ color }) {
  const treatedAll = yield select(sel.treatedAllOfColor, color);
  const status = yield select(sel.getDiseaseStatus, color);
  if (treatedAll && status === 'cured') {
    yield put(eradicateDisease(color));
  }
}

function* checkForVictory() {
  const allCured = yield select(sel.areAllDiseasesCured);

  if (allCured) {
    yield put(victory());
  }
}

function* yieldOutbreak(cityId, color) {
  yield put(initOutbreak(cityId, color));
  const neighbors = yield select(sel.getNeighborCities, cityId);

  for (let i = 0; i < neighbors.length; i++) {
    const id = neighbors[i].id;
    const cubesInNeighbor = yield select(sel.getCubesInCity, id, color);
    yield put(infectNeighbor(id, cityId, color));
    if (cubesInNeighbor === 3) {
      yield put(queueOutbreak(id, color));
    }
  }
  yield put(completeOutbreak(cityId));
  const nextOutbreakCityId = yield select(sel.getNextOutbreakCityId);
  if (nextOutbreakCityId) {
    yield yieldOutbreak(nextOutbreakCityId, color);
  }
}

function* infectOrOutbreak(cityId, color, count) {
  const cubesInCity = yield select(sel.getCubesInCity, cityId, color);
  yield put(infectCity(cityId, color, count));
  if (cubesInCity > 0) {
    yield yieldOutbreak(cityId, color);
  }
}

function* yieldEpidemic() {
  yield put(epidemicIncrease());
  const infectionCityId = yield select(sel.getInfectionDeckBottom);
  const color = yield select(sel.getCityColor, infectionCityId);
  const status = yield select(sel.getDiseaseStatus, color);
  if (status !== 'eradicated') {
    yield put(epidemicInfect(infectionCityId));
    yield infectOrOutbreak(infectionCityId, color, 3);
    yield put(discardBottomInfectionCard());
  }
  yield put(epidemicIntensify());
}

function* drawPlayerCards() {
  const cards = yield select(sel.getPlayerCardsToDraw);
  if (cards.length < 2) {
    yield put(defeat());
  } else {
    const currentPlayer = yield select(sel.getCurrentPlayer);
    yield put(drawCardsInit(cards));
    yield delay(1000);
    yield put(drawCardsHandle(cards[0], currentPlayer.id));
    if (cards[0].cardType === 'epidemic') {
      yield yieldEpidemic();
    }
    yield delay(1000);
    yield put(drawCardsHandle(cards[1], currentPlayer.id));
    if (cards[1].cardType === 'epidemic') {
      yield yieldEpidemic();
    }
  }
}

function* infections() {
  yield put(infectCities());
  const infectionRate = yield select(sel.getInfectionRate);
  for (let i = 0; i < infectionRate; i++) {
    const city = yield select(sel.peekAtInfectionDeck);
    const color = yield select(sel.getCityColor, city);
    const status = yield select(sel.getDiseaseStatus, color);
    if (status !== 'eradicated') {
      yield infectOrOutbreak(city, color, 1);
    }
    yield put(discardTopInfectionCard());
  }
}

function* drawIfNoActionsLeft() {
  const actionsLeft = yield select(sel.getActionsLeft);
  if (actionsLeft === 0) {
    yield drawPlayerCards();
    yield infections();
    yield put(passTurn());
  }
}

function* checkForInfectionRateDefeat() {
  if (yield select(sel.isInfectionRateOutOfBounds)) {
    yield put(defeat());
  }
}

function* checkForOutbreaksDefeat() {
  if (yield select(sel.isOutbreaksCountOutOfBounds)) {
    yield put(defeat());
  }
}

function* watchMoveInit() {
  yield* takeEvery(types.PLAYER_MOVE_INIT, showAvailableCities);
}

function* watchMoveToCity() {
  yield* takeEvery(types.PLAYER_MOVE_TO_CITY, processMoveToCity);
}

function* watchForTreatEradication() {
  yield* takeEvery(types.PLAYER_TREAT_DISEASE, checkForEradication);
}

function* watchForCureEradication() {
  yield* takeEvery(types.PLAYER_CURE_DISEASE, checkForEradication);
}

function* watchForVictory() {
  yield* takeEvery(types.PLAYER_CURE_DISEASE, checkForVictory);
}

function* watchActionsLeft() {
  yield* takeEvery(types.ACTIONS, drawIfNoActionsLeft);
}

function* watchForInfectionRateDefeat() {
  yield* takeEvery(types.EPIDEMIC_INCREASE, checkForInfectionRateDefeat);
}

function* watchForOutbreaksDefeat() {
  yield* takeEvery(types.OUTBREAK_INIT, checkForOutbreaksDefeat);
}

export default function* rootSaga() {
  yield [
    watchMoveInit(),
    watchMoveToCity(),
    watchForTreatEradication(),
    watchForCureEradication(),
    watchForVictory(),
    watchActionsLeft(),
    watchForInfectionRateDefeat(),
    watchForOutbreaksDefeat()
  ];
}
