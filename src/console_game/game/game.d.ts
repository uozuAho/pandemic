/** The game is a singleton (sorry). Multiple instances don't
 *  work, the sagas on subsequent instances don't run. Reason
 *  unknown, would be nice to fix.
 */
export const PandemicGameInstance: PandemicGame;

export class PandemicGame {
    isFinished(): boolean;
    quickStartNewGame: (numPlayers: number) => void;
    move: (cityName: string) => void;
    getSmallGameState: () => GameState;
    setState: (state: GameState) => void;
    resetState: () => void;
    getFullGameState: () => GameState;
    getAvailableMoves: () => MoveAction[];
    /** only use this for debugging */
    debugDispatchAction: (actionType: string) => void;
}

export class City {
    id: number;
    name: string;
    color: string;
    source: string;
}

export class GameState {
    status: 'prepare' | 'playing' | 'victory' | 'defeat';
    currentMove: {
        player: number,
        availableCities: {[id: number]: City}
    };
    map: {
        playersLocations: {[id: number]: number}
    };
}

export type MoveType = 'ops' | 'direct' | 'drive';

interface GameAction {
    type: string;
}

export class MoveAction implements GameAction {

    type: string;
    cityId: number;
    cityName: string;
    moveType: MoveType;

    constructor(cityId: number, cityName: string, moveType: MoveType);
}
