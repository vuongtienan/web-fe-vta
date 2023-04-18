import * as ActionTypes from './actions/config'
var initState = {
    logged: localStorage.getItem('logged'),
    user: {
        firstName: localStorage.getItem('firstName'),
        lastName: localStorage.getItem('lastName'),
        userId: localStorage.getItem('userId'),
        userImage: localStorage.getItem('userImage'),
        userBio: localStorage.getItem('userBio')
    },
    loading: false
}

const reducer = (state = initState, action) => {
    // if(action.type === ActionTypes.UPDATE_USER) {
    //     const { firstName, lastName, logged, _id, avatar } = action.payload
    //     return {
    //         ...state,
    //         user: {
    //             firstName,
    //             lastName,
    //             _id,
    //         },
    //         logged
    //     }
    // }
    if(action.type === ActionTypes.GET_USERINFO) {
        const userId = localStorage.getItem('userId')
        const logged = localStorage.getItem('logged')
        const firstName = localStorage.getItem('firstName')
        const lastName = localStorage.getItem('lastName')
        const userImage = localStorage.getItem('userImage')
        const userBio = localStorage.getItem('userBio')
        const role = localStorage.getItem('role')

        return {
            ...state,
            user: {
                firstName,
                lastName,
                userId,
                userImage,
                userBio,
                role
            },
            logged
        }
    }
    if(action.type === ActionTypes.TOGGLE_LOADING) {
        const { loading } = state
        return {
            ...state,
            loading: action.payload
        }
    }
    return state
}

export default reducer