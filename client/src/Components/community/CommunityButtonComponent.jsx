"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
import LoadingComponent from "../Others/LoadingComponent"

function CommunityButtonComponent({ isAdmin, authToken, communityId, isActive }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const activeClause = isActive ? "Deactivate" : "Activate"
    async function leaveCommunityHandler(e) {
        const status = isAdmin ? "admin" : "member"
        const api = `${process.env.NEXT_PUBLIC_SERVER_URL}community/leave`
        const body = JSON.stringify({ status, c_id: communityId })
        try {
            setIsLoading(true)
            const first = await fetch(api, { body, method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Token ${authToken}` } })
            const second = await first.json()
            setIsLoading(!true)
            const { err } = second
            if (err) {
                toast.error(err.msg)
            } else {
                router.replace("/dashboard")
            }
        } catch (error) {
            setIsLoading(!true)
            toast.error(error.message)
        }
    }
    async function deleteCommunityHandler(e) {
        const api = `${process.env.NEXT_PUBLIC_SERVER_URL}community/?id=${communityId}`
        try {
            setIsLoading(true)
            const first = await fetch(api, { method: "DELETE", headers: { "Content-Type": "application/json", "Authorization": `Token ${authToken}` } })
            const second = await first.json()
            setIsLoading(!true)
            const { err } = second
            if (err) {
                toast.error(err.msg)
            } else {
                router.replace("/dashboard")
            }
        } catch (error) {
            setIsLoading(!true)
            toast.error(error.message)
        }
    }
    async function updateIsActive(e) {
        const api = `${process.env.NEXT_PUBLIC_SERVER_URL}community/update-is-active?id=${communityId}`
        try {
            setIsLoading(!false)
            const first = await fetch(api, { headers: { "Content-Type": "application/json", "Authorization": `Token ${authToken}` } })
            const second = await first.json()
            setIsLoading(false)
            const { err, data } = second
            if (err) {
                toast.error(err.msg)
            } else {
                toast.success(data.msg)
                window.location.reload()
            }
        } catch (error) {
            setIsLoading(false)
            toast.error(error.message)
        }
    }
    return (
        <div className='community-btn-component'>
            {isLoading && <LoadingComponent />}
            <button className="leave" type="button" onClick={leaveCommunityHandler}>Leave Community</button>
            {isAdmin && <>
                <button onClick={updateIsActive} type="button" className="is-active">{activeClause}</button>
                <button className="delete" type="button" onClick={deleteCommunityHandler}>Delete Community</button></>}

        </div>
    )
}

export default CommunityButtonComponent