"use client"
import AuthStorage from "@/utils/cookieStorage"
import { toast } from "react-toastify"
import { useContext, useEffect } from "react"
import userContext from "./userContext"
import ProfileComponent from "@/Components/user/ProfileComponent"
import UserComponent from "@/Components/user/UserComponent"
import UsernameComponent from "@/Components/user/UsernameComponent"
import EmailComponent from "@/Components/user/EmailComponent"
import AvatarComponent from "@/Components/user/AvatarComponent"
import PasswordDisplayComponent from "@/Components/user/PasswordDisplayComponent"

function UserPage() {
  const { state: { profileData, isLoading }, dispatch } = useContext(userContext)
  const authToken = new AuthStorage().getAuth()
  async function fetchUser() {
    dispatch({ type: "UPDATE_IS_LOADING" })
    const api = process.env.NEXT_PUBLIC_SERVER_URL + "account/profile"
    try {
      const first = await fetch(api, { headers: { "Authorization": `Token ${authToken}` } })
      const second = await first.json()
      dispatch({ type: "UPDATE_IS_LOADING" })
      // This case would never happen as it isn't specified in the api
      if (second.err) {
        toast.error(second.err.msg)
      }
      const { msg } = second.data
      // This case would never happen because I am querying the auth user
      if (!msg.length) {
        toast.error("something went wrong")
      }
      const { address, avatar, country, phone, user: { email, username, first_name, last_name } } = msg[0]
      // console.log(msg[0])
      const data = { profile: { address: address || "", phone:phone || "", country:country || "", }, avatar, email, username, user: { first_name:first_name || "", last_name:last_name || "" } }
      dispatch({ type: "SET_PROFILE", payload: data })
    } catch (error) {
      dispatch({ type: "UPDATE_IS_LOADING" })
      toast.error(error.message)
    }

  }
  useEffect(() => {
    fetchUser()
     
  }, [])
  return (
    <div className="content-holder user-page">
      {isLoading ? <></> : <> 
      <AvatarComponent avatar={profileData.avatar} />
      <UsernameComponent username={profileData.username} />
      <UserComponent {...profileData.user} />
      <EmailComponent email={profileData.email} />
      <ProfileComponent {...profileData.profile} />
        <PasswordDisplayComponent/>
      </>}
    </div>

  )
}

export default UserPage


/**
 * 1. Basic:
 * ---____--- profile
 *  address
 * phone  
 *  country
 * ---____--- user
 * first_name
 * last_name
 * 
 * 2. email
 * 
 * 3. username
 * 
 * 4. password
 */