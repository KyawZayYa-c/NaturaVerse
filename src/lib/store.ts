import {imageApi} from "@/src/lib/api/postApi";
import { configureStore, combineSlices } from '@reduxjs/toolkit';
import {ThunkAction, Action} from '@reduxjs/toolkit';
import {authApi} from "@/src/lib/api/authApi";
import {sliderApi} from "@/src/lib/api/sliderApi";
const rootReducer = combineSlices(
    imageApi,
    authApi,
    sliderApi
)

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware : (getDefaultMiddleware) =>{
            return getDefaultMiddleware()
                .concat(imageApi.middleware )
                .concat(authApi.middleware)
                .concat(sliderApi.middleware)
        }
    })
}
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void > = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>