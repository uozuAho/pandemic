import configureStore from '../store/configureStore.prod';
import {
    createQuickGameInit,
    dealCardsInit,
    animationDealCardsInitComplete,
    animationDealCardsComplete,
    animationInsertEpidemicCardsComplete,
    animationDrawInfectionCardComplete
} from '../actions/globalActions';
import { moveInit } from '../actions/mapActions';

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

    move(city) {
        // todo: move to city
        this._reduxStore.dispatch(moveInit(0));
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

    getAvailableMoves() {
        this._reduxStore.dispatch(moveInit(0));
        const state = this.getFullGameState(0);
        // todo: map to city objects
        return state.currentMove.availableCities;
    }

    _resetState() {
        this._reduxStore = configureStore();
    }
}
