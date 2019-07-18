export class GameFacade {
    quickStartNewGame: (numPlayers: number) => void;
    move: (city: string) => void;
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
    }
}

export class MoveAction {
    city: string;
}
