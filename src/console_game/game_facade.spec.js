import { expect } from 'chai';
import { GameFacade } from "./game_facade";
import cities from '../constants/cities';

describe('game_facade', () => {

    let game = new GameFacade();

    beforeEach(() => {
        game = new GameFacade();
    });

    describe('new 1 player game', () => {
        it('move to Chicago should move player 0 to Chicago', () => {
            game.quickStartNewGame(1);
            const chicago = cities[1];

            game.move('Chicago');

            const player0Location = game.getFullGameState().map.playersLocations[0];
            expect(player0Location).to.equal(chicago.id);
        });
    })
});
