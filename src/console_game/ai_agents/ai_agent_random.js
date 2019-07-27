/**
 * Makes random moves until the game is finished
 */
export class AiAgentRandom {
    constructor(game) {
        this._game = game;
    }

    playNextMove() {
        const moves = this._game.getAvailableMoves();
        if (moves.length > 0) {
            this._game.move(moves[0].cityName);
        }
    }
}
