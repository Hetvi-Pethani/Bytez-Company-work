import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Login.css'
import { toast } from 'react-toastify'

const Login = () => {


    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token)
            navigate('/banner')
    }, [navigate])


    const loginUser = async () => {

        if (email === '' || password === '') {
            toast.error("Invalid credentials!")
            return
        }

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
            toast.success("Login successful!")
        }
         else {
            toast.error('Login Failed')
        }
    }

    return (

        <div>
            {/* [Head] start */}
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

                {/* [ Pre-loader ] End */}
                <div className="auth-main" >
                    <div className="auth-wrapper v3">
                        <div className="auth-form">
                            <div className="auth-header">
                                <a href="#"><img src="../assets/images/logo-dark.svg" alt="img" /></a>
                            </div>
                            <form method="post" onSubmit={(e) => { e.preventDefault(); loginUser(); }}>
                                <div className="card my-5">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-end mb-4">
                                            <h3 className="mb-0"><b>Login</b></h3>
                                            <a href="register" className="link-primary">Don't have an account?</a>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="form-label">Email Address</label>
                                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Your Email Address" required />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="form-label">Password</label>
                                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Your Password" requireds />
                                        </div>
                                        <div className="d-flex mt-1 justify-content-between">
                                            <div className="form-check">
                                                <input className="form-check-input input-primary" type="checkbox" id="customCheckc1" defaultChecked />
                                                <label className="form-check-label text-muted" htmlFor="customCheckc1">Keep me sign in</label>
                                            </div>
                                            <a className="text-secondary f-w-400" href='/forgotpassword' >Forgot Password?</a>
                                        </div>
                                        <div className="form-group mb-3 ">
                                            <button type="submit" className='login-link btn btn-primary' >
                                                Login
                                            </button>
                                        </div>

                                        <div className="saprator mt-3">
                                            <span>Login with</span>
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
                            <div className="auth-footer row justify-content-between">
                                {/* <div class=""> */}
                                <div className="col">
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
                {/* [ Main Content ] end */}
            </div>



            {/* <div className="container">
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
                                    <a className='login-link' type="Submit" onClick={(e) => loginUser()}> Login</a>
                                </div>
                                <p>Don't have an account?<a href="register" >Register here</a></p>

                            </form>

                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default Login;
