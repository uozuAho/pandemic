import configureStore from './store/configureStore.prod';

const store = configureStore();

console.log(JSON.stringify(store.getState()));
