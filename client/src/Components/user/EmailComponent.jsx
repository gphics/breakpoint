import React from 'react'
import EditIconComponent from './EditIconComponent'


function EmailComponent({ email }) {
    // console.log(email)
    return (
        <div className='user-sub-component'>

            <section>
                <div>
                    <h4>Email</h4>
                    <h3>{email}</h3>
                </div>

            </section>
            <EditIconComponent subName='email' />
        </div>
    )
}

export default EmailComponent