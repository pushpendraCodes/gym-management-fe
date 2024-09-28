import { configureStore } from "@reduxjs/toolkit"
import memberReducer from "../features/member/MembersSlice"
import gymReducer from "../features/gym/GymSlice"
import authReducer from "../features/Auth/AuthSlice"
const store = configureStore({
    reducer:{
        member : memberReducer,
        gym : gymReducer,
        auth : authReducer,
    }
})

export default store