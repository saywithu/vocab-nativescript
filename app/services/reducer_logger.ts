import { Store, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Logger } from './logger';
import { LogLevel, ILogger } from './logger.common';

@Injectable()
export class MetaReducerLogger {

    private log : ILogger;

    constructor(private store: Store<any>, private logger: Logger) {
        this.log = logger.getLogger(MetaReducerLogger.name);
        this.store.addReducer("log", (state, action) => this.metaReducer(state, action));
    }

    metaReducer(state: any, action: Action) {
        this.log.debug(`Action: ${action.type}`, "State:", state, "Payload", (action as any).payload);
        return state;
    }
}
