"use client"
import LoadingComponent from "@/Components/Others/LoadingComponent"
import { UserProvider } from "./userContext"
import { useReducer } from "react"
import userReducer from "./userReducer"
import UserUpdateComponent from "@/Components/user/UserUpdateComponent"

const initialState = {
    isLoading: false,
    profileData: {
        profile: { address: "", country: "", phone: "" }, user: { first_name: "", last_name: "" },
        avatar: "", email: "", username: ""
    },
    showUpdateComponent: false,
    dataUpdate: {} 
}

function layout({ children }) {
    const [state, dispatch] = useReducer(userReducer, initialState)
    return (
        <UserProvider value={{ state, dispatch }}>
            {state.isLoading ? <LoadingComponent /> : <></>}
            {state.showUpdateComponent ? <UserUpdateComponent /> : <></>}

            {children}
        </UserProvider>)
}

export default layout