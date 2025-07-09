import CommentCreateComponent from '@/Components/comment/CommentCreateComponent'
import CommentListComponent from '@/Components/comment/CommentListComponent'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { MdInfo } from 'react-icons/md'

async function fetchComments(discussionId, authToken) {

}


async function DiscussionPage({ params, searchParams }) {
  const { title } = await searchParams
  const { id } = await params
  const store = await cookies()
  const auth = store.get("auth")
  const authToken = auth?.value

  return (
    <div className='children-holder single-discussion'>
      <header>
        <section className="intro">
          <h4>{title}</h4>
          <Link href={`/dashboard/discussion/${id}/info`}> <MdInfo /> </Link>
        </section>
      </header>
      <CommentListComponent discussionId={id} authToken={authToken} />
      <CommentCreateComponent discussionId={id} authToken={authToken} />
    </div>
  )
}

export default DiscussionPage