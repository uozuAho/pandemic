import { all } from 'redux-saga/effects';

import { 
  watchActionsLeft, 
  watchMoveInit,
  watchMoveToCity,
  watchShareInit,
  watchCureInit,
  watchBuildStation
} from './actionSagas';

import { watchTreatEradication, watchCureEradication } from './diseaseSagas';
import {
  watchCreateQuickGame,
  watchCreateCustomGame,
  watchVictory,
  watchOutbreaksDefeat,
  watchDealCards
} from './globalSagas';

import { watchEvents } from './eventSagas';
import { watchMedicAirlift, watchContPlannerInit, watchDispatcherMove, watchCureDisease } from './roleSagas';
import { getConsoleActionWatchers } from '../console_game/game/action_listeners';

let watchers = [
  watchCreateQuickGame(),
  watchCreateCustomGame(),
  watchDealCards(),
  watchMoveInit(),
  watchMoveToCity(),
  watchShareInit(),
  watchActionsLeft(),
  watchCureInit(),
  watchBuildStation(),
  watchTreatEradication(),
  watchCureEradication(),
  watchVictory(),
  watchOutbreaksDefeat(),
  watchEvents(),
  watchMedicAirlift(),
  watchContPlannerInit(),
  watchDispatcherMove(),
  watchCureDisease()
];

if (typeof window === 'undefined') {
  watchers = watchers.concat(getConsoleActionWatchers());
}

export default function* rootSaga() {
  yield all(watchers);
}
