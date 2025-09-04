import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Register.css'
import { toast } from 'react-toastify'

const Register = () => {

    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token)
            navigate('/')
    }, [])


    const registerUser = async () => {

        if (email === '' || password === '' || name === '') {
            toast.error("Invalid credentials!")
            return
        }

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
            localStorage.setItem('token', data.token);
            toast.success("Register successfull!")
            navigate('/');
        }
        else {
            toast.error('Registration Failed')
        }
    }

    return (
        <> {/* [Head] start */}
            <title>Home | Mantis Bootstrap 5 Admin Template</title>
            {/* [Meta] */}
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="description" content="Mantis is made using Bootstrap 5 design framework. Download the free admin template & use it for your project." />
            <meta name="keywords" content="Mantis, Dashboard UI Kit, Bootstrap 5, Admin Template, Admin Dashboard, CRM, CMS, Bootstrap Admin Template" />
            <meta name="author" content="CodedThemes" />
            {/* [Favicon] icon */}
            <link rel="icon" href="../assets/images/favicon.svg" type="image/x-icon" /> {/* [Google Font] Family */}
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" id="main-font-link" />
            {/* [Tabler Icons] https://tablericons.com */}
            <link rel="stylesheet" href="../assets/fonts/tabler-icons.min.css" />
            {/* [Tabler Icons] https://boxicon.com */}
            <link href="https://unpkg.com/boxicons/css/boxicons.min.css" rel="stylesheet" />
            {/* [Feather Icons] https://feathericons.com */}
            <link rel="stylesheet" href="../assets/fonts/feather.css" />
            {/* [Font Awesome Icons] https://fontawesome.com/icons */}
            <link rel="stylesheet" href="../assets/fonts/fontawesome.css" />
            {/* [Material Icons] https://fonts.google.com/icons */}
            <link rel="stylesheet" href="../assets/fonts/material.css" />
            {/* [Template CSS Files] */}
            <link rel="stylesheet" href="../assets/css/style.css" id="main-style-link" />
            <link rel="stylesheet" href="../assets/css/style-preset.css" />
            {/* [Head] end */}


            <div>
                {/* [ Pre-loader ] start */}
                <div className="loader-bg">
                    <div className="loader-track">
                        <div className="loader-fill" />
                    </div>
                </div>
                {/* [ Pre-loader ] End */}
                <div className="auth-main">
                    <div className="auth-wrapper v3">
                        <div className="auth-form">
                            <div className="auth-header">
                                <a href="#"><img src="../assets/images/logo-dark.svg" alt="img" /></a>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); registerUser(); }}>
                                <div className="card my-5">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-end mb-4">
                                            <h3 className="mb-0"><b>Sign up</b></h3>
                                            <a href="/" className="link-primary">Already have an account?</a>
                                        </div>

                                        <div className="form-group mb-3">
                                            <label className="form-label">Name</label>
                                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Your Name" required />
                                        </div>

                                        <div className="form-group mb-3">
                                            <label className="form-label">Email Address</label>
                                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Your Email Address" required />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="form-label">Password</label>
                                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Your Password" required />
                                        </div>
                                        <p className="mt-4 text-sm text-muted">By Signing up, you agree to our <a href="#" className="text-primary"> Terms of Service </a> and <a href="#" className="text-primary"> Privacy Policy</a></p>
                                        <div className="d-grid mt-3">

                                            <button type="submit" className='register-link btn btn-primary' >
                                                Create Account
                                            </button>
                                        </div>
                                        <div className="saprator mt-3">
                                            <span>Sign up with</span>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="d-grid">
                                                    <button type="button" className="btn mt-2 btn-light-primary bg-light text-muted">
                                                        <img src="../assets/images/authentication/google.svg" alt="img" /> <span className="d-none d-sm-inline-block"> Google</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="d-grid">
                                                    <button type="button" className="btn mt-2 btn-light-primary bg-light text-muted">
                                                        <img src="../assets/images/authentication/twitter.svg" alt="img" /> <span className="d-none d-sm-inline-block"> Twitter</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="d-grid">
                                                    <button type="button" className="btn mt-2 btn-light-primary bg-light text-muted">
                                                        <img src="../assets/images/authentication/facebook.svg" alt="img" /> <span className="d-none d-sm-inline-block"> Facebook</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="auth-footer row">
                                {/* <div class=""> */}
                                <div className="col my-1">
                                    <p className="m-0">Copyright © <a href="#">Codedthemes</a></p>
                                </div>
                                <div className="col-auto my-1">
                                    <ul className="list-inline footer-link mb-0">
                                        <li className="list-inline-item"><a href="#">Home</a></li>
                                        <li className="list-inline-item"><a href="#">Privacy Policy</a></li>
                                        <li className="list-inline-item"><a href="#">Contact us</a></li>
                                    </ul>
                                </div>
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>






            {/* <div className="container">
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
                                    <a className='register-link' type='Submit' onClick={(e) => registerUser()}> Register</a>
                                </div>
                                <div>
                                    <p>Already have an account? <a href="/">Login here</a></p>
                                </div>
                            </form>
                        </div>

                    </div>

                </div>
            </div> */}

        </>
    )
}

export default Register
