import { combineReducers } from 'redux';
import { assetsDataReducer } from './assetsDataReducer'

export default combineReducers({
    data: assetsDataReducer
})