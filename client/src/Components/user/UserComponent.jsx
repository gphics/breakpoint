import EditIconComponent from "./EditIconComponent"


function UserComponent({ first_name, last_name }) {
    return (
        <div className='user-sub-component'>
            <section>
 
                <div>
                    <h4>  Firstname</h4>
                    <h3> {first_name} </h3>
                </div>
                <div>
                    <h4> Lastname </h4>
                    <h3> {last_name} </h3>
                </div>

            </section>

            <EditIconComponent subName='user' />
        </div>
    )
}

export default UserComponent