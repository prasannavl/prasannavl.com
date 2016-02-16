import { browserHistory, createMemoryHistory } from "react-router";
import env from "fbjs/lib/ExecutionEnvironment";
let history = null;

if (env.canUseDOM) {
    history = browserHistory;
} else {
    history = createMemoryHistory();
}

export default history;