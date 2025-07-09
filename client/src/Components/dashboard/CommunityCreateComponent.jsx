"use client"

import AuthStorage from "@/utils/cookieStorage"

import { toast } from "react-toastify"

function CommunityCreateComponent({ setIsLoading, toggleHandler }) {

    const authToken = new AuthStorage().getAuth()
    async function submitHandler(e) {
        e.preventDefault()
        const name = document.querySelector(".name-input").value
        const description = document.querySelector(".description-area-input").value
        const api = process.env.NEXT_PUBLIC_SERVER_URL + "community/"

        try {
            setIsLoading(prev => !prev)
            const first = await fetch(api, { method: "post", body: JSON.stringify({ name, description }), headers: { "Authorization": `Token ${authToken}`, "Content-Type": "application/json" } })
            const second = await first.json()
            setIsLoading(prev => !prev)
            const { data, err } = second
            if (err) {
                toast.error(err.msg)
            } else {
                toast.success(data.msg)
                window.location.reload()
            }
        } catch (error) {
            setIsLoading(prev => !prev)
            toast.error(error.message)
        }


    }

    return (
        <div onClick={(e) => {

            const elem = document.querySelector(".community-create-component")
            if (elem === e.target) {
                toggleHandler(prev => !prev)
             
            }
        }} className='community-create-component'>
            <form onSubmit={submitHandler}>

                <div>
                    <label htmlFor="name">Name</label>
                    <input required type="text" name="name" className='name-input' />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea required name="description" className='description-area-input'></textarea>
                </div>
                <button type="submit">Create</button>

            </form>

        </div>
    )
}

export default CommunityCreateComponent