import { authFetch } from "../../../middleware/authfetch";
import Header from "../../component/Header/header";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'


const CustomerBillItem = () => {

    const navigate = useNavigate();

    const [qty, setQty] = useState('');
    const [rate, setRate] = useState("");

    const [customerId, setCustomerId] = useState('');
    const [customerBillId, setCustomerBillId] = useState('');
    const [stockId, setStockId] = useState('');
    const [productId, setProductId] = useState('');
    const [products, setProducts] = useState([]);
    const [customersData, setCustomersData] = useState([]);
    const [customeBills, setCustomerBills] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [status, setStatus] = useState('');
    const [editId, setEditId] = useState(null)
    const [search, setSearch] = useState('')
    const [filteredCustomersbillitem, setFilteredCustomersbillitem] = useState([]);


    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleCloseAdd = () => setShowAddModal(false);
    const handleShowAdd = () => setShowAddModal(true);
    const handleCloseEdit = () => setShowEditModal(false);
    const handleShowEdit = () => setShowEditModal(true);
    const [showModal, setShowModal] = useState(false);



    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(filteredCustomersbillitem.length / itemsPerPage);
    const currentItems = filteredCustomersbillitem.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
    }, []);


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


    const fetchCustomers = async () => {
        try {
            const response = await authFetch(`http://localhost:8000/customers/getcustomers`, {
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
            const response = await authFetch("http://localhost:8000/customerBill/getcustomerbills", {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();

            if (data.success) {
                setCustomerBills(data.data);
            } else {
                toast.error("Failed to fetch bills");
            }
        } catch (error) {
            console.error("Error fetching bills:", error);
        }
    };

    const fetchStock = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await authFetch('http://localhost:8000/stock/getstocks', {
                method: 'GET',
            })
            const data = await response.json();
            if (response.ok) {
                setStockData(data);
            }
        }

        catch (error) {
            console.error('Error fetching product:', error);
        }
    }
    const fetchProduct = async () => {
        try {

            const response = await authFetch(`http://localhost:8000/product/getproducts`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = await response.json();
            if (response.ok) {
                setProducts(data);
            }
        }
        catch (error) {
            console.error('Error fetching product:', error);
        }
    }


    useEffect(() => {
        fetchCustomers(search);
        fetchCustomerBills(search);
        fetchStock(search);
        fetchItems(search);
        fetchProduct(search);
    }, [search]);


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            let filtered = [...itemsData];

            if (search !== "") {
                const lowerSearch = search.toLowerCase();
                filtered = filtered.filter(value =>
                    value.customer.toLowerCase().includes(lowerSearch)
                );
            }

            if (status !== "") {
                filtered = filtered.filter(item => item.status === status);
            }

            setFilteredCustomersbillitem(filtered);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search, itemsData, status]);

    const [productList, setProductList] = useState([
        {
            id: `prod-${Date.now()}`,
            stockId,
            productId,
            rate: 0,
            qty: 1,
            amount: 0,
        }
    ]);

    const handlePrint = (billitems) => {
        navigate('/invoiceprint', { state: { billitemsData:billitems} });
    };


    const insertcustomerbillitem = async (e) => {
        e.preventDefault();

        const customerbillitemExists = itemsData.some(
            item => item.customerId === customerId
        );

        if (customerbillitemExists) {
            handleShowAdd();
            toast.error("Customer Bill Item already exists for this customer");
            return;
        }

        const payload = {
            customerBillId,
            customerId,
            productList: productList.map(item => ({
                stockId,
                productId,
                qty: (item.qty || 1),
                rate: Number(item.rate),
                amount: Number(item.amount) || (item.qty * item.rate),
            }))
        };


        try {
            const response = await authFetch("http://localhost:8000/customerbillitem/insertcustomerbillitem", {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Item inserted successfully");
                setCustomerId("");
                setStockId("");
                setCustomerBillId("");
                setProductList([]);
                fetchCustomerBills();
                fetchItems();
                handleCloseAdd();
            } else {
                toast.error(data.message || "Failed to insert item");
            }
        } catch (error) {
            console.error("Error inserting item:", error);
            toast.error("Error inserting item");
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }
        const response = await authFetch("http://localhost:8000/customerBillItem/deletecustomerbillitem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            toast.success("customers Deleted Successfully");
            fetchItems();
        }

    };

    const handleEdit = async (id) => {
        const custbillToEdit = itemsData.find(item => item._id === id);
        if (custbillToEdit) {
            setEditId(id);
            setCustomerId(custbillToEdit.customerId);
            setCustomerBillId(custbillToEdit.customerBillId);
            setStockId(custbillToEdit.stockId);
            setProductId(custbillToEdit.productId);
            setQty(custbillToEdit.qty);
            setStatus(custbillToEdit.status);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!editId) {
            toast.error("No item selected to update");
            return;
        }

        const updatedData = {
            editId,
            customerId,
            customerBillId,
            stockId,
            productId,
            qty,
            rate,
            amount: qty * rate,
            status
        };

        try {
            const response = await authFetch("http://localhost:8000/customerbillitem/updatecustomerbillitem", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success("Customer Bill Item updated successfully");
                setEditId("");
                setCustomerId("");
                setCustomerBillId("");
                setStockId("");
                setProductId("");
                setQty("");
                setRate("");
                setStatus("");
                fetchItems("");
                setProductList([]);
                handleCloseEdit();
            } else {
                toast.error(data.message || "Failed to update CustomerBillItem");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Error updating item");
        }
    };



    const handleExport = async () => {
        try {
            const response = await authFetch('http://localhost:8000/customerbillitem/export', {
                method: 'GET',

            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'customerbillitems.csv';
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
            const response = await fetch('http://localhost:8000/customerbillitem/import', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('customerbill imported successfully!');
                fetchItems();
            } else {
                toast.error(result.message || 'Import failed');
            }
        } catch (error) {
            console.error('Import error:', error);
            toast.error('Error importing file');
        }
    };


    return (

        <>
            <Header />
            <div className="pc-container p-3" style={{ top: "65px" }}>

                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-4 d-flex ">
                            <div className="page-header-title">
                                <h3 className="mb-3">CustomersBillItem</h3>
                            </div>
                        </div>
                    </div>
                </div>


                {/* View  CustomersBillItem */}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header pb-0 p-3" >
                                <div className="d-flex justify-content-between">
                                    <Button variant="primary" style={{ fontWeight: "bold" }} onClick={handleShowAdd}>
                                        <i className="ti ti-plus" style={{ fontSize: "13px" }}></i> Add CustomerBillItem
                                    </Button>
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
                                            <th>Customer</th>
                                            <th>Customer Bill</th>
                                            <th>Product Details</th>
                                            <th> Amount</th>
                                            <th>Qty</th>
                                            <th>rate</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {
                                            currentItems.map((item, index) => (
                                                <tr key={item._id}
                                                    onClick={() => handlePrint(item._id)}

                                                >
                                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td>{item.customer}</td>
                                                    <td> {item.billNo}</td>
                                                    <td>{item.productName}</td>
                                                    <td> {item.amount}</td>
                                                    <td>{item.qty}</td>
                                                    <td> {item.rate}</td>
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
                                        {filteredCustomersbillitem.length > 0 ? (
                                            <>
                                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                                {Math.min(currentPage * itemsPerPage, filteredCustomersbillitem.length)} of{' '}
                                                {filteredCustomersbillitem.length} entries
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


                    {/* Add  customerbill item */}
                    <Modal show={showAddModal} onHide={handleCloseAdd} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Add CustomerBill Item</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="card-body">
                                <form onSubmit={insertcustomerbillitem}>
                                    <div className="form-group row mb-2">
                                        <label className="col-form-label">Customer</label>
                                        <div>
                                            <select className="form-control" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
                                                <option value="">-- Select Customer --</option>
                                                {customersData

                                                    .filter(cust => cust.status === "active")
                                                    .map((cust) => (
                                                        <option key={cust._id} value={cust._id}>
                                                            {cust.customers}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group row mb-2">
                                        <label className="col-form-label">Customer Bill</label>
                                        <div>
                                            <select className="form-control" value={customerBillId} onChange={(e) => setCustomerBillId(e.target.value)} required>
                                                <option value="">-- Select Bill --</option>
                                                {customeBills

                                                    .filter(bill => bill.status === "active")
                                                    .map((bill) => (
                                                        <option key={bill._id} value={bill._id}>
                                                            {bill.billNo}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>


                                    <div className="form-group row mb-2">
                                        <label className="col-form-label">Product</label>
                                        <div>
                                            <select className="form-control" value={productId} onChange={(e) => setProductId(e.target.value)} required>
                                                <option value=""> -- Select Product --</option>
                                                {products

                                                    .filter(product => product.status === "active")
                                                    .map((product) => (
                                                        <option key={product._id} value={product._id}>
                                                            {product.product}
                                                        </option>

                                                    ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* <div className="form-group row mb-2">
                                        <label className="col-form-label">amount</label>
                                        <div>
                                            <select className="form-control" value={stockId} onChange={(e) => setStockId(e.target.value)} required>
                                                <option value=""> -- Select amount --</option>
                                                {stockData

                                                    .filter(stock => stock.status === "active")
                                                    .map((stock) => (
                                                        <option key={stock._id} value={stock._id}>
                                                            {stock.amount}
                                                        </option>

                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row mb-2">
                                        <label className="col-form-label">rate</label>
                                        <div>
                                            <select className="form-control" value={stockId} onChange={(e) => setStockId(e.target.value)} required>
                                                <option value=""> -- Select rate --</option>
                                                {stockData

                                                    .filter(stock => stock.status === "active")
                                                    .map((stock) => (
                                                        <option key={stock._id} value={stock._id}>
                                                            {stock.rate}
                                                        </option>

                                                    ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group row mb-2">
                                        <label className="col-form-label">qty</label>
                                        <div>
                                            <select className="form-control" value={stockId} onChange={(e) => setStockId(e.target.value)} required>
                                                <option value=""> -- Select qty --</option>
                                                {stockData

                                                    .filter(stock => stock.status === "active")
                                                    .map((stock) => (
                                                        <option key={stock._id} value={stock._id}>
                                                            {stock.qty}
                                                        </option>

                                                    ))}
                                            </select>
                                        </div>
                                    </div> */}


                                    <div className="text-end p-3 pb-md-3">
                                        <Button variant="secondary" onClick={handleCloseAdd}>
                                            Close
                                        </Button>
                                        &nbsp;
                                        <Button type='submit' variant="primary">
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </div>

                        </Modal.Body>
                    </Modal>



                    {/* Edit  customerbill item */}

                    <Modal show={showEditModal} onHide={handleCloseEdit} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit CustomerBillItem</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <div className="card-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="form-group row mb-0">
                                        <div>
                                            <label className="col-form-label ">Customer ID</label>
                                            <select
                                                className="form-control"
                                                value={customerId}
                                                onChange={(e) => setCustomerId(e.target.value)} required>
                                                <option value="">-- Select Customer --</option>
                                                {customersData

                                                    .filter(customer => customer.status === "active")
                                                    .map((customer) => (
                                                        <option key={customer._id} value={customer._id}>
                                                            {customer.customers}
                                                        </option>
                                                    ))}
                                            </select>

                                            <div className="form-group row mb-2">
                                                <label className="col-form-label"> Customer Bill </label>
                                                <div>
                                                    <select className="form-control" value={customerBillId} onChange={(e) => setCustomerBillId(e.target.value)} required>
                                                        <option value="">-- Select Bill --</option>
                                                        {customeBills

                                                            .filter(bill => bill.status === "active")
                                                            .map((bill) => (
                                                                <option key={bill._id} value={bill._id}>
                                                                    {bill.billNo}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>


                                            <div className="form-group row mb-2">
                                                <label className="col-form-label">Product</label>
                                                <div>
                                                    <select className="form-control" value={productId} onChange={(e) => setProductId(e.target.value)} required>
                                                        <option value=""> -- Select Product --</option>
                                                        {products

                                                            .filter(product => product.status === "active")
                                                            .map((product) => (
                                                                <option key={product._id} value={product._id}>
                                                                    {product.product}
                                                                </option>

                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row mb-2">
                                                <label className="col-form-label">Amount</label>
                                                <div>
                                                    <select className="form-control" value={stockId} onChange={(e) => setStockId(e.target.value)} required>
                                                        <option value=""> -- Select rate --</option>
                                                        {stockData

                                                            .filter(stock => stock.status === "active")
                                                            .map((stock) => (
                                                                <option key={stock._id} value={stock._id}>
                                                                    {stock.rate}
                                                                </option>

                                                            ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="form-group row mb-2">
                                                <label className="col-form-label">qty</label>
                                                <div>
                                                    <select className="form-control" value={stockId} onChange={(e) => setStockId(e.target.value)} required>
                                                        <option value=""> -- Select qty --</option>
                                                        {stockData

                                                            .filter(stock => stock.status === "active")
                                                            .map((stock) => (
                                                                <option key={stock._id} value={stock._id}>
                                                                    {stock.qty}
                                                                </option>

                                                            ))}
                                                    </select>
                                                </div>
                                            </div>

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
                                    <div className="text-end p-3 pb-md-3">
                                        <Button variant="secondary" onClick={handleCloseEdit}>
                                            Close
                                        </Button>
                                        &nbsp;&nbsp;
                                        <Button variant="primary" type='submit' >
                                            Upadate
                                        </Button>
                                    </div>
                                </form>
                            </div>

                        </Modal.Body>
                    </Modal>



                </div>
            </div >


        </>
    )

}

export default CustomerBillItem;