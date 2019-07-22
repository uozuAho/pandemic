import { takeEvery } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { animationEndWatchers } from "./animation_enders";

export function getConsoleActionWatchers() {
    return animationEndWatchers.concat([watchAllForConsole()]);
}

function* logToConsole(action) {
    yield call(() => console.log(action));
}

function* watchAllForConsole() {
    yield takeEvery('*', a => logToConsole(a.type));
}
