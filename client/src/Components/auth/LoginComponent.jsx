"use client"
import AuthStorage from '@/utils/cookieStorage'
import Link from 'next/link'
import { toast } from 'react-toastify'
import BasicInputComponent from "../Others/BasicInputComponent"
import PasswordInputComponent from "../Others/PasswordInputComponent";
PasswordInputComponent
import { FaUser } from "react-icons/fa6";
import { useRouter } from 'next/navigation'

function LoginComponent({ updateIsLoading }) {
  const router = useRouter()
  async function formSubmit() {
    updateIsLoading(true)
    const username = document.querySelector(".username-input").value
    const password = document.querySelector(".password-input").value
    try {
      const api = process.env.NEXT_PUBLIC_SERVER_URL + "account/login"
      const first = await fetch(api, { method: "post", body: JSON.stringify({ username, password }), headers: { "Content-Type": "application/json" } })
      const second = await first.json()
      updateIsLoading(false)
      const { err, data } = second
      if (err) {
        toast.error(err.msg)
      } else {
        const token = data.msg.token
        new AuthStorage().setAuth(token)
        router.replace("/dashboard")
      }
    } catch (error) {
      updateIsLoading(false)
      toast.error(error.message)
    }

  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      formSubmit()
    }}>

      <BasicInputComponent name="username" type="text" inputClass="username-input" Icon={FaUser} />
      <PasswordInputComponent inputClass='password-input' name="password" />
      <button type="submit">Login</button>
      <p>Don't have an account ? <Link href="/auth/reg">create one</Link></p>
    </form>
  )

}

export default LoginComponent