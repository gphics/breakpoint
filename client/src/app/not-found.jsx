import React from 'react'
import Link from 'next/link'
function NotFound() {
  return (
    <div className="not-found">
      <h3>404 || <span>page not found</span></h3>
      <Link href="/">Bach Home</Link>
    </div>
  )
}

export default NotFound