import { expect } from 'chai';

import * as initState from './game.playthrough.spec.init.state.json';
import { PandemicGame } from './game.js';

describe('game playthrough', () => {

    let game = new PandemicGame();

    beforeEach(() => {
        game.setState(initState);
    });

    it('playthrough 1', () => {
        expect(game.getFullGameState().currentMove.actionsLeft).to.equal(4);
    });
});
