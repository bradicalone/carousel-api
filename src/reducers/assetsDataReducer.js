import { API_ERROR, GET_ASSETS} from '../actions/types';

let initState = []
export const assetsDataReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_ASSETS:
            return initState = [...action.payload]
        case API_ERROR:
            console.log(action.payload)
            return {valueError: true, ...action.payload}
        default:
            return initState
    }
};
