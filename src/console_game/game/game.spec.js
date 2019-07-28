import { expect } from 'chai';
import cities from '../../constants/cities';
import { PandemicGameInstance } from './game';

describe('game', () => {

    const game = PandemicGameInstance;

    beforeEach(() => {
        game.resetState();
    });

    describe('new 1 player game', () => {
        it('move to Chicago should move player 0 to Chicago', () => {
            game.quickStartNewGame(1);
            const chicago = cities[1];

            game.move('Chicago');

            const player0Location = game.getFullGameState().map.playersLocations[0];
            expect(player0Location).to.equal(chicago.id);
        });
    });
});
