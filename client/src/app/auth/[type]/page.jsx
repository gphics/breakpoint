"use client"
import { useParams } from "next/navigation"
import Img from "../../../../public/Assets/auth.svg"
import Image from "next/image"
import RegisterComponent from "@/Components/auth/RegisterComponent"
import LoginComponent from "@/Components/auth/LoginComponent"
import { useState } from "react"
import LoadingComponent from "@/Components/Others/LoadingComponent"
 
function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  // the authtype can either be reg or log
  const { type: authType } = useParams()
  return (
    <div className="auth-page">
      {isLoading ? <LoadingComponent /> : ""}
      <section className="img-holder">

        <Image src={Img} alt="auth image" />

      </section>

      {authType === "reg" ? <RegisterComponent updateIsLoading={setIsLoading} /> : <LoginComponent updateIsLoading={setIsLoading} />}
    </div>
  )
}

export default AuthPage