import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const Dashboard = () => {

    const navigate = useNavigate();

    const populateDashboard = async () => {
        const req = await fetch('http://localhost:9000/dashboard', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            },
        })
        const data = req.json()
        console.log(data)
    }
    useEffect(() => {

        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/')
        }

        if (token) {
            const user = jwtDecode(token)
            console.log(user);

            if (!user) {

                navigate('/')
            }
        } else {
            populateDashboard()
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <div className='dashboard'>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard!</p>
            <button onClick={handleLogout} typt="button">Logout</button>
        </div>
    )
}

export default Dashboard
