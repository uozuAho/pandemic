# DFS pandemic player psuedocode

```python
def solve(state, played_actions=[])
    """ Returns a list of actions to win the game, or None """
    if (state == loss)
        return None
    else if (state == win)
        return played_actions

    available_actions = get_actions(state)

    if len(available_actions) == 0:
        return None

    for action in available_actions:
        next_state = do(action)
        solution = solve(next_state, played_actions + [action])
        if solution is not None:
            return solution
```
