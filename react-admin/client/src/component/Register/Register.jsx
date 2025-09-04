import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Register.css'


const Register = () => {

    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

        useEffect(() => {
            const token = localStorage.getItem('token')
            if (token)
                navigate('/banner')
        }, [ navigate])
    
    
    const registerUser = async () => {

        const formData = {
            name: name,
            email: email,
            password: password
        }
        const response = await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
     
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json()

        if (response.ok) {
           localStorage.setItem('token', data.token)
            alert('Registration Successful')
            navigate('/')
            console.log(data)
        }

        else {
            alert('Registration Failed')
        }

        console.log(data)
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className='register'>
                        <h2 className="text-center">Registration</h2>
                        <form>
                            <div className="form-group">
                                <label> Name:</label>
                                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
                            </div>
                            <br></br>
                            <div className="form-group">
                                <label>Email:</label>
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                            </div>
                            <br></br>
                            <div className="form-group">
                                <label>Password:</label>
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                            </div>
                            <br></br>
                            <div align="end">
                                <a type='Submit' onClick={(e) => registerUser()}> Register</a>
                            </div>
                            <div>
                                <p>Already have an account? <a href="/">Login here</a></p>
                            </div>
                        </form>
                        </div>

                    </div>

                </div>
            </div>

        </>
    )
}

export default Register
