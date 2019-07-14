import configureStore from './store/configureStore.prod';
import { moveInit } from './actions/mapActions';
import { createQuickGameInit, dealCardsInit } from './actions/globalActions';

import readlineSync from 'readline-sync';
import fs from 'fs';

const store = configureStore();

store.dispatch(createQuickGameInit(1));

// todo: do i need to wait before dealing?
store.dispatch(dealCardsInit());

readlineSync.promptCLLoop({
    sc: () => {
        const currentMoveState = JSON.stringify(store.getState().currentMove, null, 2);
        console.log(currentMoveState);
    },
    sf: () => {
        // todo: cut out unnecessary stuff like map, state history
        const stateStr = JSON.stringify(store.getState(), null, 2);
        fs.writeFileSync('current_state.json', stateStr, e => {
            console.log(e);
        });
    },
    m: () => { store.dispatch(moveInit(0)); },
    q: () => { return true; }
});

console.log('Done');
