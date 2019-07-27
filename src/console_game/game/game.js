import configureStore from '../../store/configureStore.prod';
import {
    createQuickGameInit,
    dealCardsInit,
} from '../../actions/globalActions';
import { getAvailableCities } from '../../selectors/cities';
import { moveInit, moveToCity } from '../../actions/mapActions';
import { getCurrentPlayer } from '../../selectors';

import { setState } from './redux/console_redux_actions';
import { MoveAction } from './player_actions';

export class PandemicGame {

    constructor() {
        this._resetState();
    }

    isFinished() {
        const status = this._getState().status;
        return status === 'victory' | status === 'defeat';
    }

    quickStartNewGame(numPlayers) {
        this._resetState();
        const store = this._reduxStore;
        store.dispatch(createQuickGameInit(numPlayers));
        store.dispatch(dealCardsInit());
    }

    move(city) {
        const state = this._getState();
        const player = getCurrentPlayer(state);
        const playerLocationId = state.map.playersLocations[player.id];
        const moveAction = this.getAvailableMoves().filter(m => m.cityName === city)[0];

        if (moveAction === undefined) {
            console.error(`no city with name '${city}' in available moves. Available moves:`);
            console.error(this.getAvailableMoves());
        } else {
            this._reduxStore.dispatch(moveInit(player.id));
            this._reduxStore.dispatch(moveToCity(player.id, playerLocationId, moveAction.cityId, moveAction.moveType));
        }
    }

    getSmallGameState() {
        const state = this._getState();

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
        return this._getState();
    }

    getAvailableMoves() {
        const state = this._getState();
        const cities = getAvailableCities(state);
        return Object.keys(cities).map(k =>
            new MoveAction(cities[k]['id'], cities[k]['name'], cities[k]['source']));
    }

    debugDispatchAction(actionType) {
        this._reduxStore.dispatch({ type: actionType });
    }

    _getState() {
        return this._reduxStore.getState();
    }

    _resetState() {
        this._reduxStore = configureStore();
    }
}
