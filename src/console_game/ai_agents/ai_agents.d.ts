import { PandemicGame } from '../game/game';

export interface AiAgent {
    constructor(game: PandemicGame);

    playNextMove(): void;
}

export class AiAgentRandom implements AiAgent {};