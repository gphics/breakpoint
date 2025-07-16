import Link from "next/link"
function CommentListComponent({ authToken, discussionId, allComments, userId }) {

  return (
    <div className="all-comments">
      {allComments.length ? allComments.map((elem) => {

        return <SingleComment userId={userId} key={elem.id} data={elem} />
      }) : <h3 className="empty-discussion">Discussion is empty</h3>}
    </div>
  )
  // return (
  //   <div className="all-comments">
  //     {allComments.length ? allComments.map((elem, index) => {
  //       const rand = Math.ceil(Math.random() * (index + 1))
  //       return <SingleComment userId={userId} key={(elem.id +1)* rand} data={elem} />
  //     }) : <h3 className="empty-discussion">Discussion is empty</h3>}
  //   </div>
  // )
}

export default CommentListComponent

function SingleComment({ data, userId }) {
  const { author: { username, id }, content, created_at } = data
  const isUser = userId === id

  return <div id={"comment-" + data?.id} className={isUser ? "comment" + " mine" : "comment"}>
    <Link href={`/dashboard/user/${id}`}> {isUser ? "You" : username} </Link>
    <p> {content} </p>
    {/* <hr /> */}
    <small>  {new Date(created_at).toLocaleDateString()} </small>
  </div>
}