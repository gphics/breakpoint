import userContext from '@/app/dashboard/user/userContext'
import React, { useContext} from 'react'
import { FaUser } from 'react-icons/fa6'
import { MdLocationCity, MdLocationOn, MdMail,  MdPhone } from 'react-icons/md'
import AdvanceInputComponent from '../Others/AdvanceInputComponent'
import PasswordInputComponent from '../Others/PasswordInputComponent'
import { FaUserAlt } from "react-icons/fa"
import AuthStorage from '@/utils/cookieStorage'
import { toast } from 'react-toastify'
function UserUpdateComponent() {

  const authToken = new AuthStorage().getAuth()
  const { dispatch, state: { dataUpdate } } = useContext(userContext)
  function closeModal(e) {
    const elem = document.querySelector('.user-update-component')
    if (e.target === elem) {
      dispatch({ type: "SET_SHOW_UPDATE_COMPONENT" })
    }

  }
  function onChangeHandler(e) {
    const { value, name } = e.target
    dispatch({ type: "UPDATE_PROFILE_DATA", payload: { name, value } })
  }
  const iconObj = {
    username: FaUser,
    first_name: FaUserAlt,
    last_name: FaUserAlt,
    email: MdMail,
    address: MdLocationCity,
    country: MdLocationOn,
    phone: MdPhone
  }
  async function submitHandler(e) {
    e.preventDefault()
    let api = process.env.NEXT_PUBLIC_SERVER_URL + "account/"
    const { type: updateType, ...data } = dataUpdate
    let body = data
    switch (updateType) {
      case "email":
        api = api + "email-update"
        break;
      case "username":
        api = api + "username-update"
        break;
      case "password":
        api = api + "password-update"
        break;
      case "avatar":
        api = api + "avatar-update"
        break;
      default:
        api = api + "basic-update"
        if (updateType === "profile") {
          body = { profile: data }
        } else {
          body = { user: data }
        }

    }
    try {
      dispatch({ type: "UPDATE_IS_LOADING" })
      const first = await fetch(api, {
        body: JSON.stringify(body),
        method: "PUT",
        headers: { "Authorization": `Token ${authToken}`, "Content-Type": "application/json" }
      })
      const second = await first.json()
      dispatch({ type: "UPDATE_IS_LOADING" })
      const { data, err } = second
      if (err) {
        toast.error(err.msg)
      } else {
        toast.success(data.msg)
        window.location.reload()
      }
    } catch (error) {
      dispatch({ type: "UPDATE_IS_LOADING" })
      toast.error(error.message)
    }


  }
  const { type: updateType, ...obj } = dataUpdate
  const formArr = Object.entries(obj).map(([key, value]) => ({ value, name: key, type: key !== "email" ? "text" : "email", Icon: iconObj[key], onChangeHandler }))
  return (
    <div className='user-update-component' onClick={closeModal}>
      <form onSubmit={submitHandler} className='user-update-form'>
        <h4>{updateType} Update Form</h4>
        {/* if updateType is password */}
        {updateType === "password" ? formArr.map((elem, key) => <PasswordInputComponent key={key} {...elem} />) : <></>}
        {updateType === "avatar" ? <h2>Welcome here</h2> : <></>}
        {/* if updateType is neither password nor avatar */}
        {updateType !== "password" && updateType !== "avatar" && formArr.map((elem, index) => <AdvanceInputComponent key={index} {...elem} />)}
        <button type="submit">Update</button>
      </form>
    </div>
  )
}

export default UserUpdateComponent

// const a = { x: 1, y: 2, z: 3 }
// for (const [key, value] of Object.entries(a)) {
//   console.log(key)
// }