import fs from 'fs';

import { CommandLoopRunner, Command } from './command_handler';
import { GameFacade } from './game_facade';

const game = new GameFacade();

const commands = [
    new Command('sc', 'print player state', () => {
        const currentMoveState = JSON.stringify(game.getFullGameState().currentMove, null, 2);
        console.log(currentMoveState);
    }),
    new Command('sf', 'print interesting state to file', () => {
        const stateStr = JSON.stringify(game.getSmallGameState(), null, 2);
        fs.writeFileSync('current_state.json', stateStr, e => {
            console.log(e);
        });
    }),
    new Command('init', 'initialise game', () => {
        game.quickStartNewGame(1);
        console.log("now ready to play!");
    }),
    new Command('m', 'move', () => {
        game.move('asdf');
    }),
    new Command('a', 'print available actions', () => {
        console.log(game.getAvailableMoves());
    }),
];

const handler = new CommandLoopRunner(commands);
handler.run();

console.log('Done');
