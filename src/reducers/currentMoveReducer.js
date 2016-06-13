import { isEqual } from 'lodash';

import initialState from './initialState';
import * as types from '../constants/actionTypes';


function actionsLeft(state, action) {
  if (types.ACTIONS.includes(action.type)) {
    return state - 1;
  } else if (action.type === types.PASS_TURN) {
    return 4;
  } else {
    return state;
  }
}

function availableCities(state, action) {
  switch (action.type) {
    case types.PLAYER_MOVE_SHOW_CITIES:
      return action.cities;
    case types.PLAYER_MOVE_TO_CITY:
    case types.PLAYER_MOVE_CANCEL:
      return {};
    default:
      return state;
  }
}

function shareCandidates(state, action) {
  switch (action.type) {
    case types.PLAYER_SHARE_SHOW_CANDIDATES:
      return action.players;
    case types.PLAYER_SHARE_CARD:
    case types.PLAYER_SHARE_CANCEL:
      return [];
    default:
      return state;
  }
}

function cardsDrawn(state, action) {
  switch (action.type) {
    case types.CARD_DRAW_CARDS_INIT:
      return action.cards;
    case types.CARD_DRAW_CARDS_HANDLE:
      return state.filter((c) => !isEqual(c, action.card));
    default:
      return state;
  }
}

function outbreak(state, action) {
  switch (action.type) {
    case types.OUTBREAK_INIT:
      return {
        ...state,
        color: action.color,
        pending: state.pending.filter((id) => id !== action.cityId)
      };
    case types.OUTBREAK_COMPLETE:
      return {
        ...state,
        color: state.pending.length > 0 ? state.color : null,
        complete: state.pending.length > 0 ? [...state.complete, action.cityId] : []
      };
    case types.OUTBREAK_QUEUE:
      return {
        ...state,
        pending: state.pending.includes(action.cityId) || state.complete.includes(action.cityId)
          ? state.pending
          : [...state.pending, action.cityId]
      };
    default:
      return state;
  }
}

function playerToDiscard(state, action) {
  switch (action.type) {
    case types.CARD_OVER_LIMIT_DISCARD_INIT:
      return action.playerId;
    case types.CARD_OVER_LIMIT_DISCARD_COMPLETE:
      return null;
    default:
      return state;
  }
}

function playerToMove(state, action) {
  switch (action.type) {
    case types.DISPATCHER_CHOOSE_PLAYER:
      return action.playerId;
    case types.PLAYER_MOVE_TO_CITY:
      return null;
    default:
      return state;
  }
}

function player(state, action) {
  switch (action.type) {
    case types.PASS_TURN:
      return action.playerId;
    default:
      return state;
  }
}

function curingDisease(state, action) {
  switch (action.type) {
    case types.PLAYER_CURE_DISEASE_SHOW_CARDS:
      return { cards: action.cards, color: action.color };
    case types.PLAYER_CURE_DISEASE_COMPLETE:
    case types.PLAYER_CURE_DISEASE_CANCEL:
      return {};
    default:
      return state;
  }
}

function skipInfectionsStep(state, action) {
  switch (action.type) {
    case types.EVENT_ONE_QUIET_NIGHT_SKIP:
      return true;
    case types.PASS_TURN:
      return false;
    default:
      return state;
  }
}

function govGrantCities(state, action) {
  switch (action.type) {
    case types.EVENT_GOV_GRANT_SHOW_CITIES:
      return action.cities;
    case types.EVENT_GOV_GRANT_BUILD_STATION:
      return [];
    default:
      return state;
  }
}

function resPopChooseCard(state, action) {
  switch (action.type) {
    case types.PLAYER_PLAY_EVENT_INIT:
      if (action.id === 'res_pop') {
        return true;
      }
      return state;
    case types.EVENT_RES_POP_REMOVE_CARD:
      return false;
    default:
      return state;
  }
}

function resPopSuggestOwner(state, action) {
  switch (action.type) {
    case types.EVENT_RES_POP_SUGGEST:
      return action.playerId;
    case types.CONTINUE:
    case types.PLAYER_PLAY_EVENT_INIT:
      return null;
    default:
      return state;
  }
}

function forecastCards(state, action) {
  switch (action.type) {
    case types.EVENT_FORECAST_SHOW_CARDS:
      return action.cards;
    case types.EVENT_FORECAST_SHUFFLE:
      return [];
    default:
      return state;
  }
}

function airlift(state, action) {
  switch (action.type) {
    case types.PLAYER_PLAY_EVENT_INIT:
      if (action.id === 'airlift') {
        return { playerId: null, cities: []};
      }
      return state;
    case types.EVENT_AIRLIFT_CHOOSE_PLAYER:
      return { ...state, playerId: action.playerId };
    case types.EVENT_AIRLIFT_SHOW_CITIES:
      return { ...state, cities: action.cities };
    case types.EVENT_AIRLIFT_MOVE_TO_CITY:
      return {};
    default:
      return state;
  }
}

function opsMoveAbility(state, action) {
  switch (action.type) {
    case types.OPS_SHOW_CARDS_TO_DISCARD:
      return {
        ...state,
        cards: action.cards
      };
    case types.CARD_DISCARD_FROM_HAND:
      if (state.cards.length > 0) {
        return {
          ...state,
          cards: [],
          used: true
        };
      } else {
        return state;
      }
    case types.PASS_TURN:
      return {
        ...state,
        used: false
      };
    default:
      return state;
  }
}

function contPlannerEvents(state, action) {
  switch (action.type) {
    case types.CONT_PLANNER_SHOW_EVENTS_FROM_DISCARD:
      return action.cards;
    case types.CONT_PLANNER_CHOOSE_EVENT:
      return [];
    default:
      return state;
  }
}

export default function currentMoveReducer(state = initialState.currentMove, action) {
  return {
    ...state,
    availableCities: availableCities(state.availableCities, action),
    shareCandidates: shareCandidates(state.shareCandidates, action),
    actionsLeft: actionsLeft(state.actionsLeft, action),
    cardsDrawn: cardsDrawn(state.cardsDrawn, action),
    outbreak: outbreak(state.outbreak, action),
    playerToDiscard: playerToDiscard(state.playerToDiscard, action),
    playerToMove: playerToMove(state.playerToMove, action),
    player: player(state.player, action),
    curingDisease: curingDisease(state.curingDisease, action),
    skipInfectionsStep: skipInfectionsStep(state.skipInfectionsStep, action),
    govGrantCities: govGrantCities(state.govGrantCities, action),
    resPopChooseCard: resPopChooseCard(state.resPopChooseCard, action),
    resPopSuggestOwner: resPopSuggestOwner(state.resPopSuggestOwner, action),
    forecastCards: forecastCards(state.forecastCards, action),
    airlift: airlift(state.airlift, action),
    opsMoveAbility: opsMoveAbility(state.opsMoveAbility, action),
    contPlannerEvents: contPlannerEvents(state.contPlannerEvents, action)
  };
}
