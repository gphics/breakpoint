"use client"
import Link from 'next/link'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { MdInfo } from 'react-icons/md'
import DiscussionCreateComponent from './DiscussionCreateComponent'


function DiscussionHeaderComponent({ communityId, communityName }) {
    const [show, setShow] = useState(false)
    return (
        <>
            <header>
                <section className="first">
                    <h4> {communityName} </h4>
                    <Link href={`/dashboard/community/${communityId}/info`}> <MdInfo className='icon' /></Link>
                </section>
                <section className="second">
                    <h4>Discussions</h4>
                    <button type="button" onClick={() => { setShow(prev => !prev) }}> <FaPlus /> </button>
                </section>
            </header>
            {show &&
                <DiscussionCreateComponent communityId={communityId} toggleShow={setShow} />}
        </>
    )
}

export default DiscussionHeaderComponent