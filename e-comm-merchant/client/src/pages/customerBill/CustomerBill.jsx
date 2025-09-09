import { useEffect, useState } from "react";
import Header from "../../component/Header/header";
import { authFetch } from "../../../middleware/authfetch";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'

const CustomerBill = () => {

    const [allBills, setAllBills] = useState([]);
    const [bills, setBills] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [customersData, setCustomersData] = useState([]);
    const [customerId, setCustomerId] = useState("");
    const [billNo, setBillNo] = useState("");
    const [billDate, setBillDate] = useState("");
    const [billTotal, setBillTotal] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [finalTotal, setFinalTotal] = useState("");
    const [editId, setEditId] = useState("");

    const [cgst, setCgst] = useState("");
    const [sgst, setSgst] = useState("");
    const [discount, setDiscount] = useState("");
    const [discountAmount, setDiscountAmount] = useState("");
    const [discountType, setDiscountType] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleCloseAdd = () => setShowAddModal(false);
    const handleShowAdd = () => setShowAddModal(true);
    const handleCloseEdit = () => setShowEditModal(false);
    const handleShowEdit = () => setShowEditModal(true);
    const [showModal, setShowModal] = useState(false);


    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(bills.length / itemsPerPage);
    const currentItems = bills.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
    }, []);




    useEffect(() => {
        fetchCustomerBills(search);
        fetchCustomers();
    }, [search]);


    const fetchCustomerBills = async (searchTerm = '') => {
        try {
            const response = await authFetch(`http://localhost:8000/customerBill/getcustomerbills?search=${encodeURIComponent(searchTerm)}`, {
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


    const fetchCustomers = async () => {
        try {
            const response = await authFetch('http://localhost:8000/customers/getcustomers', {
                method: 'GET',

            });

            const data = await response.json();

            if (response.ok) {
                setCustomersData(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };


    useEffect(() => {
        const total = Number(grandTotal || 0);
        const discountVal = discount === "1"
            ? (Number(discountAmount || 0) / 100) * total
            : Number(discountAmount || 0);

        const final = total - discountVal;
        setFinalTotal(final >= 0 ? final.toFixed(2) : 0);
    }, [grandTotal, discount, discountAmount]);

    useEffect(() => {
        const total = Number(billTotal || 0) + Number(cgst || 0) + Number(sgst || 0);
        setGrandTotal(total);
    }, [billTotal, cgst, sgst]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            let filtered = [...allBills];

            if (search.trim() !== "") {
                const lowerSearch = search.toLowerCase();
                filtered = filtered.filter(bill =>
                    bill.billNo?.toLowerCase().includes(lowerSearch)
                );
            }
            if (status !== "") {
                filtered = filtered.filter(item => item.status === status);
            }
            setBills(filtered);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [search, allBills, status]);


    const insertCustomerBill = async (e) => {
        e.preventDefault();

        try {
            const payload = {
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
                status,
                searchKeywords: `${billNo} ${customerId}`
            }

            const response = await authFetch("http://localhost:8000/customerbill/insertcustomerbill", {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Customer Bill Added Successfully");
                setBillNo("");
                setBillTotal("");
                setCgst("");
                setSgst("");
                setDiscount("1");
                setDiscountType("");
                setDiscountAmount("");
                setFinalTotal("");
                setBillDate("");
                setCustomerId("");
                handleCloseAdd();
                fetchCustomerBills();
            } else {
                toast.error("Failed to add customer bill");
            }

        } catch (error) {
            console.error("Error inserting customer bill:", error);
            toast.error("Error adding bill");
        }
    };


    const handleDelete = async (id) => {

        if (window.confirm("Are you sure you want to delete this category?")) {

            try {
                const response = await authFetch(`http://localhost:8000/customerbill/deletecustomerbill`, {
                    method: 'POST',
                    body: JSON.stringify({ id })
                });
                const data = await response.json();

                if (response.ok) {
                    toast.success("CustomerBill Deleted Successfully");
                    fetchCustomerBills();

                } else {
                    toast.error("Failed to delete customer bill");
                }
            }
            catch (error) {
                console.error('Error deleting  customer bill:', error);
                toast.error("Error deleting  customer bill");
            }
        }
    }

    const handleEdit = (id) => {
        const billToEdit = allBills.find(bill => bill._id === id);
        setEditId(id);
        setBillNo(billToEdit.billNo);
        setCustomerId(billToEdit.customerId);
        setBillTotal(billToEdit.billTotal);
        setBillDate(billToEdit.billDate.split("T")[0]);
        setCgst(billToEdit.cgst);
        setSgst(billToEdit.sgst);
        setGrandTotal(billToEdit.grandTotal);
        setDiscount(billToEdit.discount);
        setStatus(billToEdit.status);
        setFinalTotal(billToEdit.finalTotal);
        setDiscountAmount(billToEdit.discountAmount);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const payload = {
            editId,
            customerId,
            billNo,
            billTotal,
            billDate,
            cgst,
            sgst,
            grandTotal,
            discount,
            discountAmount,
            discountType,
            finalTotal,
            status,
        }
        try {
            const response = await authFetch('http://localhost:8000/customerbill/updatecustomerbill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)

            });
            console.log(payload);
            const data = await response.json();
            console.log(data);


            if (response.ok) {
                toast.success("Bill updated successfully");
                setBillNo("");
                setBillTotal("");
                setBillDate("");
                setCgst("");
                setSgst("");
                setGrandTotal("");
                setDiscountType("");
                setDiscount("");
                setStatus("");
                setFinalTotal("");
                setDiscountAmount("");
                fetchCustomerBills();
                handleCloseEdit();
            }
            else {
                toast.error("Failed to update CustomerBill");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Error updating Bill: ");
        }
    };

    const handleExport = async () => {
        try {
            const response = await authFetch('http://localhost:8000/customerbill/export', {
                method: 'GET',

            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'customerbill.csv';
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("Export complete!");
        } catch (err) {
            console.error("Export failed", err);
            toast.error("Failed to export file.");
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        setShowModal(false);
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/customerbill/import', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('customerbill imported successfully!');
                fetchCustomerBills();
            } else {
                toast.error(result.message || 'Import failed');
            }
        } catch (error) {
            console.error('Import error:', error);
            toast.error('Error importing file');
        }
    };


    const handlePrint = (bill) => {
        navigate('/invoiceprint', { state: { billData: bill } });
    };


    return (
        <>
            <Header />
            <div className="pc-container p-3" style={{ top: "65px" }}>

                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-4 d-flex ">
                            <div className="page-header-title">
                                <h3 className="mb-3">CustomersBill</h3>
                            </div>
                        </div>
                    </div>
                </div>


                {/* View Category */}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header pb-0 p-3" >
                                <div className="d-flex justify-content-end  ">

                                    <div className="d-flex gap-1 ">
                                        <Button style={{ backgroundColor: "#f1f5f9", border: "0", color: "#000" }} onClick={handleExport}>
                                            <i className="ti ti-download"></i> Export
                                        </Button>

                                        <Button
                                            style={{ backgroundColor: "#f1f5f9", border: "0", color: "#000" }}
                                            onClick={() => setShowModal(true)}
                                        >
                                            <i className="ti ti-upload"></i> Import
                                        </Button>

                                        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Select CSV File</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <input
                                                    type="file"
                                                    accept=".csv"
                                                    onChange={handleImport}
                                                    className="form-control"
                                                />
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                                    Cancel
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </div>
                                </div>
                                <div className="col-md-12 d-flex justify-content-between align-items-center">
                                    <div className="col-md-4">
                                        <form className="header-search">
                                            <input type="search" className="form-control" id="searchInput" placeholder="Search here. . ." onChange={(e) => setSearch(e.target.value)} value={search} />
                                        </form>
                                    </div>

                                    <div className="col-md-2">
                                        <select
                                            id="status"
                                            name="status"
                                            className="form-control"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value=""> -- Status --</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive">

                                <table className="table table-hover text-center" id="pc-dt-simple">
                                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                                        <tr>
                                            <th >ID</th>
                                            <th>Bill No</th>
                                            <th>Bill Total</th>
                                            <th>Bill Date</th>
                                            <th>CGST</th>
                                            <th>SGST</th>
                                            <th>Grand Total</th>
                                            <th>Discount</th>
                                            <th>Discount Type</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {
                                            currentItems.map((item, index) => (
                                                <tr key={item._id}
                                                // onClick={() => handlePrint(item._id)}
                                                >
                                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td>{item.billNo}</td>
                                                    <td>{item.billTotal}</td>
                                                    <td> {item.billDate}</td>
                                                    <td>{item.cgst}</td>
                                                    <td>{item.sgst}</td>
                                                    <td>{item.grandTotal}</td>
                                                    <td>{item.discount === 1 ? `${item.discountAmount}%` : `₹${item.discountAmount}`}</td>
                                                    <td>{item.discount === 1 ? "Percentage (%)" : "Fixed (₹)"}</td>

                                                    <td>
                                                        <button className="btn btn-primary btn-sm" style={{ backgroundColor: item.status === "active" ? "#eef9e8" : "#ffeded", color: item.status === "active" ? "#52c41a" : "#ff4d4f", border: 0, borderRadius: 5 }}>
                                                            {item.status}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="btn  btn-sm" data-bs-toggle="modal" data-bs-target="#editModal" style={{ color: "#94a3b8", border: 0 }} onClick={() => handleEdit(item._id)} ><FaRegEdit onClick={handleShowEdit} />
                                                        </button>
                                                        &nbsp; &nbsp;
                                                        <button className="btn  btn-sm" onClick={() => handleDelete(item._id)} style={{ color: "#94a3b8", border: 0 }}><RiDeleteBin6Line />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </table>

                                <div className=' d-flex justify-content-between'>
                                    <div className="mt-2 ms-3" style={{ display: 'inline-block' }}>
                                        {bills.length > 0 ? (
                                            <>
                                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                                {Math.min(currentPage * itemsPerPage, bills.length)} of{' '}
                                                {bills.length} entries
                                            </>
                                        ) : (
                                            <>No entries found</>
                                        )}
                                    </div>

                                    <nav aria-label="Page navigation">
                                        <ul className="pagination justify-content-end">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                                    Previous
                                                </button>
                                            </li>

                                            {[...Array(totalPages)].map((_, index) => (
                                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                                        {index + 1}
                                                    </button>
                                                </li>
                                            ))}

                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>


                    <Modal show={showAddModal} onHide={handleCloseAdd} backdrop="static" keyboard={false} centered scrollable>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Customer Bill</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <div className="card-body">

                                <form onSubmit={insertCustomerBill}>

                                    <div className="row">
                                        {/* Customer ID */}
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="customerId" className="form-label">Customer</label>
                                            <select
                                                id="customerId"
                                                name="customerId"
                                                className="form-control"
                                                value={customerId}
                                                onChange={(e) => setCustomerId(e.target.value)}
                                                required
                                            >
                                                <option value="">-- Select Customer --</option>
                                                {customersData


                                                    .filter(customer => customer.status === "active")
                                                    .map((customer) => (
                                                        <option key={customer._id} value={customer._id}>
                                                            {customer.customers}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        {/* Bill No */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Bill No</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Add Bill No"
                                                onChange={(e) => setBillNo(e.target.value)}
                                                value={billNo}
                                                required
                                            />
                                        </div>

                                        {/* Bill Total */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Bill Total</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                placeholder="Add Bill Total"
                                                onChange={(e) => setBillTotal(e.target.value)}
                                                value={billTotal}
                                                required
                                            />
                                        </div>

                                        {/* Bill Date */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Bill Date</label>
                                            <input
                                                className="form-control"
                                                type="date"
                                                onChange={(e) => setBillDate(e.target.value)}
                                                value={billDate}
                                                required
                                            />
                                        </div>

                                        {/* CGST */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">CGST  (₹)</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                placeholder="Add CGST"
                                                onChange={(e) => setCgst(e.target.value)}
                                                value={cgst}
                                                required
                                            />
                                        </div>

                                        {/* SGST */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">SGST  (₹)</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                placeholder="Add SGST"
                                                onChange={(e) => setSgst(e.target.value)}
                                                value={sgst}
                                                required
                                            />
                                        </div>

                                        {/* Grand Total */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Grand Total</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                placeholder="Grand Total"
                                                onChange={(e) => setGrandTotal(e.target.value)}
                                                value={grandTotal}
                                                required
                                            />
                                        </div>

                                        {/* Discount Type */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Discount Type</label>
                                            <select
                                                id="discount"
                                                name="discount"
                                                className="form-control"
                                                value={discount}
                                                onChange={(e) => setDiscount(e.target.value)}
                                            >
                                                <option value="">-- Select Discount Type --</option>
                                                <option value="1">Percentage (%)</option>
                                                <option value="2">Fixed (₹)</option>
                                            </select>
                                        </div>

                                        {/* Discount Amount */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Discount Amount</label>
                                            <input
                                                id="discountAmount"
                                                name="discountAmount"
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter Discount Amount"
                                                value={discountAmount}
                                                onChange={(e) => setDiscountAmount(e.target.value)}
                                                min="0"
                                                required
                                            />
                                        </div>

                                        {/* Final Total */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Final Total</label>
                                            <input
                                                id="finalTotal"
                                                name="finalTotal"
                                                type="number"
                                                className="form-control"
                                                placeholder="Final Total"
                                                value={finalTotal}
                                                onChange={(e) => setFinalTotal(e.target.value)}
                                                readOnly
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Footer Buttons */}
                                    <div className="text-end pt-3">
                                        <Button variant="secondary" onClick={handleCloseAdd}>
                                            Close
                                        </Button>
                                        &nbsp;
                                        <Button type="submit" variant="primary">
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </div>

                        </Modal.Body>
                    </Modal>


                    {/* Edit Category */}
                    <Modal show={showEditModal} onHide={handleCloseEdit} backdrop="static" keyboard={false} centered scrollable>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit CustomerBill</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="card-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="form-group row mb-0">
                                        <div className="row">
                                            {/* Customer ID */}
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="customerId" className="form-label">Customer</label>
                                                <select
                                                    id="customerId"
                                                    name="customerId"
                                                    className="form-control"
                                                    value={customerId}
                                                    onChange={(e) => setCustomerId(e.target.value)}
                                                    required
                                                >
                                                    <option value="">-- Select Customer --</option>
                                                    {customersData
                                                        .filter(customer => customer.status === "active")
                                                        .map((customer) => (
                                                            <option key={customer._id} value={customer._id}>
                                                                {customer.customers}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>

                                            {/* Bill No */}
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Bill No</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Add Bill No"
                                                    onChange={(e) => setBillNo(e.target.value)}
                                                    value={billNo}
                                                    required
                                                />
                                            </div>

                                            {/* Bill Total */}
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Bill Total</label>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    placeholder="Add Bill Total"
                                                    onChange={(e) => setBillTotal(e.target.value)}
                                                    value={billTotal}
                                                    required
                                                />
                                            </div>

                                            {/* Bill Date */}
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Bill Date</label>
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    onChange={(e) => setBillDate(e.target.value)}
                                                    value={billDate}
                                                    required
                                                />
                                            </div>

                                            {/* CGST */}
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">CGST  (₹)</label>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    placeholder="Add CGST"
                                                    onChange={(e) => setCgst(e.target.value)}
                                                    value={cgst}
                                                    required
                                                />
                                            </div>

                                            {/* SGST */}
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">SGST  (₹)</label>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    placeholder="Add SGST"
                                                    onChange={(e) => setSgst(e.target.value)}
                                                    value={sgst}
                                                    required
                                                />
                                            </div>

                                            {/* Grand Total */}
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Grand Total</label>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    placeholder="Grand Total"
                                                    onChange={(e) => setGrandTotal(e.target.value)}
                                                    value={grandTotal}
                                                    required
                                                />
                                            </div>

                                            {/* Discount Type */}
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Discount Type</label>
                                                <select
                                                    id="discount"
                                                    name="discount"
                                                    className="form-control"
                                                    value={discount}
                                                    onChange={(e) => setDiscount(e.target.value)}
                                                >
                                                    <option value="">-- Select Discount Type --</option>
                                                    <option value="1">Percentage (%)</option>
                                                    <option value="2">Fixed (₹)</option>
                                                </select>
                                            </div>

                                            {/* Discount Amount */}
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Discount Amount</label>
                                                <input
                                                    id="discountAmount"
                                                    name="discountAmount"
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter Discount Amount"
                                                    value={discountAmount}
                                                    onChange={(e) => setDiscountAmount(e.target.value)}
                                                    min="0"
                                                    required
                                                />
                                            </div>

                                            {/* Final Total */}
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Final Total</label>
                                                <input
                                                    id="finalTotal"
                                                    name="finalTotal"
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Final Total"
                                                    value={finalTotal}
                                                    onChange={(e) => setFinalTotal(e.target.value)}
                                                    readOnly
                                                    required
                                                />
                                            </div>

                                            <div className="form-group row mb-3" style={{ fontSize: '18px' }}>
                                                <label className="col-form-label text-lg-start">Status</label>
                                                <div>
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="statusSwitch"
                                                            checked={status === "active"}
                                                            onChange={(e) => setStatus(e.target.checked ? "active" : "inactive")}
                                                        />
                                                        <label className="form-check-label" htmlFor="statusSwitch">
                                                            {status === "active" ? "Active" : "Inactive"}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-end p-3 pb-md-3">
                                        <Button variant="secondary" onClick={handleCloseEdit}>
                                            Close
                                        </Button>
                                        &nbsp;&nbsp;
                                        <Button variant="primary" type='submit'>
                                            Upadate
                                        </Button>
                                    </div>
                                </form>
                            </div>

                        </Modal.Body>
                    </Modal>

                </div>
            </div>
        </>
    )

}
export default CustomerBill;