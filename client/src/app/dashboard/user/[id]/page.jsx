
async function fetchUser(userId) {
  try {
    const api = `${process.env.SERVER_URL}account/profile?id=${userId}`
    const first = await fetch(api)
    const second = await first.json()
    return second
  } catch (error) {
    return { data: null, err: { msg: error.message || "something went wrong" } }
  }
}

async function RandomUserPage({ params }) {
  const { id } = await params
  const res = await fetchUser(id)
  const { data, err } = res
  return (
    <div className="random-user-page">
      {err ? <h4>{err.msg}</h4> : <DetailComponent {...data.msg} />}
    </div>
  )
}

export default RandomUserPage

function DetailComponent({ address, country, phone, user: { first_name, last_name, username } }) {
  return <>

    <section className="user-info">
      {username &&
        <div>
          <h5>username</h5>
          <h4>{username}</h4>
        </div>
      }
      {first_name &&
        <div>
          <h5>Firstname</h5>
          <h4>{first_name}</h4>
        </div>
      }
      {last_name &&
        <div>
          <h5>Lastname</h5>
          <h4>{last_name}</h4>
        </div>
      }

    </section>
    <section className="location-info">

      {country &&
        <div>
          <h5>Country</h5>
          <h4>{country}</h4>
        </div>
      }
      {address &&
        <div>
          <h5>Address</h5>
          <h4>{address}</h4>
        </div>
      }
      {phone &&
        <div>
          <h5>Phone</h5>
          <h4>{phone}</h4>
        </div>
      }
    </section>
  </>
}

// profile :{address, country, phone, user:{first_name, last_name,username}}