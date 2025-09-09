import { useLocation } from "react-router-dom";
import Header from "../../component/Header/header";
import { useEffect, useState } from "react";
import { authFetch } from "../../../middleware/authfetch";

const InvoicePrint = () => {

    const location = useLocation();
    const billitemsData = location.state?.billitemsData;
    const billData = location.state?.billData;

    const [invoice, setInvoice] = useState([]);

    const fetchInvoice = async () => {
        try {
            const res = await authFetch(`http://localhost:8000/invoiceprint/customerbillitem`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerBillItemId: billitemsData,
                    customerbillId: billData,
                }),
            })

            const data = await res.json();

            setInvoice(data);
        } catch (error) {
            console.error("Failed to fetch invoice:", error.message);
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, []);

    if (!invoice) return <div>Loading or no data found...</div>;

    const { customer, billDetails } = invoice;

    const formatCurrency = (amount = 0) => `₹${parseFloat(amount).toFixed(2)}`;
    const formatDate = (date) => date?.split("T")[0] || "";

    return (
        <>
            <Header />
            <div className="pc-container p-3" style={{ top: "65px" }}>
                <div className="row align-items-center">
                    <div className="page-header-title">
                        <h3 className="mb-3">Invoice Print</h3>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-body d-flex justify-content-between">
                                <div className="col-lg-4">
                                    <div className="profile-user mx-auto mb-3">
                                        <img src="../assets/images/logo-dark.svg" className="img-fluid logo-lg" alt="logo" />
                                    </div>
                                </div>

                                <div className="col-lg-4 text-end">
                                    <div>
                                        <p className="text-start">Company: <span>Bytez Tech</span></p>
                                        <p className="text-start">Contact: <span>90336 47654</span></p>
                                        <p className="text-start">Address: <span>607,608 Rio Business Hub</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body p-4 border-top border-top-dashed">
                                <div className="card-body">
                                    <div className="d-flex justify-content-end gap-1">
                                        <div>
                                            <h6 className="form-label" >INVOICE NO:</h6>
                                            <input
                                                type="text"
                                                placeholder="Invoice No"
                                                className="form-control  bg-light border-0"
                                                value={billDetails?.billNo || ''}
                                                
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <h6 className="form-label">INVOICE DATE:</h6>
                                            <input
                                                type="date"
                                                className="form-control bg-light border-0"
                                                value={formatDate(billDetails?.date)}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-lg-4 col-sm-6">
                                        <h5 className="text-uppercase fw-semibold">Customer Details</h5>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 mb-2"
                                            placeholder="Full Name"
                                            value={customer?.customers || ''}
                                            readOnly
                                        />
                                     
                                        <input
                                            type="email"
                                            className="form-control bg-light border-0 mb-2"
                                            placeholder="Email"
                                            value={customer?.email || ''}
                                            readOnly
                                        />
                                    </div>

                                    <div className="col-sm-6 ms-auto">
                                        <textarea
                                            className="form-control bg-light border-0 mb-2"
                                            rows={1}
                                            placeholder="Location"
                                            value={customer?.location || ''}
                                            readOnly
                                        />
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0"
                                            placeholder="Contact"
                                            value={customer?.contact || ''}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <hr />
                                <table className="table table-borderless table-nowrap">
                                    <thead style={{ backgroundColor: "#f0f0f0ff" }}>
                                        <tr>
                                            <th>#</th>
                                            <th>Product Details</th>
                                            <th>Rate (₹)</th>
                                            <th>Quantity</th>
                                            <th >Amount</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.productList?.map((p, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-light border-0"
                                                        placeholder="Product Name"
                                                        value={p?.productName || ""}
                                                        readOnly
                                                    />
                                                </td>

                                                <td className="border px-2">
                                                    <input
                                                        type="number"
                                                        className="form-control bg-light border-0"
                                                        placeholder="0.00"
                                                        value={p.rate || 0}
                                                        readOnly
                                                    />
                                                </td>

                                                <td>
                                                    <div
                                                        className="input-step d-flex align-items-center"
                                                        style={{
                                                            border: "1px solid #ced4da",
                                                            borderRadius: "5px",
                                                            padding: "2px 5px",
                                                            width: "fit-content",
                                                        }}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="btn btn-light btn-sm"

                                                        >
                                                            -
                                                        </button>

                                                        <input
                                                            className="form-control form-control-sm text-center"
                                                            min="1"
                                                            style={{
                                                                width: "50px",
                                                                margin: "0 5px",
                                                                border: "none",
                                                                fontSize: "14px",
                                                            }}
                                                            value={p.qty || 0}

                                                            readOnly
                                                        />

                                                        <button
                                                            type="button"
                                                            className="btn btn-light btn-sm"

                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="border text-right">
                                                    <input
                                                        type="text"
                                                        className="form-control bg-light border-0"
                                                        style={{ width: "100px" }}
                                                        value={`₹${(p.amount || 0).toFixed(2)}`}
                                                        readOnly
                                                    />
                                                </td>



                                            </tr>
                                        ))}
                                    </tbody>

                                    {/* <tbody>
                                        {invoice.productList?.map((p, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{p.productName}</td>
                                                <td>{p.rate}</td>
                                                <td>{p.qty}</td>
                                                <td>{p.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody> */}

                                    <tfoot >
                                        <tr className="border-top ">
                                            <td colSpan={3} />
                                            <td colSpan={4} className="p-4">
                                                <table className="table table-borderless table-sm mb-0">
                                                    <tbody>
                                                        <tr>
                                                            <th>Bill Total</th>

                                                            <td>
                                                                {formatCurrency(billDetails?.billTotal)}

                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Discount</th>
                                                            <td>
                                                                {formatCurrency(billDetails?.discount)}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>CGST</th>
                                                            <td>
                                                                {formatCurrency(billDetails?.cgst)}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>SGST</th>
                                                            <td>
                                                                {formatCurrency(billDetails?.sgst)}
                                                            </td>
                                                        </tr>
                                                        <tr className="border-top">
                                                            <th>Grand Total</th>
                                                            <td className="fs-6 fw-semibold">
                                                                {formatCurrency(billDetails?.grandTotal)}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>

                                <div className="mt-4">
                                    <label className="form-label text-muted text-uppercase fw-semibold">NOTES</label>
                                    <textarea
                                        className="form-control alert alert-info"
                                        rows={2}
                                        defaultValue={"All accounts are to be paid within 7 days..."}

                                    />
                                </div>

                                <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                                    
                                    <button  className="btn btn-success">
                                        <i className="ri-printer-line" /> Print
                                    </button>
                                    <button className="btn btn-primary">Save Invoice</button>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    );
};

export default InvoicePrint;
