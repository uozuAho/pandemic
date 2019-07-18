import { takeEvery, delay } from 'redux-saga';
import { select, put, take, fork, cancel, call } from 'redux-saga/effects';

import { moveShowCities, moveComplete } from '../actions/mapActions';
import { cureDiseaseShowCards } from '../actions/diseaseActions';
import { shareCardsShowCandidates, discardFromHandInit, chooseCardsToDiscard,
  cardOverLimitComplete, drawCardsInit, drawCardsHandleInit, drawCardsHandle } from '../actions/cardActions';
import { passTurn } from '../actions/globalActions';
import * as sel from '../selectors';
import * as types from '../constants/actionTypes';
import defeatMessages from '../constants/defeatMessages';
import { infections, yieldEpidemic } from './diseaseSagas';
import { yieldDefeat } from './globalSagas';
import { opsChooseCardToDiscard, treatCuredDiseasesOnMedicMove } from './roleSagas';


const MAX_PLAYER_CARDS_LEFT = 2;

export function* showCitiesAndMove(cities) {
  yield put(moveShowCities(cities));
  yield take([types.PLAYER_MOVE_TO_CITY, types.PLAYER_MOVE_CANCEL]);
}

export function* showAvailableCities() {
  const cities = yield select(sel.getAvailableCities);
  yield call(showCitiesAndMove, cities);
}

export function* movedToCity(action) {
  yield take(types.ANIMATION_MOVE_COMPLETE);
  const currentPlayer = yield select(sel.getCurrentPlayer);
  switch (action.source) {
    case 'direct':
      yield put(discardFromHandInit('city', currentPlayer.id, action.destinationId));
      yield take(types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE);
      break;
    case 'charter':
      yield put(discardFromHandInit('city', currentPlayer.id, action.originId));
      yield take(types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE);
      break;
    case 'ops':
      yield call(opsChooseCardToDiscard, currentPlayer.id);
      break;
  }
  yield call(treatCuredDiseasesOnMedicMove, action);
  yield put(moveComplete());
}

export function* showShareCandidates() {
  const players = yield select(sel.getShareCandidates);
  yield put(shareCardsShowCandidates(players));

  const action = yield take([types.PLAYER_SHARE_CARD, types.PLAYER_SHARE_CANCEL]);
  if (action.type === types.PLAYER_SHARE_CARD) {
    yield call(waitToDiscardIfOverLimit, action.receiverId);
  }
}

export function* drawIfNoActionsLeft() {
  function* continueTurn() {
    if (!(yield select(sel.shouldSkipInfectionsStep))) {
      yield call(infections);
      if (!(yield select(sel.isPlaying))) {
        // lost on outbreaks or cubes
        return;
      }
    }
    const nextPlayer = yield select(sel.getNextPlayer);
    yield put(passTurn(nextPlayer));
  }

  if (!(yield select(sel.isPlaying))) {
    // won
    return;
  }

  const actionsLeft = yield select(sel.getActionsLeft);
  if (actionsLeft === 0) {
    yield call(drawPlayerCards);
    if (!(yield select(sel.isPlaying))) {
      // lost due to not enough player cards
      return;
    }
    const currentPlayer = yield select(sel.getCurrentPlayer);
    yield call(waitToDiscardIfOverLimit, currentPlayer.id);
    yield call(continueTurn);
  }
}

function* checkIfHandWentUnderLimit() {
  const player = yield select(sel.getPlayerToDiscard);
  if (player && !(yield select(sel.isOverHandLimit, player))) {
    yield put(cardOverLimitComplete());
  }
}

export function* waitToDiscardIfOverLimit(playerId) {
  function* watchOverLimitDiscardComplete() {
    yield* takeEvery(types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE, checkIfHandWentUnderLimit);
  }

  if (yield select(sel.isOverHandLimit, playerId)) {
    yield put(chooseCardsToDiscard(playerId));
    const task = yield fork(watchOverLimitDiscardComplete);
    yield take(types.CARD_OVER_LIMIT_DISCARD_COMPLETE);
    yield cancel(task);
  }
}

export function* drawPlayerCards() {
  const cards = yield select(sel.getPlayerCardsToDraw);
  if (cards.length < MAX_PLAYER_CARDS_LEFT) {
    yield call(yieldDefeat, defeatMessages.OUT_OF_PLAYER_CARDS);
  } else {
    let bothEpidemics = false;
    if (cards[0].cardType === 'epidemic') {
      if (cards[1].cardType === 'epidemic') {
        bothEpidemics = true;
      } else {
        cards.reverse();
      }
    }
    yield put(drawCardsInit(cards));
    yield take(types.ANIMATION_DRAW_CARDS_INIT_COMPLETE);

    if (bothEpidemics) {
      const currentPlayer = yield select(sel.getCurrentPlayer);
      yield call(delay, 3000);
      yield put(drawCardsHandle(cards[0], currentPlayer.id));
      yield put(drawCardsHandle(cards[1], currentPlayer.id));
      yield call(yieldEpidemic);
      yield call(yieldEpidemic);
    } else {
      for (let i = 0; i < 2; i++) {
        yield put(drawCardsHandleInit(cards[i]));
        yield take(types.CARD_DRAW_CARDS_HANDLE);

        if (cards[i].cardType === 'epidemic') {
          yield call(yieldEpidemic);
        }
      }
    }
  }
}

export function* showCardsToCure({ color }) {
  const cards = yield select(sel.getCardsOfColorInCurrentHand, color);
  yield put(cureDiseaseShowCards(cards, color));
  const action = yield take([types.PLAYER_CURE_DISEASE_COMPLETE, types.PLAYER_CURE_DISEASE_CANCEL]);
  if (action.type === types.PLAYER_CURE_DISEASE_COMPLETE) {
    const { cityIds } = action;
    yield take(types.ANIMATION_CURE_DISEASE_COMPLETE);
    const currentPlayer = yield select(sel.getCurrentPlayer);
    for (let i = 0; i < cityIds.length; i++) {
      yield put(discardFromHandInit('city', currentPlayer.id, cityIds[i]));
      yield take(types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE);
    }
  }
}

export function* maybeDiscardStationCity(action) {
  if ((yield select(sel.getCurrentRole)) !== 'ops_expert') {
    const currentPlayer = yield select(sel.getCurrentPlayer);
    yield put(discardFromHandInit('city', currentPlayer.id, action.cityId));
  }
}

export function* watchMoveInit() {
  yield* takeEvery(types.PLAYER_MOVE_INIT, showAvailableCities);
}

export function* watchMoveToCity() {
  yield* takeEvery(types.PLAYER_MOVE_TO_CITY, movedToCity);
}

export function* watchShareInit() {
  yield* takeEvery(types.PLAYER_SHARE_INIT, showShareCandidates);
}

export function* watchActionsLeft() {
  yield* takeEvery(types.ACTIONS, drawIfNoActionsLeft);
}

export function* watchBuildStation() {
  yield* takeEvery(types.PLAYER_BUILD_STATION, maybeDiscardStationCity);
}

export function* watchCureInit() {
  yield* takeEvery(types.PLAYER_CURE_DISEASE_INIT, showCardsToCure);
}

export function* watchForMoveComplete() {
  yield* takeEvery(types.PLAYER_MOVE_TO_CITY, movedToCity);
}

function* logToConsole(action) {
  yield call(() => console.log(action));
}

export function* watchAllForConsole() {
  yield* takeEvery('*', a => logToConsole(a));
}
