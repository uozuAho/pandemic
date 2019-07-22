export class GameFacade {
    isFinished(): boolean;
    quickStartNewGame: (numPlayers: number) => void;
    move: (cityName: string) => void;
    getSmallGameState: () => GameState;
    setState: (state: GameState) => void;
    getFullGameState: () => GameState;
    getAvailableMoves: () => MoveAction[];
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

export class MoveAction {

    cityId: number;
    cityName: string;
    moveType: MoveType;

    constructor(cityId: number, cityName: string, moveType: MoveType) {}
}
