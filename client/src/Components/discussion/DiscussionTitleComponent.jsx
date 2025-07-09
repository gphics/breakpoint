"use client"
import { useState } from 'react'
import DiscussionEditIconComponent from './DiscussionEditIconComponent'
import { toast } from 'react-toastify'

function DiscussionTitleComponent({ title: prev, discussionId, authToken }) {
  const [title, setTitle] = useState(prev)
  const [show, setShow] = useState(false)
  async function submitHandler(e) {
    e.preventDefault()
    const api = `${process.env.NEXT_PUBLIC_SERVER_URL}discussion/?d=${discussionId}`
    const body = JSON.stringify({ title })
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
  return (
    <div className='title-holder'>
      <h4> {prev} </h4>
      <DiscussionEditIconComponent onClickHandler={() => setShow(prev => !prev)} />
      {show &&
        <form onClick={(e) => {
          const elem = document.querySelector('.title-update-form')
          if (elem === e.target) {
            setShow(prev => !prev)
          }
        }} className='title-update-form' onSubmit={submitHandler}>
          <main>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" value={title} onChange={(e => setTitle(e.target.value))} />
            <button type="submit">Update</button>
          </main>
        </form>
      }
    </div>
  )
}

export default DiscussionTitleComponent