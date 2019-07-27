import { expect } from 'chai';
import { PandemicGame } from "./game";
import cities from '../../constants/cities';

describe('game', () => {

    let game = new PandemicGame();

    beforeEach(() => {
        game = new PandemicGame();
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
