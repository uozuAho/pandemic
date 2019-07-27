import { animationEndWatchers } from "./animation_enders";
import { watchAllAndLog } from "./action_logger";

export function getConsoleActionWatchers() {
    return animationEndWatchers.concat([watchAllAndLog()]);
}
