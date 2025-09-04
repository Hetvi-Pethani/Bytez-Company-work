import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { toast } from 'react-toastify'


const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const handleForgotPassword = async () => {

        try {
            const formData = {
                email: email,
            }

            const response = await fetch('http://localhost:8000/forgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            })
            const data = await response.json();

            if (response.ok) {
                 toast.success("OTP sent successfully");
                navigate('/otp');
            } else {
                 toast.error(data.message || "Failed to send OTP");
            }

        } catch (error) {
            console.error('Error during forgot password:', error);
             toast.error('Something went wrong. Please try again later.');
        }
    };

    return (
        <div>

            {/* [Head] start */}
            <title>ForgotPassword | Mantis Bootstrap 5 Admin Template</title>
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
                <div className="auth-main">
                    <div className="auth-wrapper v3">
                        <div className="auth-form">
                            <div className="auth-header">
                                <a href="#"><img src="../assets/images/logo-dark.svg" alt="img" /></a>
                            </div>
                            <div className="card my-5 align-item-center" style={{ maxWidth: '500px', margin: '0 auto', bottom: '100px' }}>
                                <form method="post" onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                                    <div className="card-body" style={{ maxWidth: '500px', margin: '0 auto', bottom: '80px' }}>
                                        <div className="d-flex justify-content-between align-items-end mb-4">
                                            <h3 className="mb-0" ><b>Forgot Password</b></h3>
                                            <a href="/" className="link-primary">Don't have an account?</a>
                                        
                                        </div>
                                      
                                        <div className="form-group mb-3">
                                            <label className="form-label">Email Address</label>
                                            <input type="email" name="useremail" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Email Address" />
                                        </div>
                                        <div className="d-flex mt-1 justify-content-between">
                                            <div className="form-check">
                                                <input className="form-check-input input-primary" type="checkbox" id="customCheckc1" defaultChecked />
                                                <label className="form-check-label text-muted" htmlFor="customCheckc1">Keep me sign
                                                    in</label>
                                            </div>
                                        </div>
                                        <div className="d-grid mt-4">
                                            <button type="submit" className='login-link btn btn-primary' >
                                                Forgot Password?
                                            </button>
                                        </div>
                                        <div className="saprator mt-3">
                                            <span>Login with</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default ForgotPassword;
