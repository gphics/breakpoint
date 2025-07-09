"use client"
import AuthStorage from "@/utils/cookieStorage"
import Link from "next/link"
import { toast } from "react-toastify"
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import BasicInputComponent from "../Others/BasicInputComponent"
import PasswordInputComponent from "../Others/PasswordInputComponent";
import { useRouter } from "next/navigation";


function RegisterComponent({ updateIsLoading }) {
    const router = useRouter()
    async function formSubmit() {
        updateIsLoading(true)
        const username = document.querySelector(".username-input").value
        const email = document.querySelector(".email-input").value
        const password = document.querySelector(".password-input").value
        try {
            const api = process.env.NEXT_PUBLIC_SERVER_URL + "account/reg"
            const first = await fetch(api, { method: "post", body: JSON.stringify({ username, email, password }), headers: { "Content-Type": "application/json" } })
            const second = await first.json()
            updateIsLoading(false)
            const { err, data } = second
            if (err) {
                toast.error(err.msg)
            } else {
                const token = data.msg.token
                new AuthStorage().setAuth(token)
                router.push("/dashboard")
            }
        } catch (error) {
            updateIsLoading(false)
            toast.error(error.message)
        }

    }
    const inputArr = [
        { name: "username", type: "text", inputClass: "username-input", Icon: FaUser },
        { name: "email", type: "email", inputClass: "email-input", Icon: MdEmail },
    ]
    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            formSubmit()
        }}>
            {inputArr.map((elem, index) => <BasicInputComponent key={index} {...elem} />)}
            <PasswordInputComponent name="password" inputClass="password-input"/>
            <button type="submit">Register</button>
            <p>Already have an account ? <Link href="/auth/log">sign in</Link></p>
        </form>
    )
}

export default RegisterComponent
