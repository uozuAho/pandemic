import configureStore from '../../store/configureStore.prod';
import {
    createQuickGameInit,
    dealCardsInit,
} from '../../actions/globalActions';
import { getAvailableCities } from '../../selectors/cities';
import { moveInit, moveToCity } from '../../actions/mapActions';
import { getCurrentPlayer } from '../../selectors';
import { setState } from '../console_redux_actions';

export class GameFacade {

    constructor() {}

    quickStartNewGame(numPlayers) {
        this._resetState();
        const store = this._reduxStore;
        store.dispatch(createQuickGameInit(numPlayers));
        store.dispatch(dealCardsInit());
    }

    move(city) {
        const state = this.getFullGameState();
        const player = getCurrentPlayer(state);
        const playerLocationId = state.map.playersLocations[player.id];
        const moveAction = this.getAvailableMoves().filter(m => m.cityName === city)[0];

        this._reduxStore.dispatch(moveInit(player.id));
        this._reduxStore.dispatch(moveToCity(player.id, playerLocationId, moveAction.cityId, moveAction.moveType));
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

    setState(state) {
        this._reduxStore.dispatch(setState(state));
    }

    getFullGameState() {
        return this._reduxStore.getState();
    }

    getAvailableMoves() {
        const state = this.getFullGameState(0);
        const cities = getAvailableCities(state);
        return Object.keys(cities).map(k =>
            new MoveAction(cities[k]['id'], cities[k]['name'], cities[k]['source']));
    }

    _resetState() {
        this._reduxStore = configureStore();
    }
}

class MoveAction {
    constructor(cityId, cityName, moveType) {
        this.cityId = cityId;
        this.cityName = cityName;
        this.moveType = moveType;
    }
}