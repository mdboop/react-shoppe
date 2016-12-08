import * as api from './api.js';
import { combineEpics } from 'redux-observable';
import 'rxjs';
import {
    types,
    
    fetchProductsComplete,
    fetchProductsError,
    
    autoLoginNoUser,
    updateUserComplete,
    updateUserError
} from './redux.js';

export function productsEpic(action$) {
    return action$.ofType(types.FETCH_PRODUCTS)
        // cancellation for free here
        .switchMap(() =>
            api.getProducts()
            .map((products) => fetchProductsComplete(products))
            .catch(err => [fetchProductsError(err)])
        );
}
// CHECK THIS OUT!!! Third argument to epic
export function autoLoginEpic(action$, { getState }, { storage }) {
    return action$.ofType(types.AUTO_LOGIN)
        .switchMap(() => {
            if (!storage.userId || !storage.token) {
                return [autoLoginNoUser()];
            }
            return api.fetchUser(storage.userId, storage.token)
            .map((user) => updateUserComplete(user))
            .catch(err => [updateUserError(err)]);
        });
}

export default combineEpics(productsEpic, autoLoginEpic);
