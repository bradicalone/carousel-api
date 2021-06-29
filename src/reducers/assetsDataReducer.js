import { API_ERROR, REMOVE_ERROR_DIALOG, GET_ASSETS} from '../actions/types'



const initState = [
    
]



export const assetsDataReducer = (state = initState, action) => {
    switch (action.type) {
        case REMOVE_ERROR_DIALOG:
            return { valueError: false, ...initState }
        case GET_ASSETS:
            console.log(state, action.payload)

            return [...state, ...action.payload]
        case API_ERROR:
            console.log(action.payload)
            return {valueError: true, ...action.payload}
        default:
            return initState
    }
};

// export const utilReducer = (state = initState, action) => {
//     switch (action.type) {
//         case REMOVE_ERROR_DIALOG:
//             return { valueError: false, ...initState }
        
//         default:
//             return initState
//     }
// }