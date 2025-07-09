"use client"

import AuthStorage from "@/utils/cookieStorage"
import { useState } from "react"
import { FaRegTrashCan } from "react-icons/fa6"
import { toast } from "react-toastify"

function DiscussionCreateComponent({ toggleShow, communityId }) {
    const authToken = new AuthStorage().getAuth()
    async function submitHandler(e) {
        e.preventDefault()
        const title = document.querySelector(".discussion-title-input").value
        const description = document.querySelector(".discussion-description-input").value
        const body = JSON.stringify({
            title, description, c_id: communityId
        })
        const api = process.env.NEXT_PUBLIC_SERVER_URL + "discussion/"
        const loader = toast.loading("loading ...")
        try {
            const first = await fetch(api, { body, method: "POST", headers: { "Authorization": `Token ${authToken}`, "Content-Type": "application/json" } })
            const second = await first.json()
            const { data, err } = second
            if (err) {
                toast.update(loader, {
                    render: err.msg,
                    type: "error",
                    isLoading: false,
                    autoClose: 1000
                })
            } else {
                window.location.reload()
            }
        } catch (error) {
            toast.update(loader, {
                render: error.message,
                type: "error",
                isLoading: false,
                autoClose: 1000
            })
        }
    }
    return (
        <div className='discussion-create-component' onClick={(e) => {
            const elem = document.querySelector('.discussion-create-component')
            if (elem === e.target) {
                toggleShow(prev => !prev)
            }
        }}>
            <form onSubmit={submitHandler}>
                <label htmlFor="title">Title</label>
                <input required type="text" name="title" className="discussion-title-input" />
                <label htmlFor="desription">Description</label>
                <textarea required name="description" className="discussion-description-input" ></textarea>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default DiscussionCreateComponent
// title, description, c_id