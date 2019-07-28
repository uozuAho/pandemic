import { expect } from 'chai';

import * as initState from './game.playthrough.spec.init.state.json';
import { PandemicGameInstance } from './game.js';

describe('game playthrough', () => {

    let game = PandemicGameInstance;

    beforeEach(() => {
        game.resetState();
        game.setState(initState);
    });

    it('playthrough 1', () => {
        expect(game.getFullGameState().currentMove.actionsLeft).to.equal(4);
    });
});
