import React, {  useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


const Login = () => {


    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const loginUser = async () => {
    
        const formData = {
            email: email,
            password: password
        }
        const response = await fetch('http://localhost:9000/login', {
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
            
            
            navigate('/dashboard');
            alert('Login successful')

        }
        


    }
    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <h1 className="text-center">Login Form</h1>
                        <form onSubmit={loginUser}>
                            <label>Email:</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                            <br></br>
                            <br></br>
                            <label>Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                            <br></br>
                            <br></br>
                            <div>
                                <a type="Submit" onClick={(e) => loginUser()} > Login</a>
                            </div>
                            <p>Don't have an account?<a href="register" >Register here</a></p>
                        </form>

                    </div>
                </div>
            </div>

        </div >
    )
}

export default Login
