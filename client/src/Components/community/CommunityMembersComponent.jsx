"use client"
import AuthStorage from "@/utils/cookieStorage"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FaUser } from "react-icons/fa"
import { toast} from "react-toastify"

export default function CommunityMembersComponent({ communityId, isAdmin = false }) {
    const authToken = new AuthStorage().getAuth()
    const [state, setState] = useState(null)
    async function fetchCommunityMember() {
        try {
            const api = `${process.env.NEXT_PUBLIC_SERVER_URL}community/list-members?id=${communityId}`
            const first = await fetch(api)
            const second = await first.json()
            const { err, data } = second
            if (err) {
                toast.error(err.msg)
            } else {
                const { msg } = data
                setState(msg)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }
    useEffect(() => {
        fetchCommunityMember()
    }, [])
    async function removeMember(id) {
        const api = `${process.env.NEXT_PUBLIC_SERVER_URL}community/update-members`
        const body = JSON.stringify({
            c_id: communityId,
            user_id: id,
            action: "DEL"
        })
        try {
            const first = await fetch(api, { body, method: "PUT", headers: { "Authorization": `Token ${authToken}`, "Content-Type": "application/json" } })
            const second = await first.json()
            const { err, data } = second
            if (err) {
                toast.error(err.msg)
            } else {
                window.location.reload()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    return <div className="community-members-component">
      
        {state && state.map((elem, index) => {
            const { user: { username, id }, avatar } = elem
            return <div key={index}> <hr className="hr" />  <section className="each-member" >

                <Link href={`/dashboard/user/${id}`}>
                    {avatar ? <></> : <FaUser className="rep-user-icon" />}
                    <div className="info"> <h4>{username}</h4>
                        <small>member</small></div>
                </Link>
                {isAdmin &&
                    <button type="button" onClick={() => removeMember(id)}>Remove</button>}
            </section>
            </div>
        })}
    </div>
}