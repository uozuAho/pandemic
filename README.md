# Pandemic
A Redux-based implementation of the board game Pandemic.

https://epidemic.netlify.com

## Console version (under construction)

`npm run console`

todo
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