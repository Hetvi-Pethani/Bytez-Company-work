
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


const Register = () => {

    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    

    const registerUser = async () => {

        const formData = {
            name: name,
            email: email,
            password: password
        }
        const response = await fetch('http://localhost:9000/register', {
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
                        <h1 className="text-center">Registration Form</h1>
                        <form>
                            <div className="form-group">
                                <label>Full Name:</label>
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
                            <div>
                                <a type='Submit' onClick={(e) => registerUser()}> Register</a>
                            </div>
                        </form>

                    </div>

                </div>
            </div>

        </>
    )
}

export default Register
