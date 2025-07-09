import DiscussionAvatarComponent from '@/Components/discussion/DiscussionAvatarComponent'
import DiscussionDescriptionComponent from '@/Components/discussion/DiscussionDescriptionComponent'
import DiscussionMemberComponent from '@/Components/discussion/DiscussionMemberComponent'
import DiscussionTitleComponent from '@/Components/discussion/DiscussionTitleComponent'
import { cookies } from 'next/headers'


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
async function fetchDiscussionMembers(authToken, discussionId) {
    const api = `${process.env.SERVER_URL}discussion/list-members?d=${discussionId}`
    try {
        const first = await fetch(api, { headers: { "Content-Type": "application/json", "Authorization": `Token ${authToken}` } })
        const second = await first.json()
        return second
    } catch (error) {
        return { data: null, err: { msg: error.message } }
    }
}


async function fetchAuthUserPosition(authToken, communityId) {
    try {
        const api = `${process.env.SERVER_URL}community/user-position?id=${communityId}`
        const first = await fetch(api, { headers: { "Authorization": `Token ${authToken}` } })
        const second = await first.json()
        return second
    } catch (error) {
        return { data: null, err: { msg: error.message } }
    }
}
async function DiscussionInfo({ params }) {
    const { id } = await params
    const store = await cookies()
    const authToken = store.get("auth")?.value
    let err = null
    // fetching the dicussion details
    let { data: firstData, err: firstErr } = await fetchDiscussion(id, authToken)
    if (firstErr) {
        err = firstErr
    }
    const data = firstData?.msg
    let discussionMembers = []
    // if there is no error, fetch discussion members
    if (data) {
        const { data: secondData, err: secondErr } = await fetchDiscussionMembers(authToken, id)
        if (secondErr) {
            err = secondErr
        } else {
            discussionMembers = secondData?.msg
        }
    }

    // if no errr fetch auth user community position
    let isAdmin = false
    const communityId = data.community
    if (!err) {
        const { data: thirdData, err: thirdErr } = await fetchAuthUserPosition(authToken, communityId)
        if (thirdErr) {
            err = thirdErr
        } else {
            const { msg: { position } } = thirdData
            switch (position) {
                case "member":
                    isAdmin = false
                    break;

                default:
                    isAdmin = true
                    break;
            }
        }
    }
    return (
        <div className='main-content discussion-info'>
            {err ? <h3> {err.msg} </h3> : <>
                <DiscussionAvatarComponent authToken={authToken} discussionId={id} title={data?.title} avatar={data?.avatar} />
                <DiscussionTitleComponent authToken={authToken} discussionId={id} title={data?.title} />
                <DiscussionDescriptionComponent communityId={data.community} isAdmin={isAdmin} authToken={authToken} discussionId={id} description={data?.description} />
                <DiscussionMemberComponent isAdmin = {isAdmin} communityId={data.community} authToken={authToken} discussionId={id} members={discussionMembers} />
            </>}
        </div>
    )
}

export default DiscussionInfo
