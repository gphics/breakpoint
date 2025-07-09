"use client"
import Link from "next/link"
import { useState } from "react"
import { FaEdit } from "react-icons/fa"
import { toast, ToastContainer } from "react-toastify"

function CommunityNameComponent({ isAdmin, name, authToken, communityId }) {
    const [isLoading, setIsLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [inputValue, setInputvalue] = useState({ old_name: name, new_name: "" })
    function onChangeHandler(e) {
        const { name, value } = e.target
        setInputvalue(prev => ({ ...prev, [name]: value }))
    }
    async function submitHandler(e) {
        e.preventDefault()
        const body = JSON.stringify(inputValue)
        const api = `${process.env.NEXT_PUBLIC_SERVER_URL}community/update-name`
        try {
            setIsLoading(true)
            const first = await fetch(api, { body, method: "PUT", headers: { "Authorization": `Token ${authToken}`, "Content-Type": "application/json" } })
            const second = await first.json()
            setIsLoading(false)
            const { data, err } = second
            if (err) {
                toast.error(err.msg)
            } else {
                window.location.reload()
            }
        } catch (error) {
            setIsLoading(false)
            toast.error(error.message)
        }
    }
    return (
        <div className='name-holder'>
            <Link href={`/dashboard/community/${communityId}`}> <h3>{name}</h3> </Link>
            
            {isAdmin && <FaEdit onClick={() => setShow(prev => !prev)} className="edit-icon" />}
            {show && <form onClick={(e) => {
                const elem = document.querySelector(".community-update-form")
                if (e.target === elem) {
                    setShow(false)
                }
            }} onSubmit={submitHandler} className="community-update-form">
                {isLoading ? <h3>Loading ...</h3> :
                    <main>
                        <label htmlFor="old_name">Old Name</label>
                        <input onChange={onChangeHandler} value={inputValue.old_name} type="text" name="old_name" />
                        <label htmlFor="new_name">New Name</label>
                        <input onChange={onChangeHandler} value={inputValue.new_name} type="text" name="new_name" />
                        <button type="submit">Update</button>
                    </main>
                }
            </form>}
        </div>
    )
}

export default CommunityNameComponent