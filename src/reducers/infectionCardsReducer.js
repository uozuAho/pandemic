import { shuffle } from 'lodash';

import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function infectionCardsReducer(state = initialState.infectionCards, action) {
  switch (action.type) {
    case types.CARD_DISCARD_FROM_INFECTION_DECK_TOP: {
      const card = state.deck[0];
      return {
        ...state,
        deck: state.deck.slice(1),
        discard: [card, ...state.discard]
      };
    }
    case types.CARD_DISCARD_FROM_INFECTION_DECK_BOTTOM: {
      const card = state.deck[state.deck.length - 1];
      return {
        ...state,
        deck: state.deck.slice(0, state.deck.length - 1),
        discard: [card, ...state.discard]
      };
    }
    case types.EPIDEMIC_INTENSIFY: {
      const shuffled = shuffle(state.discard);
      return {
        ...state,
        deck: [...shuffled, ...state.deck],
        discard: []
      };
    }
    case types.INFECT_CITIES:

    default:
      return state;
  }
}
