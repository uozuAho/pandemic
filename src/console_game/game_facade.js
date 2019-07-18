import configureStore from '../store/configureStore.prod';
import {
    createQuickGameInit,
    dealCardsInit,
    animationDealCardsInitComplete,
    animationDealCardsComplete,
    animationInsertEpidemicCardsComplete,
    animationDrawInfectionCardComplete
} from '../actions/globalActions';

export class GameFacade {

    constructor() {}

    quickStartNewGame(numPlayers) {
        this._resetState();
        const store = this._reduxStore;
        store.dispatch(createQuickGameInit(numPlayers));
        store.dispatch(dealCardsInit());
        store.dispatch(animationDealCardsInitComplete());
        store.dispatch(animationDealCardsComplete());
        store.dispatch(animationInsertEpidemicCardsComplete());
        while (store.getState().status === 'prepare') {
            store.dispatch(animationDrawInfectionCardComplete());
        }
    }

    getSmallGameState() {
        const state = this._reduxStore.getState();

        return {
            ...state,
            map: {
                playersLocations: state.map.playersLocations
            },
            routing: null,
            stateHistory: null
        }
    }

    getFullGameState() {
        return this._reduxStore.getState();
    }

    _resetState() {
        this._reduxStore = configureStore();
    }
}
