import { API_ERROR, GET_ASSETS} from './types'

export const getAssets = (url) => async (dispatch, getState) => {
    try {
        const response = await fetch(`https://frontend-assessment-service.vcomm.io${url}`)
        const resData = (await response.json())

        return dispatch({
            type: GET_ASSETS,
            payload: resData.data
        })
    } catch(e) {
        console.log('e:', e)
        return dispatch({
            type: API_ERROR,
            payload: { message: 'Site error. \r' +
                        'It\'s not you, it\'s us'}
        })
    }
}
