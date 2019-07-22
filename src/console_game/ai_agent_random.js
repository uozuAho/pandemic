/**
 * Makes random moves until the game is finished
 */
export class AiAgentRandom {
    constructor(game) {
        this._game = game;
    }

    playUntilEnd() {
        while (!this._game.isFinished()) {
            const moves = this._game.getAvailableMoves();
            if (moves.length === 0) {
                break;
            }
            this._game.move(moves[0].cityName);
        }
    }
}
