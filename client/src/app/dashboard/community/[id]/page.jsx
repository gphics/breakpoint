import DiscussionHeaderComponent from '@/Components/community/DiscussionHeaderComponent'
import DiscussionListComponent from '@/Components/community/DiscussionListComponent'
import { cookies } from 'next/headers'


async function fetchDiscussions(communityId, authToken) {

  const api = process.env.SERVER_URL + `discussion?c=${communityId}`
  try {
    const first = await fetch(api, { headers: { "Authorization": `Token ${authToken}` } })
    const second = await first.json()
    return second
  } catch (error) {
    return { data: null, err: { msg: error.message } }
  }
}


async function CommunityPage({ params, searchParams }) {
  const { name: communityName } = await searchParams
  const { id } = await params
  const store = await cookies()
  const { value: authToken } = store.get("auth")
  const { err, data } = await fetchDiscussions(id, authToken)

  return (
    <div className='main-content community-page'>

      <DiscussionHeaderComponent communityName={communityName} communityId={id} />
      {err && <h4>{err.msg}</h4>}
      {!err && !data?.msg.length ? <h4>No discussion</h4> :
        <DiscussionListComponent data={data?.msg} communityId={id} />}
    </div>
  )
}

export default CommunityPage