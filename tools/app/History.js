import { createMemoryHistory } from "react-router";

export class HistoryFactory {
    static create() {
        return createMemoryHistory();
    }
}