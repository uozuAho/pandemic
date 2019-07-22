import fs from 'fs';

import { CommandLoopRunner, Command } from './command_handler';
import { GameFacade } from './game_facade/game_facade';

const game = new GameFacade();

const writeToFile = (obj, filename) => {
    const objStr = JSON.stringify(obj, null, 2);
    fs.writeFileSync(filename, objStr, error => {
        console.log(error);
    });
}

const commands = [
    new Command('r', 'restart game', () => {
        const initState = JSON.parse(fs.readFileSync('init_state.json'));
        game.setState(initState);
    }),
    new Command('sc', 'print player state', () => {
        const currentMoveState = JSON.stringify(game.getFullGameState().currentMove, null, 2);
        console.log(currentMoveState);
    }),
    new Command('sf', 'print interesting state to file', () => {
        writeToFile(game.getSmallGameState(), 'current_state.json');
    }),
    new Command('sff', 'print full state to file (big!)', () => {
        writeToFile(game.getFullGameState(), 'current_state_full.json');
    }),
    new Command('init', 'initialise game', () => {
        game.quickStartNewGame(1);
        writeToFile(game.getFullGameState(), 'init_state.json');
        console.log("now ready to play!");
    }),
    new Command('m', 'move', cityName => {
        game.move(cityName);
    }),
    new Command('a', 'print available actions', () => {
        console.log(game.getAvailableMoves());
    }),
    new Command('d', 'dispatch action', actionType => {
        game.debugDispatchAction(actionType);
    }),
];

const handler = new CommandLoopRunner(commands);
handler.run();

console.log('Done');
