export class GameFacade {
    quickStartNewGame: (numPlayers: number) => void;
    move: (cityName: string) => void;
    getSmallGameState: () => GameState;
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
