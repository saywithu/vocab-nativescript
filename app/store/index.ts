import { RouterReducerState, routerReducer } from "@ngrx/router-store";
import { ActionReducerMap, MetaReducer } from "@ngrx/store";
//import { storeFreeze } from "ngrx-store-freeze";

export interface State {
    router: RouterReducerState;
}
export const reducers: ActionReducerMap<State> = {
    router: routerReducer
};
export const metaReducers: MetaReducer<State>[] = [
    //storeFreeze
];
