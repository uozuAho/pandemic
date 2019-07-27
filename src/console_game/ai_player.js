import { GameFacade } from './game_facade/game_facade';
import { AiAgentRandom } from './ai_agent/ai_agent_random';

const MAX_MOVES = 1000;
const game = new GameFacade();
game.quickStartNewGame(1);

const agent = new AiAgentRandom(game);

for (let moveCounter = 0; moveCounter < MAX_MOVES; moveCounter++) {
    if (game.isFinished()) {
        console.log("Game finished!");
        break;
    }

    agent.playNextMove();
}

if (!game.isFinished()) {
    console.log(`Game did not finish after ${MAX_MOVES} moves`);
}

console.log('Done');
