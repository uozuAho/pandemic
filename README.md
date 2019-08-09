# Pandemic
A Redux-based implementation of the board game Pandemic.

https://epidemic.netlify.com

## Console version (under construction)

`npm run console`

todo
- implement 'choose card to discard'. actions:
CARD_DRAW_CARDS_INIT
ANIMATION_DRAW_CARDS_INIT_COMPLETE
CARD_DRAW_CARDS_HANDLE_INIT
CARD_DRAW_CARDS_HANDLE
CARD_DRAW_CARDS_HANDLE_INIT
CARD_DRAW_CARDS_HANDLE
CARD_OVER_LIMIT_DISCARD_INIT
CARD_DISCARD_FROM_HAND_INIT
ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE
CARD_OVER_LIMIT_DISCARD_COMPLETE

- dfs solver
- ui tests
    - eg for discard ui not appearing

bugs
- discard ui doesn't appear when player must discard
    - repro
        - do dummy moves until next pickup requires discard, discard UI doesn't appear, can't do anything
        - at this point, CardLayer.state.cardsDrawnAnimated is true, but should be false
    - workaround
        - setting CardLayer.state.cardsDrawnAnimated to false via react dev tools