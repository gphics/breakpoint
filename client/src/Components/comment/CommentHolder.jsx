"use client"
import { useEffect, useState } from "react"
import CommentCreateComponent from "./CommentCreateComponent"
import CommentListComponent from "./CommentListComponent"
import { toast } from "react-toastify"

function CommentHolder({ authToken, discussionId, userId, isAdmin, discussionTitle }) {
    const [allComments, setAllComments] = useState([])
    async function fetchComments() {
        const api = `${process.env.NEXT_PUBLIC_SERVER_URL}supports/comment?d=${discussionId}`
        const first = await fetch(api, { headers: { "Authorization": `Token ${authToken}` } })
        const second = await first.json()
        const { err, data } = second
        if (err) {
            toast.error(err.msg)
        } else {
            updateAllComments(data)
        }
    }
    function updateAllComments(data) {
        const { msg } = data
        const isArray = Array.isArray(msg)
        setAllComments(prev => {
            const prevType = typeof (prev)
            if (prevType === "object") {
                if (isArray) {
                    return [...prev, ...msg]
                } else {
                    return [...prev, msg]
                }
            } else {
                return isArray ? [...msg] : [msg]
            }
        })
    }
    useEffect(() => {
        fetchComments()
    }, [])
    return (
        <>
            <CommentListComponent userId={userId} allComments={allComments} discussionId={discussionId} authToken={authToken} />
            <CommentCreateComponent discussionTitle={discussionTitle} isAdmin={isAdmin} sendComment={updateAllComments} discussionId={discussionId} authToken={authToken} />
        </>
    )
}

export default CommentHolder