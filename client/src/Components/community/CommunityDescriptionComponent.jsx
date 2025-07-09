"use client"
import { useState } from "react"
import { FaEdit } from "react-icons/fa"
import { toast} from "react-toastify"

function CommunityDescriptionComponent({ description: prevDescription, isAdmin, authToken, communityId }) {
    const [isLoading, setIsLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [description, setDescription] = useState(prevDescription,)

    async function submitHandler(e) {
        e.preventDefault()
        const body = JSON.stringify({ c_id: communityId, description })
        const api = `${process.env.NEXT_PUBLIC_SERVER_URL}community/update-description`
        try {
            setIsLoading(true)
            const first = await fetch(api, { body, method: "PUT", headers: { "Authorization": `Token ${authToken}`, "Content-Type":"application/json" } })
            const second = await first.json()
            setIsLoading(false)
            const { data, err } = second
            if (err) {
                toast.error(err.msg)
            } else {
                console.log(data)
                // window.location.reload()
            }
        } catch (error) {
            setIsLoading(false)
            toast.error(error.message)
        }
    }
    return <div className="description-holder">
    
        <p>{prevDescription}</p>
        {isAdmin && <FaEdit className="edit-icon" onClick={() => setShow(prev => !prev)} />}
        {show && <form onClick={(e) => {
            const elem = document.querySelector(".community-update-form")
            if (e.target === elem) {
                setShow(false)
            }
        }} onSubmit={submitHandler} className="community-update-form">
            {isLoading ? <h3>Loading ...</h3> :
                <main>
                    <label htmlFor="description">Description</label>
                    <textarea name="description" onChange={(e) => {
                        setDescription(e.target.value)
                    }} value={description} />
                    <button type="submit">Update</button>
                </main>
            }
        </form>}
    </div>
}

export default CommunityDescriptionComponent