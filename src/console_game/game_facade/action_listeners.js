import { takeEvery } from 'redux-saga';
import { call } from 'redux-saga/effects';

import {
    consoleWatchDealCardsInit,
    consoleWatchMoveToCity }
from "./animation_enders";

export function getConsoleActionWatchers() {
    return [
        watchAllForConsole(),
        consoleWatchDealCardsInit(),
        consoleWatchMoveToCity()
    ];
}

function* logToConsole(action) {
    yield call(() => console.log(action));
  }
  
function* watchAllForConsole() {
    yield* takeEvery('*', a => logToConsole(a));
}
