import { watchActionsLeft, watchMoveInit, watchMoveToCity, watchShareInit, watchCureInit, watchBuildStation, watchAllForConsole } from './actionSagas';
import { watchTreatEradication, watchCureEradication } from './diseaseSagas';
import { watchCreateQuickGame, watchCreateCustomGame, watchVictory, watchOutbreaksDefeat,
  watchDealCards } from './globalSagas';
import { watchEvents } from './eventSagas';
import { watchMedicAirlift, watchContPlannerInit, watchDispatcherMove, watchCureDisease } from './roleSagas';
import { watchDealCardsInit, watchMoveToCity2 } from '../console_game/animation_enders';

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

// todo: how to determine if running in console?
// if (window === undefined) {
  watchers = watchers.concat([
    watchAllForConsole(),
    watchDealCardsInit(),
    watchMoveToCity2()
  ]);
// }

export default function* rootSaga() {
  yield watchers;
}
