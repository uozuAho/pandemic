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

const commands = [
    { name: 'help', description: 'print help info', handler: () => {console.log('yo')}},
    { name: 'do', description: 'do stuff', handler: () => {console.log('do stuff')}}
];

class CommandHandler {

    constructor(commands) {
        this._commands = commands;
    }

    runLoop() {
        const readlineSyncInput = this._mapCommandsToReadlineSyncInput(this._commands);
        readlineSync.promptCLLoop(readlineSyncInput);
    }

    _mapCommandsToReadlineSyncInput(commands) {
        const readlineSyncInput = {};
        for (const command of commands) {
            readlineSyncInput[command.name] = command.handler;
        }
        return readlineSyncInput;
    }
}

const handler = new CommandHandler(commands);
handler.runLoop();

// readlineSync.promptCLLoop({
//     help: () => {
//         console.log('yo');
//     },
//     sc: () => {
//         const currentMoveState = JSON.stringify(store.getState().currentMove, null, 2);
//         console.log(currentMoveState);
//     },
//     // todo: command for full state, since it has map details
//     sf: () => {
//         const stateStr = JSON.stringify(getInterestingState(), null, 2);
//         fs.writeFileSync('current_state.json', stateStr, e => {
//             console.log(e);
//         });
//     },
//     init: () => {
//         store.dispatch(createQuickGameInit(1));
//         store.dispatch(dealCardsInit());
//         store.dispatch(animationDealCardsInitComplete());
//         store.dispatch(animationDealCardsComplete());
//         store.dispatch(animationInsertEpidemicCardsComplete());
//         while (store.getState().status === 'prepare') {
//             store.dispatch(animationDrawInfectionCardComplete());
//         }
//         console.log("now ready to play!");
//     },
//     m: () => { store.dispatch(moveInit(0)); },
//     q: () => { return true; }
// });

console.log('Done');
