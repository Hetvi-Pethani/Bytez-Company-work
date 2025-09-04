import { useEffect, useState } from "react";
import Header from "../../component/Header/header";
import { RiDeleteBin6Line } from "react-icons/ri";
import { authFetch } from "../../../middleware/authfetch";
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify'



const Invoice = () => {

    const [selectedCurrency, setSelectedCurrency] = useState('$');
    const [rate, setRate] = useState('');
    const [qty, setqty] = useState();
    const [amount, setAmount] = useState();
    const [allStock, setAllStock] = useState([]);

    useEffect(() => {
        setAmount(rate * qty);

    }, [rate, qty]);

    const [productList, setProductList] = useState([
        {
            id: `prod-${Date.now()}`,
            stockId: '',
            productId: '',
            rate: 0,
            qty: 1,
            amount: 0,
        }
    ]);

    const addNewItem = () => {
        const newProduct = {
            id: `prod-${Date.now()}`,
            stockId: '',
            productId: '',
            qty: 1,
            rate: 0,
            amount: 0,
        };
        setProductList(prev => [...prev, newProduct]);
    };







    const handleStockChange = (id, selectedStockId) => {
        const selectedStock = allStock.find(stock => stock._id === selectedStockId);
        if (!selectedStock) return;

        setProductList(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        stockId: selectedStock._id,
                        productId: selectedStock.productId,
                        rate: selectedStock.rate,
                        amount: selectedStock.rate * item.qty,
                    }
                    : item
            )
        );
    };



    const handleqtyChange = (id, qty) => {
        setProductList(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        qty,
                        amount: (item.rate) * qty
                    }
                    : item
            )
        );
    };


    const deleteProductItem = (id) => {
        setProductList(prev => prev.filter(item => item.id !== id));
    };


    const handleRateChange = (id, value) => {
        const rate = parseFloat(value) || 0;
        setProductList(prev =>
            prev.map(product => {
                if (product.id !== id) return product;
                const updated = {
                    ...product,
                    rate,
                    amount: rate * product.qty
                };
                return updated;
            })
        );
    };


    const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.target.value);
    };





    // Customer details

    const [customers, setCustomers] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [location, setLocation] = useState("");
    const [customersData, setCustomersData] = useState([]);
    const [billNo, setBillNo] = useState("");
    const [billDate, setBillDate] = useState("");
    const [billTotal, setBillTotal] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [finalTotal, setFinalTotal] = useState("");
    const [cgst, setCgst] = useState("");
    const [sgst, setSgst] = useState("");
    const [discount, setDiscount] = useState("1");
    const [discountAmount, setDiscountAmount] = useState("");
    const [discountType, setDiscountType] = useState("");
    const [bills, setBills] = useState([]);
    const [allBills, setAllBills] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [itemData, setItemsData] = useState([]);

    useEffect(() => {
        const total = productList.reduce((sum, p) => {
            const rate = parseFloat(p.rate) || 0;
            const qty = parseInt(p.qty);
            return sum + rate * qty;
        }, 0);

        setBillTotal(total.toFixed(2));
    }, [productList]);

    useEffect(() => {
        const total =
            parseFloat(billTotal || 0) +
            parseFloat(cgst || 0) +
            parseFloat(sgst || 0);

        setGrandTotal(total.toFixed(2));
    }, [billTotal, cgst, sgst]);

    useEffect(() => {
        const total = parseFloat(grandTotal || 0);
        const discountVal =
            discount === "1"
                ? (parseFloat(discountAmount || 0) / 100) * total
                : parseFloat(discountAmount || 0);

        const final = total - discountVal;
        setFinalTotal(final >= 0 ? final.toFixed(2) : "0.00");
    }, [grandTotal, discount, discountAmount]);


    const fetchCustomers = async () => {
        try {
            const response = await authFetch(`http://localhost:8000/invoice/getcustomers`, {
                method: 'GET',
            });

            const data = await response.json();

            if (response.ok) {
                setCustomersData(data);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };
    const fetchCustomerBills = async () => {
        try {
            const response = await authFetch(`http://localhost:8000/customerBill/getcustomerbills`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (response.ok) {
                setAllBills(data.data);
                setBills(data.data);

            } else {
                toast.error("Failed to fetch bills");
            }
        } catch (error) {
            console.error("Error fetching bills:", error);
        }
    };


    const fetchItems = async () => {
        try {
            const response = await authFetch(`http://localhost:8000/customerBillItem/getcustbillitems`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();

            if (response.ok) {
                setItemsData(data.data);
            }
        } catch (error) {
            console.error('Error fetching customer bill items:', error);
        }
    };



    const fetchInvoices = async () => {
        try {
            const response = await authFetch(`http://localhost:8000/invoice/getInvoices`, {
                method: 'GET',
            });


            const data = await response.json();

            if (response.ok) {
                setInvoices(data)
            } else {
                toast.error("Failed to fetch bill items");
            }
        } catch (error) {
            console.error('Error fetching customer bill items:', error);
        }
    };



    // const fetchInvoices = async () => {
    //     try {
    //         const response = await authFetch('http://localhost:8000/invoice/getinvoices', {
    //             method: 'GET',
    //         });

    //         const data = await response.json();

    //         if (response.ok) {
    //             setInvoices(data);
    //         } else {
    //             console.error('Failed to fetch invoices:', data.message);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching invoices:', error);
    //     }
    // };


    const fetchStocks = async () => {
        try {

            const response = await authFetch('http://localhost:8000/stock/getstocks', {
                method: 'GET',
            })
            const data = await response.json();
            if (response.ok) {
                setAllStock(data);
            }
        }
        catch (error) {
            console.error('Error fetching stock:', error);
        }
    }



    useEffect(() => {
        fetchCustomerBills();
        fetchCustomers();
        fetchStocks();
        fetchItems();
        fetchInvoices();

    }, []);



    const handleFullInvoiceSubmit = async (e) => {
        e.preventDefault();

        try {
            const trimmedCustomer = customers.trim().toLowerCase();
            const existingCustomer = customersData.find(
                (item) =>
                    item.customers?.trim().toLowerCase() === trimmedCustomer &&
                    !item.deleted_at
            );

            let customerId;

            if (existingCustomer) {
                customerId = existingCustomer._id;

            } else {
                const customerFormData = {
                    customers,
                    email,
                    contact,
                    location
                };

                const customerRes = await authFetch("http://localhost:8000/invoice/insertcustomers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(customerFormData),
                });

                const customerData = await customerRes.json();

                if (!customerRes.ok) {
                    toast.error(customerData.message || "Failed to add customer");
                    return;
                }

                customerId = customerData.customer._id;
                toast.success("Customer added successfully");
                setCustomers("");
                setEmail("");
                setContact("");
                setLocation("");
            }

            const invoiceData = {
                customerId,
                
                billNo,
                billDate: new Date(),
                billTotal: parseFloat(billTotal),
                cgst: parseFloat(cgst),
                sgst: parseFloat(sgst),
                grandTotal: parseFloat(billTotal) + parseFloat(cgst) + parseFloat(sgst),
                discount: parseInt(discount),
                discountAmount: parseFloat(discountAmount),
                discountType,
                finalTotal:
                    (parseFloat(billTotal) + parseFloat(cgst) + parseFloat(sgst)) -
                    (discount === "1"
                        ? ((parseFloat(discountAmount) / 100) * (parseFloat(billTotal) + parseFloat(cgst) + parseFloat(sgst)))
                        : parseFloat(discountAmount)),
            };

            const billRes = await authFetch("http://localhost:8000/invoice/insertcustomerbill", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(invoiceData),
            });

            const billResult = await billRes.json();


            const customerBillId = billResult.customerbill._id;

            setBillNo("");
            setBillDate("");
            setBillTotal("");
            setCgst("");
            setSgst("");
            setDiscount("");
            setDiscountType("");
            setDiscountAmount("");
            setFinalTotal("");
            setProductList([]);
            fetchCustomerBills();
            fetchItems();
            fetchInvoices();


            const invoicesData = {
                customerBillId,
                customerId,
                productList: productList.map(item => ({
                    stockId: item.stockId,
                    productId: item.productId,
                    qty: item.qty,
                    rate: item.rate,
                    amount: item.amount
                }))
            };

            const itemRes = await authFetch("http://localhost:8000/invoice/insertcustomerbillitem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(invoicesData),
            });

            const itemData = await itemRes.json();


            if (!itemRes.ok) {
                toast.error(itemData.message || "Failed to insert invoice items");
                return;
            }

            toast.success("Invoice and items saved!");



        } catch (error) {
            console.error("Invoice creation failed:", error);
            toast.error("Invoice creation failed");
        }
    };



    return (

        <div>
            <Header />

            <div className="pc-container p-3" style={{ top: "65px" }}>
                <div className="row align-items-center">
                    <div className="page-header-title">
                        <h3 className="mb-3 undefined" >Invoice</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 ">
                        <div className="card">
                            <div className="card-body d-flex justify-content-between ">
                                <div className="col-lg-4">
                                    <div className="profile-user mx-auto  mb-3">

                                        <label htmlFor="profile-img-file-input" tabIndex={0}>
                                            <img src="../assets/images/logo-dark.svg" className="img-fluid logo-lg" alt="logo" />
                                        </label>
                                    </div>
                                </div>

                                <div className="col-lg-4 text-end">
                                    <div >
                                        <p className="text-start">Company : <span>Bytez Tech</span></p>

                                        <p className="text-start">Contact : <span>90336 47654 </span> </p>

                                        <p className="text-start">Address : <span>607,608 Rio Business Hub</span> </p>

                                    </div>
                                </div>
                            </div>


                            <div className="card-body p-4 border-top border-top-dashed">

                                <div className="card-body ">
                                    <div className="d-flex justify-content-end gap-1 ">

                                        <div>
                                            <h6 htmlFor="invoice-number" className="form-label">Invoice Number:</h6>
                                            <input type="text" className="form-control  bg-light border-0" id="invoice-number" placeholder="Bill No" value={billNo} onChange={(e) => setBillNo(e.target.value)} />
                                        </div>
                                        <div>
                                            <h6 className="form-label" htmlFor="invoice-date">Invoice Date:</h6>
                                            <input type="date" className="form-control  bg-light border-0" id="invoice-date" value={billDate} onChange={(e) => setBillDate(e.target.value)} />
                                        </div>

                                    </div>
                                </div>

                                <form >
                                    <div className="row">
                                        <div className="col-lg-4 col-sm-6">
                                            <div>
                                                <h5 className=" text-uppercase fw-semibold">Customer Details</h5>
                                            </div>
                                            <div className="mb-2">
                                                <input type="text" className="form-control bg-light border-0" placeholder="Full Name" onChange={(e) => setCustomers(e.target.value)} value={customers} required />

                                            </div>
                                            <div className="mb-2">
                                                <input type="email" className="form-control bg-light border-0" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} value={email} required />

                                            </div>

                                        </div>

                                        <div className="col-sm-6 ms-auto">
                                            <div className="row">
                                                <div >
                                                    <div className="mt-4">
                                                        <textarea className="form-control bg-light border-0" id="shippingAddress" rows={1} name="location" type="location" placeholder="Add Location" onChange={(e) => setLocation(e.target.value)} value={location} />
                                                    </div>
                                                </div>
                                                <div className="mb-2">
                                                    <input className="form-control  bg-light border-0" name="contact" type="mobile" minLength={10} maxLength={10} pattern="[0-9]{10}" placeholder="(123)456-7890" onChange={(e) => setContact(e.target.value)} value={contact} required />
                                                </div>

                                            </div>
                                        </div>

                                        {/*end col*/}
                                    </div>

                                </form>

                                <hr></hr>

                                <div className="card-body p-4">
                                    <div>
                                        <table className="table table-borderless table-nowrap ">

                                            {/* header */}

                                            <thead style={{ backgroundColor: "#f0f0f0ff", padding: "0" }}>
                                                <tr >
                                                    <th scope="col" style={{ width: 50 }}>#</th>

                                                    <th scope="col">Product Details</th>

                                                    <th scope="col" style={{ width: 160 }}>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span>Rate</span>
                                                            <select
                                                                className="form-control "
                                                                value={selectedCurrency}
                                                                onChange={(e) => handleCurrencyChange(e)}
                                                                style={{ width: 70, padding: "0 5px" }}
                                                            >
                                                                <option value="$">($)</option>
                                                                <option value="£">(£)</option>
                                                                <option value="₹">(₹)</option>
                                                                <option value="€">(€)</option>
                                                            </select>
                                                        </div>
                                                    </th>

                                                    <th scope="col" style={{ width: 120 }}>qty</th>

                                                    <th scope="col" className="text-end" style={{ width: 150 }}>Amount</th>

                                                    <th scope="col" className="text-end" style={{ width: 105 }}></th>
                                                </tr>
                                            </thead>



                                            {/* productList */}

                                            <tbody id="newlink">

                                                {productList.map((item, index) => (
                                                    <tr key={item._id}>
                                                        <td className="border px-2">{index + 1}</td>


                                                        <td>
                                                            <select
                                                                className="form-control"
                                                                value={item.stockId}
                                                                onChange={(e) => handleStockChange(item.id, e.target.value)}
                                                            >
                                                                <option value="">Select Product</option>
                                                                {allStock.map((stock) => (
                                                                    <option key={stock._id} value={stock._id}>
                                                                        {stock.productName}
                                                                    </option>
                                                                ))}
                                                            </select>


                                                        </td>

                                                        {/* Rate */}
                                                        <td className="border px-2">
                                                            <input
                                                                type="number" className="form-control bg-light border-0" placeholder="0.00" value={item.rate} onChange={(e) => handleRateChange(item.id, e.target.value)}
                                                                readOnly
                                                            />
                                                        </td>

                                                        {/* qty */}
                                                        <td >
                                                            <div className="input-step d-flex align-items-center"
                                                                style={{
                                                                    border: "1px solid #ced4da",
                                                                    borderRadius: "5px",
                                                                    padding: "2px 5px",
                                                                    width: "fit-content",
                                                                }}>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-light btn-sm"
                                                                    onClick={() => handleqtyChange(item.id, Math.max(1, item.qty - 1))}
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
                                                                    value={item.qty}
                                                                    onChange={(e) =>
                                                                        handleqtyChange(item.id, parseInt(e.target.value, 10) || 1)
                                                                    }
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-light btn-sm"
                                                                    onClick={() => handleqtyChange(item.id, item.qty + 1)}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </td>

                                                        {/* Amount */}
                                                        <td className="border px-2 text-right">
                                                            <input
                                                                type="text"
                                                                className="form-control bg-light border-0 text-end"
                                                                style={{ width: "100px" }}
                                                                value={`₹${item.amount.toFixed(2)}`}
                                                                readOnly
                                                            />

                                                        </td>

                                                        {/* Delete */}
                                                        <td >
                                                            <button
                                                                className="btn btn"
                                                                style={{ color: "#94a3b8", border: 0 }}
                                                                type="button"
                                                                onClick={() => deleteProductItem(item.id)}
                                                            >
                                                                <RiDeleteBin6Line />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}

                                                <tr>
                                                    <td colSpan={6}>
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary "
                                                            onClick={addNewItem}
                                                        >
                                                            <i className="ri-add-fill me-1 " /> Add Item
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>

                                            {/* all product total */}
                                            <tbody>
                                                <tr className="border-top border-top-dashed">
                                                    <td colSpan={3} />
                                                    <td colSpan={3} className="p-0">
                                                        <table className="table table-borderless table-sm table-nowrap mb-0">
                                                            <tbody>
                                                                <tr>
                                                                    <th>Bill Total</th>
                                                                    <td style={{ width: 200 }}>
                                                                        <input
                                                                            className="form-control bg-light border-0"
                                                                            type="number"

                                                                            placeholder="$0.00"
                                                                            onChange={(e) => setBillTotal(e.target.value)}
                                                                            value={billTotal}
                                                                            readOnly
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Discount Type</th>
                                                                    <td>
                                                                        <select
                                                                            id="discount"
                                                                            name="discount"
                                                                            className="form-control bg-light border-0"
                                                                            value={discount}
                                                                            onChange={(e) => setDiscount(e.target.value)}
                                                                        >
                                                                            <option value="">-- Select Discount Type --</option>
                                                                            <option value="1">Percentage (%)</option>
                                                                            <option value="2">Fixed (₹)</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>
                                                                        Discount <small className="text-muted">(VELZON15)</small>
                                                                    </th>
                                                                    <td>
                                                                        <input
                                                                            id="discountAmount"
                                                                            name="discountAmount"
                                                                            type="number"
                                                                            className="form-control bg-light border-0"
                                                                            placeholder="$0.00"
                                                                            value={discountAmount}
                                                                            onChange={(e) => setDiscountAmount(e.target.value)}
                                                                            min="0"
                                                                            step="0.01"

                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>CGST  (₹)</th>
                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            placeholder="$0.00"
                                                                            className="form-control bg-light border-0 text-start"
                                                                            value={cgst}
                                                                            onChange={(e) => setCgst(e.target.value)}
                                                                            min="0"
                                                                            step="0.01"

                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>SGST  (₹)</th>
                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            placeholder="$0.00"
                                                                            className="form-control bg-light border-0 text-start"
                                                                            value={sgst}
                                                                            onChange={(e) => setSgst(e.target.value)}
                                                                            min="0"
                                                                            step="0.01"

                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr className="border-top border-top-dashed">
                                                                    <th>Total Amount</th>
                                                                    <td>
                                                                        <input
                                                                            id="finalTotal"
                                                                            name="finalTotal"
                                                                            type="number"
                                                                            className="form-control"
                                                                            placeholder="Final Total"
                                                                            value={finalTotal}
                                                                            onChange={(e) => setFinalTotal(e.target.value)}
                                                                            readOnly
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/*end table*/}
                                    </div>

                                    {/*end row*/}
                                    <div className="mt-4">
                                        <label htmlFor="exampleFormControlTextarea1" className="form-label text-muted text-uppercase fw-semibold">NOTES</label>
                                        <textarea className="form-control alert alert-info" id="exampleFormControlTextarea1" placeholder="Notes" rows={2} required defaultValue={"All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment online. If account is not paid within 7 days the credits details supplied as confirmation of work undertaken will be charged the agreed quoted fee noted above."} />
                                    </div>
                                    <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                                        <button type="submit" className="btn btn-success"><i className="ri-printer-line" /> Save</button>

                                        <a href="#" className="btn btn-primary"><i className="ri-download-2-line " /> Download Invoice</a>
                                        <button className="btn btn-primary" onClick={handleFullInvoiceSubmit}>Save Invoice</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}
export default Invoice;