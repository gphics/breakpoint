import CommentCreateComponent from '@/Components/comment/CommentCreateComponent'
import CommentHolder from '@/Components/comment/CommentHolder'
import CommentListComponent from '@/Components/comment/CommentListComponent'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import { MdInfo } from 'react-icons/md'

async function fetchAuthUser(authToken) {
  try {
    const api = `${process.env.SERVER_URL}account/profile`
    const first = await fetch(api, { headers: { "Authorization": `Token ${authToken}` } })
    const second = await first.json()
    return second
  } catch (error) {
    return { data: null, err: { msg: error.message || "something went wrong" } }
  }

}

async function fetchUserPosition(authToken, communityId) {
  try {
    const api = process.env.SERVER_URL + "community/user-position?id=" + communityId
    const first = await fetch(api, { headers: { "Authorization": "Token " + authToken } })
    const second = await first.json()
    console.log(second)
    return second
  } catch (error) {
    return { data: null, err: { msg: error.message || "something went wrong" } }
  }

}

async function fetchDiscussion(discussionId, authToken) {
  const api = `${process.env.SERVER_URL}discussion?d=${discussionId}`
  try {
    const first = await fetch(api, { headers: { "Content-Type": "application/json", "Authorization": `Token ${authToken}` } })
    const second = await first.json()

    return second
  } catch (error) {
    return { data: null, err: { msg: error.message } }
  }
}

async function DiscussionPage({ params, searchParams }) {
  const { title } = await searchParams
  const { id } = await params
  const store = await cookies()
  const auth = store.get("auth")
  const authToken = auth?.value
  let { data, err } = await fetchAuthUser(authToken)
  const userId = data?.msg[0]?.user?.id
  const { data: secondData, err: secondErr } = await fetchDiscussion(id, authToken)
  const communityId = secondData?.msg?.community
  const { data: thirdData, err: thirdErr } = await fetchUserPosition(authToken, communityId)
  const permissibleTypeArr = ["founder", "admin"]
  const isAdmin = permissibleTypeArr.includes(thirdData?.msg?.position) ? true : false
  err = secondErr || err
  err = thirdErr || err
  return (
    <div className='children-holder single-discussion'>
      {err ? <h4> {err.msg} </h4> :
        <>
          <header>
            <h4>{title}</h4>
            <Link href={`/dashboard/discussion/${id}/info`}> <MdInfo /> </Link>
          </header>
          <CommentHolder discussionTitle={title} isAdmin={isAdmin} userId={userId} discussionId={id} authToken={authToken} />
        </>
      }
    </div>
  )
}

export default DiscussionPage