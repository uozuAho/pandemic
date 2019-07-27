import { GameFacade } from '../game_facade/game_facade';

export interface AiAgent {
    constructor(game: GameFacade);

    playNextMove(): void;
}

export class AiAgentRandom implements AiAgent {};