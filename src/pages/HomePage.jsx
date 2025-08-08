const HomePage = ({ user }) => {
    return (
        <div>
            <h1>Welcome {user?.username}!</h1>
            <p>You are now logged in.</p>
        </div>
    )
}

export default HomePage