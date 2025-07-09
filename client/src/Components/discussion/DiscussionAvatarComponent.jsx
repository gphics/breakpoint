"use client"
import { useState } from 'react'
import DiscussionEditIconComponent from './DiscussionEditIconComponent'

function DiscussionAvatarComponent({ avatar, discussionId, title }) {
  const [show, setShow] = useState(false)
  return (
    <div className='avatar-holder'>
      {avatar ? <></> : <section className='avatar-rep-holder'><h4>{title[0]}</h4></section>}
      <DiscussionEditIconComponent onClickHandler={(e) => setShow(prev => !prev)} />
    </div>
  )
}

export default DiscussionAvatarComponent