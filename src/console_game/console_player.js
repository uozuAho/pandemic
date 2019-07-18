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

import fs from 'fs';

import { CommandLoopRunner, Command } from './command_handler';

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

const commands = [
    new Command('sc', 'print player state', () => {
        const currentMoveState = JSON.stringify(store.getState().currentMove, null, 2);
        console.log(currentMoveState);
    }),
    // todo: command for full state, since it has map details
    new Command('sf', 'print interesting state to file', () => {
        const stateStr = JSON.stringify(getInterestingState(), null, 2);
        fs.writeFileSync('current_state.json', stateStr, e => {
            console.log(e);
        });
    }),
    new Command('init', 'initialise game', () => {
        store.dispatch(createQuickGameInit(1));
        store.dispatch(dealCardsInit());
        store.dispatch(animationDealCardsInitComplete());
        store.dispatch(animationDealCardsComplete());
        store.dispatch(animationInsertEpidemicCardsComplete());
        while (store.getState().status === 'prepare') {
            store.dispatch(animationDrawInfectionCardComplete());
        }
        console.log("now ready to play!");
    }),
    new Command('m', 'move', () => { store.dispatch(moveInit(0));})
];

const handler = new CommandLoopRunner(commands);
handler.run();

console.log('Done');
