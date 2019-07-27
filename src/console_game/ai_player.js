import { PandemicGame } from './game/game';
import { AiAgentRandom } from './ai_agents/ai_agent_random';

const MAX_MOVES = 5;
const game = new PandemicGame();
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
