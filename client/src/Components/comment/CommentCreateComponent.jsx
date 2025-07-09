"use client"
import { MdAttachFile } from "react-icons/md";
import { RiSendPlane2Fill } from "react-icons/ri";
function CommentCreateComponent({ authToken, discussionId }) {
  return (

    <form className='comment-create-component'>
      <textarea name="message" onInput={(e) => {
        const elem = e.target
        elem.style.height = "auto"
        elem.style.height = elem.scrollHeight + "px"
      }} />
      <MdAttachFile className="icon" />
      <button type="submit"><RiSendPlane2Fill className="icon" /></button>
    </form>

  )
}

export default CommentCreateComponent