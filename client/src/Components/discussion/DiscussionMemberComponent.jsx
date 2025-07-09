"use client"
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { toast } from 'react-toastify'
import DefaultImg from "../../../public/Assets/default-user-img.png"
import Image from 'next/image'
import Link from 'next/link'

function DiscussionMemberComponent({ isAdmin, authToken, discussionId, members, communityId }) {
  const membersLen = members?.length ? members.length : 0
  const [show, setShow] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [userId, setUserId] = useState(null)
  async function submitHandler(e) {
    e.preventDefault()
    const api = `${process.env.NEXT_PUBLIC_SERVER_URL}discussion/update-members`
    const body = JSON.stringify({
      c_id: communityId, d_id: discussionId, user_id: userId
    })
    const loader = toast.loading("Loading ...")
    try {
      const first = await fetch(api, { body, method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Token ${authToken}` } })
      const second = await first.json()
      const { data, err } = second

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
  async function searchOnChangeHandler(e) {
    const value = e.target.value
    setSearchValue(value)
    const api = `${process.env.NEXT_PUBLIC_SERVER_URL}/account/profile?username=${value}`
    const loader = toast.loading("Loading ...")
    try {
      const first = await fetch(api)
      const second = await first.json()
      const { data, err } = second
      if (err) {
        toast.update(loader, {
          render: err.msg,
          type: "error",
          isLoading: false,
          autoClose: 1000
        })
        setSearchResult([])
      } else {
        toast.update(loader, {
          render: "",
          type: "success",
          isLoading: false,
          autoClose: 1
        })
        setSearchResult(data.msg.slice(0, 3))
      }
    } catch (error) {
      setSearchResult([])
      toast.update(loader, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 1000
      })
    }
  }
  async function removeMember(userId) {
    const api = `${process.env.NEXT_PUBLIC_SERVER_URL}discussion/update-members`
    const body = JSON.stringify({
      c_id: communityId, d_id: discussionId, user_id: userId, action: "DEL"
    })
    const loader = toast.loading("Loading ...")
    try {
      const first = await fetch(api, { body, method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Token ${authToken}` } })
      const second = await first.json()
      const { data, err } = second

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
    <div className='discussion-member-component'>
      <header>
        <h4>Members ({membersLen})</h4>
        <button onClick={() => setShow(prev => !prev)} type="button"> <FaPlus /> </button>

      </header>

      {/* Member update form */}
      {show &&
        <form onClick={(e) => {
          const elem = document.querySelector('.member-update-form')
          if (elem === e.target) setShow(prev => !prev)
        }} className='member-update-form' onSubmit={submitHandler}>

          <main>
            {/* user search */}
            <label htmlFor="username">username</label>
            <input type="search" name="username" value={searchValue} onChange={searchOnChangeHandler} />
            {/* result display */}
            {/* This will only show when there is searchResult */}
            <div className="search-result-holder">
              {!!searchResult.length && searchResult.map(({ avatar, user: { id, username } }, index) => {
                return <section key={index} onClick={() => setUserId(id)} className='each-user'>
                  {avatar ? <></> : <Image src={DefaultImg} alt="user image" />}
                  <h5> {username} </h5>
                </section>
              })}
            </div>

            {userId &&
              <button type="submit">Add</button>}
          </main>
        </form>
      }

      {/* members list */}
      <div className="members-list">
        {!!membersLen && members.map((elem, index) => <EachMember removeMember={removeMember} isAdmin={isAdmin} {...elem} key={index} />)}
      </div>

    </div>
  )
}


function EachMember({ isAdmin, avatar, user: { username, id }, removeMember }) {
  return <section className='each-member'>
    <hr />
    <Link href={`/dashboard/user/${id}`}>
      {avatar ? <></> : <Image src={DefaultImg} alt="user default image" />}
      <h4> {username} </h4>
    </Link>
    {isAdmin &&
      <button onClick={() => removeMember(id)} type="button">Remove</button>}
  </section>
}

export default DiscussionMemberComponent