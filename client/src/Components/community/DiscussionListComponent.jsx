import Link from 'next/link'
import React from 'react'

function DiscussionListComponent({ data }) {
  return (
    <div className='discussion-list-component'>
      {data?.map(({ id, avatar, title, description }, index) => {

        return <Link className='each-discussion' href={`/dashboard/discussion/${id}?title=${title}`} key={index}>
          <section className='avatar-holder'>
            {avatar ? <></> : <h5> {title[0]} </h5>}
          </section>
          <h4>{title}</h4>
          <p> {description.length >= 27 ? description.slice(0, 25) + " ..." : description} </p>
        </Link>
      })}
    </div>
  )
}

export default DiscussionListComponent