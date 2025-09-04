const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  profilePic: String,
  domainName: String,
  appName: String,
  name: String,
  mobile: Number,
  email: String,
  address: String,
  password: String,
  panNumber: String,
  gstNumber: String,
  bankName: String,
  acNumber: String,
  branch: String,
  ifsc: String,
  upiId: String,
  termsCondition: String,
  otp: String,
  merchantsType: { type: Number, enum: [1, 2] },
  status: {
    type: String,
    default: 'active',
    required: true
  },
  perLicenceAmt: Number,
  expiryDate: Date,
  searchKeywords: String,
  deleted_at: Date,
}, { timestamps: true });

module.exports = mongoose.model('Merchant', merchantSchema);
