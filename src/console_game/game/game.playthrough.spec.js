import { expect } from 'chai';

import * as initState from './game.playthrough.spec.init.state.json';
import * as actionTypes from './player_action_types';
import { PandemicGameInstance } from './game.js';

describe('game playthrough', () => {

    let game = PandemicGameInstance;

    beforeEach(() => {
        game.resetState();
        game.setState(initState);
    });

    it('playthrough 1', () => {
        let state = game.getFullGameState();
        expect(state.currentMove.actionsLeft).to.equal(4);
        expect(state.players[0].hand.length).to.equal(5);

        game.move('Chicago');
        game.move('Atlanta');
        game.move('Chicago');
        game.move('Atlanta');

        state = game.getFullGameState();
        expect(state.players[0].hand.length).to.equal(7);

        game.move('Chicago');
        game.move('Atlanta');
        game.move('Chicago');
        game.move('Atlanta');

        state = game.getFullGameState();
        expect(state.currentMove.playerToDiscard).to.equal('0');

        const availableMoves = game.getAvailableActions();
        expect(availableMoves.length).to.equal(9);
        for (const type of availableMoves.map(m => m.type)) {
            expect(type).to.equal(actionTypes.DISCARD);
        }

        game.discard('Cairo');
        game.discard('Chicago');

        console.log('asd');
    });
});
