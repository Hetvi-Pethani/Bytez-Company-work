import React, { useState } from 'react';
import Header from '../../component/Header/header';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Merchant = () => {

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/')
    }
  }, []);

  const [domainName, setDomainName] = useState('');
  const [appName, setAppName] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [pannumber, setPanNumber] = useState('');
  const [gstnumber, setGstNumber] = useState('');
  const [bankname, setBankName] = useState('');
  const [accountnumber, setAccountNumber] = useState('');
  const [branchname, setBranchName] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [upiid, setUPIID] = useState('');
  const [Perlicenceamount, setPerLicenceAmount] = useState('');
  const [termsCondition, setTermsCondition] = useState('');
  const [merchantsType, setMerchantsType] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({

    merchantsType: '1',

  });

  const today = new Date().toISOString().split('T')[0];

  const [profilePic, setProfilePic] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append('domainName', domainName);
      formData.append('appName', appName);
      formData.append('name', fullname);
      formData.append('email', email);
      formData.append('mobile', mobile);
      formData.append('password', password);
      formData.append('address', address);
      formData.append('panNumber', pannumber);
      formData.append('gstNumber', gstnumber);
      formData.append('bankName', bankname);
      formData.append('acNumber', accountnumber);
      formData.append('branch', branchname);
      formData.append('ifsc', ifsc);
      formData.append('upiId', upiid);
      formData.append('perLicenceAmt', Perlicenceamount);
      formData.append('termsCondition', termsCondition);
      formData.append('merchantsType', merchantsType);
      formData.append('expiryDate', expiryDate);
      formData.append('status', status);


      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      const response = await fetch('http://localhost:8000/merchant/registerMerchant', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert('Merchant registered successfully');
        setForm({});
        setProfilePic(null);
        setAppName('');
        setDomainName('');
        setFullname('');
        setEmail('');
        setMobile('');
        setPanNumber('');
        setGstNumber('');
        setBankName('');
        setAccountNumber('');
        setBranchName('');
        setExpiryDate('')
        setUPIID('');
        setPerLicenceAmount('');
        setStatus('');
        setPassword('');
        setAddress('');
        setIfsc('');
        setTermsCondition(false);

      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('Registration failed');
    }
  };

  return (
    <div>
      <Header />
      <div className="pc-container p-3">
      

          <div className="row align-items-center">
            <div className="page-header-title">
              <h3 className="mb-3">Merchant Registration</h3>
            </div>


            <div className="row">
              <div className="col-sm-12 ">
                <div className="card ">
                  <div className="container my-4">
                    <form onSubmit={handleSubmit} className="row g-3" encType="multipart/form-data">

                      <div className="col-md-6">
                        <label className="form-label">Domain Name</label>
                        <input type="text" className="form-control" name="domainname" value={domainName} onChange={(e) => setDomainName(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">App Name</label>
                        <input type="text" className="form-control" name="appname" value={appName} onChange={(e) => setAppName(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-control" name="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Mobile</label>
                        <input type="tel" className="form-control" name="mobile" minLength={10} maxLength={10} pattern="[0-9]{10}" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Address</label>
                        <input type="text" className="form-control" name="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">PAN Number</label>
                        <input type="number" className="form-control" name="pannumber" value={pannumber} onChange={(e) => setPanNumber(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">GST Number</label>
                        <input type="number" className="form-control" name="gstnumber" value={gstnumber} onChange={(e) => setGstNumber(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Bank Name</label>
                        <input type="text" className="form-control" name="bankname" value={bankname} onChange={(e) => setBankName(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Account Number</label>
                        <input type="number" className="form-control" name="accountnumber" value={accountnumber} onChange={(e) => setAccountNumber(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Branch Name</label>
                        <input type="text" className="form-control" name="branchname" value={branchname} onChange={(e) => setBranchName(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">IFSC</label>
                        <input type="number" className="form-control" name="ifsc" value={ifsc} onChange={(e) => setIfsc(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">UPI Id</label>
                        <input type="number" className="form-control" name="upiid" value={upiid} onChange={(e) => setUPIID(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Per Licence Amount</label>
                        <input type="text" className="form-control" name="Perlicenceamount" value={Perlicenceamount} onChange={(e) => setPerLicenceAmount(e.target.value)} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Expiry Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="expiryDate"
                          value={expiryDate}
                          min={today}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Merchant Type</label>
                        <select
                          className="form-select"
                          name="merchantsType"
                          value={merchantsType}
                          onChange={(e) => setMerchantsType(e.target.value)}
                          required
                        >
                          <option value="1">Main User</option>
                          <option value="2">Merchant</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Select Status</label>
                        <select
                          id="status"
                          name="status"
                          className="form-select"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value=""> -- Status --</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>


                      <div className="form-group mb-3">
                        <label className="col-form-label  text-lg-start">Profile Pic</label>

                        <input
                          className="form-control"
                          type="file"
                          name="profilePic"
                          onChange={(e) => setProfilePic(e.target.files[0])}
                          accept="image/*"
                          required
                        />
                      </div>



                      <div className="col-12">
                        <label className="form-label">Terms & Conditions</label>
                        <textarea
                          className="form-control"
                          name="termsCondition"
                          value={termsCondition}
                          onChange={(e) => setTermsCondition(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <button type='submit' className="btn btn-primary w-100">Register Merchant</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div >
        </div >
      </div>
   
  );
};

export default Merchant;
