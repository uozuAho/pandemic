import configureStore from '../../store/configureStore.prod';
import {
    createQuickGameInit,
    dealCardsInit,
} from '../../actions/globalActions';
import { getAvailableCities } from '../../selectors/cities';
import { moveInit, moveToCity } from '../../actions/mapActions';
import { getCurrentPlayer, getCurrentPlayerHand } from '../../selectors';

import { setState, resetState } from './redux/console_redux_actions';
import { MoveAction, DiscardAction } from './player_actions';
import * as actionTypes from './player_action_types';
import { discardFromHandInit } from '../../actions/cardActions';

class PandemicGame {

    constructor() {
        this._reduxStore = configureStore();
    }

    isFinished() {
        const status = this._getState().status;
        return status === 'victory' | status === 'defeat';
    }

    quickStartNewGame(numPlayers) {
        this.resetState();
        const store = this._reduxStore;
        store.dispatch(createQuickGameInit(numPlayers));
        store.dispatch(dealCardsInit());
    }

    move(city) {
        const state = this._getState();
        const player = getCurrentPlayer(state);
        const playerLocationId = state.map.playersLocations[player.id];
        const moveAction = this.getAvailableActions().filter(m => m.cityName === city)[0];

        // todo: don't allow action that's not a move

        if (moveAction === undefined) {
            console.error(`no city with name '${city}' in available actions. Available actions:`);
            console.error(this.getAvailableActions());
        } else {
            this._reduxStore.dispatch(moveInit(player.id));
            this._reduxStore.dispatch(moveToCity(player.id, playerLocationId, moveAction.cityId, moveAction.moveType));
        }
    }

    discard(name) {
        const state = this._getState();
        const player = getCurrentPlayer(state);
        const playerLocationId = state.map.playersLocations[player.id];
        const action = this.getAvailableActions().filter(m => m.cityName === name)[0];

        if (action === undefined || action.type !== actionTypes.DISCARD) {
            console.error(`no card to discard with name '${city}'. Available actions:`);
            console.error(this.getAvailableActions());
        } else {
            this._reduxStore.dispatch(discardFromHandInit(/* aarrgh need card type */));
            // this._reduxStore.dispatch(moveToCity(player.id, playerLocationId, action.cityId, action.moveType));
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

    resetState() {
        this._reduxStore.dispatch(resetState());
    }

    getFullGameState() {
        return this._getState();
    }

    getAvailableActions() {
        const state = this._getState();
        if (state.currentMove.playerToDiscard) {
            return getCurrentPlayerHand(state).map(c => new DiscardAction(c.id, c.name));
        }
        else {
            const cities = getAvailableCities(state);
            return Object.keys(cities).map(k =>
                new MoveAction(cities[k]['id'], cities[k]['name'], cities[k]['source']));
        }
    }

    debugDispatchAction(actionType) {
        this._reduxStore.dispatch({ type: actionType });
    }

    _getState() {
        return this._reduxStore.getState();
    }
}

export const PandemicGameInstance = new PandemicGame();
