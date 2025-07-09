"use client"
import Image from "next/image"
import DefaultImg from "../../../public/Assets/default-user-img.png"
import { useState } from "react"
import { toast} from "react-toastify"


function AddMemberComponent({ memberLength, authToken, communityId, isAdmin }) {

    const [isLoading, setIsLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [userId, setUserId] = useState(null)
    const [searchResult, setSearchResult] = useState([])
    const [searchValue, setSearchValue] = useState("")
    async function submitHandler(e) {
        e.preventDefault()
        const selectInput = document.querySelector(".user-status")
        const status = selectInput.value + "s"
        const btn = document.querySelector(".submit-btn")
        const searchInput = document.querySelector(".username-search")
        // disabling the component
        const elemArr = [selectInput, btn, searchInput].forEach(elem => {
            elem.disabled = true
            elem.classList.toggle("disabled")
        })
        try {
            const api = `${process.env.NEXT_PUBLIC_SERVER_URL}community/update-${status}`
            const body = JSON.stringify({ c_id: communityId, user_id: userId })
            const first = await fetch(api, { body, method: "put", headers: { "Content-Type": "application/json", "Authorization": `Token ${authToken}` } })
            const second = await first.json()
            setShow(false)
            const { err, data } = second
            if (err) {
                toast.error(err.msg)
            } else {``
                window.location.reload()
            }
        } catch (error) {
            setShow(false)
            toast.error(error.message)
        }
    }
    async function searchOnChangeHandler(e) {
        const { value } = e.target
        setSearchValue(value)
        const api = `${process.env.NEXT_PUBLIC_SERVER_URL}/account/profile?username=${value}`
        try {
            setIsLoading(true)
            const first = await fetch(api)
            const second = await first.json()
            setIsLoading(!true)
            const { data, err } = second
            if (err) {
                setSearchResult([])
            } else {
                setIsLoading(!true)
                setSearchResult(data.msg.slice(0, 3))
            }
        } catch (error) {
            setSearchResult([])
            toast.error(error.message)
        }
    }
    return (
        <div className='add-member-component'>
            {!show &&
                <section className="intro">
                    <h4>Members ({memberLength})</h4>
                    {isAdmin && <button onClick={() => setShow(true)} type="button">Add member</button>}
                 
                </section>
            }
       
            {show &&
                <form className="member-update-form" onClick={(e) => {
                    const elem = document.querySelector(".member-update-form")
                    if (e.target === elem) {
                        setShow(false)
                        setUserId(null)
                    } 
                }} onSubmit={submitHandler}>
                    <main>
                        <label htmlFor="username-search">Username</label>
                        <input className="username-search" value={searchValue} onChange={searchOnChangeHandler} placeholder="username ..." type="search" name="username-search"  />
                        {searchValue && isLoading ? <h4>searching ...</h4> :
                            <div className="search-result">
                                {searchResult.length ? searchResult.map((elem, index) => {
                                    const { avatar, user: { username, id } } = elem
                                    return <section key={index} onClick={() => {
                                        setUserId(id)
                                        // setSearchValue("")
                                        setSearchResult([elem])
                                    }}>
                                        {avatar ? <></> : <Image className="user-img" alt="user avatar" src={DefaultImg} />}
                                        <h4>{username}</h4>
                                    </section>
                                }) : <h5>No result found</h5>}
                            </div>}
                        {userId && <>
                            <label htmlFor="status">Status</label>
                            <select defaultValue="member" className="user-status" name="status" id="">
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button className="submit-btn" type="submit">Submit</button>  </>}
                    </main>

                </form>
            }
        </div>
    )
}

export default AddMemberComponent