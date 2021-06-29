import { API_ERROR, REMOVE_ERROR_DIALOG, GET_ASSETS} from './types'

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

// If error dialog exist remove it upon input focus
export const removeErrorDialog = (e) => (dispatch) =>{
    let inline_style = document.querySelector('div[class="error-dialog"]').style.transform
    
    if (inline_style === 'scale(1)') {
        return dispatch({
            type: REMOVE_ERROR_DIALOG
        })
    }
}

export const util = (e) => {
    let inline_style = document.querySelector('div[class="error-dialog"]').style.transform
    
    return {
        type: 'UTIL'
    }
}