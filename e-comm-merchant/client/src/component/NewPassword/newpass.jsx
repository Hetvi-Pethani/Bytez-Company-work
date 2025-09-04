import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'


const Newpass = () => {

    // This component renders a new password form for the user to set a new password.
    const navigate = useNavigate();

    const [newpassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleNewPassword = async () => {

        const formData = {
            newpass: newpassword,
            cpass: confirmPassword
        };

        if (newpassword === confirmPassword) {
            try {
                const response = await fetch('http://localhost:8000/usernewPassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    toast.success('Password updated successfully');
                    navigate('/');
                } else {
                     toast.warn(data.message || 'Failed to update password');
                }
            } catch (error) {
                console.error('Error setting new password:', error);
                toast.error('Something went wrong. Please try again later.');
            }
        } else {
            toast.warn('Passwords do not match');
        }
    }



    return (
        <>
            <div>
                <title>Newpassword | Mantis Bootstrap 5 Admin Template</title>
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
                {/* [Body] Start */}
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
                            <div className="card my-5">
                                <form method="post" onSubmit={(e) => { e.preventDefault(); handleNewPassword(); }}>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-end mb-4">
                                            <h3 className="mb-0"><b>Login New password</b></h3>
                                            <a href="/" className="link-primary">Don't have an account?</a>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="form-label">New Password</label>
                                            <input
                                                type="password"
                                                name="newpass"
                                                className="form-control"
                                                placeholder="New password"
                                                value={newpassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label className="form-label">confirm Password</label>
                                            <input
                                                type="password"
                                                name="cpass"
                                                className="form-control"
                                                placeholder="Confirm password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />

                                        </div>
                                        <div className="d-flex mt-1 justify-content-between">
                                            <div className="form-check">
                                                <input className="form-check-input input-primary" type="checkbox" id="customCheckc1" defaultChecked />
                                                <label className="form-check-label text-muted" htmlFor="customCheckc1">Keep me sign in</label>
                                            </div>
                                        </div>
                                        <div className="d-grid mt-4">

                                            <button type="submit" className='login-link btn btn-primary' >
                                                Back To Login
                                            </button>
                                        </div>
                                        <div className="saprator mt-3">
                                            <span>Login with</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
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
                {/* [ Main Content ] end */}
            </div>

        </>
    )
}
export default Newpass;