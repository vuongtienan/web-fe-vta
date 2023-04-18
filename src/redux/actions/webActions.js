import * as ActionTypes from './config'

// export const updateUserInfo = (payload) => ({
//   type: ActionTypes.UPDATE_USER,
//   payload
// })

export const getUserInfo = () => ({
  type: ActionTypes.GET_USERINFO
})

export const toggleLoading = (payload) => ({
  type: ActionTypes.TOGGLE_LOADING,
  payload
})