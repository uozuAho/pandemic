import configureStore from '../store/configureStore.prod';
import { moveInit } from '../actions/mapActions';
import {
    createQuickGameInit,
    dealCardsInit,
    animationDealCardsInitComplete,
    animationDealCardsComplete,
    animationInsertEpidemicCardsComplete,
    animationDrawInfectionCardComplete
} from '../actions/globalActions';

import readlineSync from 'readline-sync';
import fs from 'fs';

const store = configureStore();

const getInterestingState = () => {
    const state = store.getState();

    return {
        ...state,
        map: {
            playersLocations: state.map.playersLocations
        },
        routing: null,
        stateHistory: null
    }
}

readlineSync.promptCLLoop({
    sc: () => {
        const currentMoveState = JSON.stringify(store.getState().currentMove, null, 2);
        console.log(currentMoveState);
    },
    // todo: command for full state, since it has map details
    sf: () => {
        const stateStr = JSON.stringify(getInterestingState(), null, 2);
        fs.writeFileSync('current_state.json', stateStr, e => {
            console.log(e);
        });
    },
    init: () => {
        store.dispatch(createQuickGameInit(1));
        store.dispatch(dealCardsInit());
        store.dispatch(animationDealCardsInitComplete());
        store.dispatch(animationDealCardsComplete());
        store.dispatch(animationInsertEpidemicCardsComplete());
        while (store.getState().status === 'prepare') {
            store.dispatch(animationDrawInfectionCardComplete());
        }
        console.log("now ready to play!");
    },
    m: () => { store.dispatch(moveInit(0)); },
    q: () => { return true; }
});

console.log('Done');
