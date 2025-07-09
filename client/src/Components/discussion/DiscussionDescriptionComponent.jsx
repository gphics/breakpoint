"use client"
import { useState } from "react"
import DiscussionEditIconComponent from "./DiscussionEditIconComponent"
import { toast } from "react-toastify"

function DiscussionDescriptionComponent({ isAdmin, authToken, discussionId, description: prev , communityId}) {
  const [show, setShow] = useState(false)
  const [description, setDescription] = useState(prev)
  async function submitHandler(e) {
    e.preventDefault()
    const api = `${process.env.NEXT_PUBLIC_SERVER_URL}discussion/?d=${discussionId}`
    const body = JSON.stringify({ description })
    const loader = toast.loading("Loading ...")
    try {
      const first = await fetch(api, { method: "PUT", body, headers: { "Authorization": `Token ${authToken}`, "Content-Type": "application/json" } })
      const second = await first.json()
      const { err, data } = second

      if (err) {
        toast.update(loader, {
          render: err.msg,
          type: "error",
          isLoading: false,
          autoClose: 1500
        })
      } else {
        window.location.reload()
      }
    } catch (error) {
      toast.update(loader, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 1500
      })
    }
  }
  async function deleteDiscussion() {
    const api = `${process.env.NEXT_PUBLIC_SERVER_URL}discussion/?d=${discussionId}`
    const loader = toast.loading("Loading ...")
    try {
      const first = await fetch(api, { method: "DELETE", headers: { "Content-Type": "application/json", "Authorization": `Token ${authToken}` } })
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
        window.location.replace(`/dashboard/community/${communityId}`)
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
    <div className="description-holder">
      <p> {prev} </p>
      <DiscussionEditIconComponent onClickHandler={() => setShow(prev => !prev)} />
      {show && <form onSubmit={submitHandler} onClick={(e) => {
        const elem = document.querySelector(".discussion-description-form")
        if (elem === e.target) setShow(prev => !prev)
      }} className="discussion-description-form">

        <main>
          <label htmlFor="description">Description</label>
          <textarea name="description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
          <button type="submit">Update</button>
        </main>
      </form>}
      {isAdmin &&
        <button className="del-btn" onClick={deleteDiscussion} type="button">Delete</button>}
    </div>
  )
}

export default DiscussionDescriptionComponent