import { GameFacade } from './game_facade/game_facade';
import { AiAgentRandom } from './ai_agent_random';

const game = new GameFacade();
game.quickStartNewGame(1);
const agent = new AiAgentRandom(game);

agent.playUntilEnd();

console.log('Done');
