import * as actionTypes from './player_action_types';

export class MoveAction {
    constructor(cityId, cityName, moveType) {
        this.type = actionTypes.MOVE;
        this.cityId = cityId;
        this.cityName = cityName;
        this.moveType = moveType;
    }
}
