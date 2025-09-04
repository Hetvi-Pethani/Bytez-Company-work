
const bcrypt = require('bcrypt');
const merchantModel = require('../models/merchantModel');

const registerMerchant = async (req, res) => {
  try {
    const {
      domainName, appName, name, mobile, email, address, password,status,
      panNumber, gstNumber, bankName, acNumber, branch, ifsc, upiId,
      termsCondition, merchantsType, perLicenceAmt, expiryDate
    } = req.body;


    const hashedPassword = await bcrypt.hash(password, 10);

    const merchant = new merchantModel({
     profilepic: req.file?.filename,
      domainName,
      appName,
      name,
      mobile,
      email,
      address,
      password: hashedPassword,
      panNumber,
      gstNumber,
      bankName,
      acNumber,
      branch,
      ifsc,
      upiId,
      termsCondition,
      merchantsType,
      status,
      perLicenceAmt,
      expiryDate,
      searchKeywords: name + " " + email,
    });
   
    await merchant.save();

    res.status(200).json({ success: true, message: 'Merchant registered successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: 'Registration failed' });
  }
};

module.exports = {
  registerMerchant
};
