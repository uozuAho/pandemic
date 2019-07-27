# Pandemic
A Redux-based implementation of the board game Pandemic.

https://epidemic.netlify.com

## Console version (under construction)

`npm run console`

todo
- discard ui not appearing bug:
    - do dummy moves until next pickup requires discard
    - at this point, CardLayer.state.cardsDrawnAnimated is true, but should be false
    - setting to false via react dev tools allows discarding, game continues as expected
- dfs solver
- bug: UI: discard on full hand not working
- config to disable some calls that don't work on console (see globalSagas todo)
