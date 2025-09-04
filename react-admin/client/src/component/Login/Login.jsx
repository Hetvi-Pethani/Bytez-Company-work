import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Login.css'

const Login = () => {


    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token)
            navigate('/banner')
    }, [ navigate])


const loginUser = async () => {

    const formData = {
        email: email,
        password: password
    }
    const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })

    const data = await response.json()
    console.log(data)

    if (response.ok) {
        localStorage.setItem('token', data.token)
        navigate('/banner');
        alert('Login successful')
    }
}

return (
    <div className="container">
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <div className="login">
                    <form onSubmit={loginUser}>
                        <h2 className="text-center">Login page</h2>

                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                        </div>
                        <br></br>
                        <div className="form-group">
                            <label> Password:</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                        </div>
                        <br />
                        <div align="end">
                            <a type="Submit" onClick={(e) => loginUser()}> Login</a>
                        </div>
                        <p>Don't have an account?<a href="register" >Register here</a></p>

                    </form>

                </div>
            </div>
        </div>
    </div>
)
}

export default Login;
