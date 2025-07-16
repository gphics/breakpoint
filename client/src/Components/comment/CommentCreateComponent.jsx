"use client"
import { useEffect, useRef, useState } from "react";
import { MdAttachFile } from "react-icons/md";
import { RiSendPlane2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
// import { io } from "socket.io-client";
function CommentCreateComponent({ authToken, discussionId, sendComment, isAdmin, discussionTitle }) {
  const [commentContent, setCommentContent] = useState("")
  const discussionSocket = useRef(null)
  const [showState, setShowState] = useState(true)
  // function initSocket() {
  //   try {
  //     console.log("Initializing ws")

  //     const api = process.env.NEXT_PUBLIC_SERVER_URL
  //     // const api = `${process.env.NEXT_PUBLIC_SERVER_URL}ws/discussion/${discussionId}/?token=${authToken}`

  //     // console.log(api)
  //     // const api = `ws://${process.env.NEXT_PUBLIC_SERVER_URL}ws/discussion/${discussionId}?token=${authToken}`
  //     const sc = io(api, {
  //       path: `/ws/discussion/${discussionId}/`,
  //       query: {
  //         token: authToken
  //       }
  //     })

  //     discussionSocket.current = sc
  //     discussionSocket.current.on("connect", e => {
  //       console.log(e)
  //       console.log("websocket connected")
  //     })
  //     discussionSocket.current.on("disconnect", e => {
  //       console.log(e)
  //       console.log("something went wrong")
  //     })

  //     discussionSocket.current.on("message", e => {
  //       const res = JSON.parse(e.data)
  //       console.log(res)
  //     })

  //   } catch (error) {
  //     console.log(error)
  //   }

  // }
  function connectSocket() {
    const api = `${process.env.NEXT_PUBLIC_SERVER_URL}ws/discussion/${discussionId}/?token=${authToken}`

    const sc = new WebSocket(api)
    discussionSocket.current = sc
    sc.onopen = e => {
      // console.log(e)
      console.log("connection opened")
    }
    sc.onclose = e => {
      // do nothing
    }
    sc.onmessage = e => {
      const res = JSON.parse(e.data)
      const { err, data } = res
      if (err) {
        toast.error(err.msg)
      } else {
        sendComment(data)
      }

    }
  }
  function submitHandler(e) {
    try {
      e.preventDefault()
      const loader = toast.loading("sending ...")
      const data = JSON.stringify({ content: commentContent, discussion: discussionId })
      discussionSocket.current.send(data)
      setCommentContent("")
      toast.update(loader, {
        render: "done",
        isLoading: false,
        autoClose: 1500,
        type: "success"
      })
    } catch (error) {
      toast.error(error.message || "something went wrong")
      window.location.reload()
    }

  }
  function updateShowState() {
    if (discussionTitle === "Announcement") {
      if (isAdmin) {
        setShowState(true)
      } else {
        setShowState(false)
      }
    }
  }
  useEffect(() => {
    // initSocket()
    connectSocket()
    updateShowState()
  }, [])
  return showState ? (
    <form onSubmit={submitHandler} className='comment-create-component'>
      <textarea value={commentContent} className="comment-content" name="message" onInput={(e) => {
        setCommentContent(e.target.value)
        const elem = e.target
        elem.style.height = "auto"
        elem.style.height = elem.scrollHeight + "px"
      }} />
      {/* <MdAttachFile className="icon" /> */}
      <button type="submit"><RiSendPlane2Fill className="icon" /></button>
    </form>

  )
    : <></>
}
export default CommentCreateComponent