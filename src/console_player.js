import configureStore from './store/configureStore.prod';
import { moveInit } from './actions/mapActions';
import readlineSync from 'readline-sync';
import { createQuickGameInit } from './actions/globalActions';

const store = configureStore();

store.dispatch(createQuickGameInit(1));

// console.log(JSON.stringify(store.getState()));

// store.dispatch(moveInit(0));

// console.log(JSON.stringify(store.getState()));

readlineSync.promptCLLoop({
    state: () => {
        console.log(JSON.stringify(store.getState()));
    },
    q: () => { return true; }
});

console.log('Done');
