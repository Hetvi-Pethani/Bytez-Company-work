import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/header';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { authFetch } from '../../../middleware/authfetch';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const Customers = () => {

    const [customers, setCustomers] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [location, setLocation] = useState("");

    const [status, setStatus] = useState("");
    const [image, setImage] = useState(null);
    const [customersData, setCustomersData] = useState([]);
    const [editCustomers, setEditCustomers] = useState("");
    const [editLocation, setEditLocation] = useState("");
    const [editContact, setEditContact] = useState("");
    const [editEmail, setEditEmail] = useState("");

    const [editId, setEditId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchKeywords, setSearchKeywords] = useState('');
    const navigate = useNavigate();

    const handleCloseAdd = () => setShowAddModal(false);
    const handleShowAdd = () => setShowAddModal(true);
    const handleCloseEdit = () => setShowEditModal(false);
    const handleShowEdit = () => setShowEditModal(true);
    const [showModal, setShowModal] = useState(false);


    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const currentItems = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
    }, []);



    // const handleRowClick = (id) => {
    //     navigate(`/invoiceprint/${id}`);
    // };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            let filtered = [...customersData];

            if (search !== "") {
                const lowerSearch = search.toLowerCase();
                filtered = filtered.filter(value =>
                    value.customers.toLowerCase().includes(lowerSearch)
                );
            }

            if (status !== "") {    
                filtered = filtered.filter(item => item.status === status);
            }

            setFilteredCustomers(filtered);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [search, customersData, status]);

    useEffect(() => {
        fetchCustomers(search);
    }, [search]);


    // const fetchCustomers = async () => {
    //     try {
    //         const response = await authFetch('http://localhost:8000/customers/getcustomers', {
    //             method: 'GET',
    //         });

    //         const data = await response.json();

    //         if (response.ok) {
    //             setCustomersData(data);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching customers:', error);
    //     }
    // };


    const fetchCustomers = async (searchTerm = '') => {
        try {
            const response = await authFetch(`http://localhost:8000/customers/getcustomers?search=${encodeURIComponent(searchTerm)}`, {
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

    const insertCustomers = async (e) => {
        e.preventDefault();

        const trimmedCustomers = customers.trim().toLowerCase();
        const customersExists = customersData.some(
            item => item.customers?.trim().toLowerCase() === trimmedCustomers && !item.deleted_at
        );
        if (customersExists) {
            handleShowAdd();
            toast.error("Customer already exists");
            return;
        }

        try {
            const searchKeywords = customers.split(/\s+/).join(',');
            const formData = new FormData();
            formData.append('customers', customers);
            formData.append('email', email);
            formData.append('contact', contact);
            formData.append('location', location);
            formData.append('searchKeywords', searchKeywords);

            const response = await fetch('http://localhost:8000/customers/insertcustomers', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("customers Added Successfully");
                setCustomers("");
                setContact("");
                setEmail("");
                setLocation("");
                setSearchKeywords('');
                handleCloseAdd();
                fetchCustomers();
            } else {
                toast.error("customers Not Added");
            }

        } catch (error) {
            console.error('Error adding customers:', error);
            toast.error("Error adding customers");
        }
    }

    const handleEdit = (id) => {
        const customersToEdit = customersData.find(item => item._id === id);
        setCustomers(customersToEdit.customers);
        setLocation(customersToEdit.location);
        setEmail(customersToEdit.email);
        setContact(customersToEdit.contact);
        setStatus(customersToEdit.status);
        setImage(customersToEdit.image);
        if (customersToEdit) {
            setEditId(id);
            setEditCustomers(customersToEdit.customers);
            setEditLocation(customersToEdit.location);
            setEditContact(customersToEdit.contact);
            setEditEmail(customersToEdit.email);

            handleShowEdit();
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {

            const formData = {
                customers: editCustomers,
                location: editLocation,
                contact: editContact,
                email: editEmail,
                status: status,
                editid: editId
            }


            const response = await authFetch('http://localhost:8000/customers/updatecustomers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                toast.success("customers Updated Successfully");
                handleCloseEdit();
                setLocation("");
                setCustomers("");
                setContact("");
                setEditId("");
                setStatus("");
                setEmail("");
                fetchCustomers();
            } else {
                toast.error("customers Not Updated");
            }
        } catch (error) {
            console.error('Error updating customers:', error);
            toast.error("Error updating customers");
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this customers?")) {
            try {
                const response = await authFetch('http://localhost:8000/customers/deletecustomers', {
                    method: 'POST',
                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    toast.success("customers Deleted Successfully");
                    fetchCustomers();

                } else {
                    toast.error("customers Not Deleted");
                }
            } catch (error) {
                console.error('Error deleting customers:', error);
                toast.error("Error deleting customers");
            }
        }
    }

    const handleExport = async () => {
        try {
            const response = await authFetch('http://localhost:8000/customers/export', {
                method: 'GET',
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'customers.csv';
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
            const response = await fetch('http://localhost:8000/customers/import', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('customers imported successfully!');
                fetchCustomers();
            } else {
                toast.error(result.message || 'Import failed');
            }
        } catch (error) {
            console.error('Import error:', error);
            toast.error('Error importing file');
        }
    };


    return (
        <div>
            <Header />
            <div className="pc-container p-3" style={{ top: "65px" }}>

                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-4 d-flex ">
                            <div className="page-header-title">
                                <h3 className="mb-3">Customers List</h3>
                            </div>
                        </div>
                    </div>

                </div>

                {/* View customers */}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header pb-0 p-3">
                                <div className="d-flex justify-content-between">
                                    <Button variant="primary" style={{ fontWeight: "bold" }} onClick={handleShowAdd}>
                                        {/* <i className="ti ti-plus" style={{ fontSize: "13px" }}></i> Add Customer */}
                                    </Button>
                                    <div className="d-flex gap-2">
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
                                    {/* <div>
                                        <div
                                            className="dataTables_length"
                                            id="dom-table_length"
                                            style={{ display: 'inline-block', verticalAlign: 'middle' }}
                                        >
                                            <label className="form-label mb-0 me-2" style={{ display: 'inline-block' }}>
                                                Show
                                            </label>
                                            <select
                                                name="dom-table_length"
                                                aria-controls="dom-table"
                                                className="form-select form-select-sm d-inline-block"
                                                style={{ width: 'auto', display: 'inline-block' }}
                                                value={itemsPerPage}
                                                onChange={(e) => {
                                                    setItemsPerPage(Number(e.target.value));
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                            <span className="ms-2">entries</span>
                                        </div>
                                    </div> */}
                                    <div className="col-md-2">
                                        <select
                                            id="status"
                                            name="status"
                                            className="form-control"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}>
                                            <option value=""> -- Status --</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover text-start" id="pc-dt-simple">
                                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                                        <tr>
                                            <th >ID</th>
                                            <th>Customer Name</th>
                                            <th>Email</th>
                                            <th>Contact </th>
                                            <th>Locaion</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody >
                                        {
                                            currentItems.map((item, index) => (

                                                <tr key={item._id}
                                                // onClick={() => handleRowClick(item._id)}
                                                // style={{ cursor: "pointer" }}
                                                >

                                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>

                                                    <td>  {item.customers}
                                                    </td>
                                                    <td>{item.email}</td>
                                                    <td> {item.contact}</td>
                                                    <td>{item.location}</td>

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
                                        {filteredCustomers.length > 0 ? (
                                            <>
                                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                                {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of{' '}
                                                {filteredCustomers.length} entries
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


                    {/* Add customers */}
                    {/* <Modal show={showAddModal} onHide={handleCloseAdd} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Add customers</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="card-body">
                                <form onSubmit={insertCustomers}>
                                    <div className="form-group row mb-0">
                                        <label className="col-form-label text-lg-start">Add customers</label>
                                        <div>
                                            <div className="typeahead">
                                                <input className="form-control" name="customers" type="text" placeholder="Add customers" onChange={(e) => setCustomers(e.target.value)} value={customers} required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group row mb-0">
                                        <label className="col-form-label text-lg-start">Email</label>
                                        <div>
                                            <div className="typeahead">
                                                <input className="form-control" name="email" type="email" placeholder="Add Email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row mb-0">
                                        <label className="col-form-label text-lg-start">Contact</label>
                                        <div>
                                            <div className="typeahead">
                                                <input className="form-control" name="contact" type="mobile" minLength={10} maxLength={10} pattern="[0-9]{10}" placeholder="Add Contact" onChange={(e) => setContact(e.target.value)} value={contact} required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row mb-0">
                                        <label className="col-form-label text-lg-start">Location</label>
                                        <div>
                                            <div className="typeahead">
                                                <input className="form-control" name="location" type="location" placeholder="Add Location" onChange={(e) => setLocation(e.target.value)} value={location} required />
                                            </div>
                                        </div>
                                    </div>


                                    <div className="form-group row mb-3">
                                        <label className="col-form-label  text-lg-start">Image</label>
                                        <div>
                                            <div className="typeahead">
                                                <input className="form-control" name="image" type="file" placeholder="Image" onChange={(e) => setImage(e.target.files[0])} />
                                            </div>
                                        </div>
                                    </div>
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
                    </Modal> */}

                    {/* Edit customers */}
                    <Modal show={showEditModal} onHide={handleCloseEdit} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit customers</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="card-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="row"  >
                                        <label className="col-form-label text-lg-start">Edit customers</label>
                                        <div>
                                            <div className="typeahead">
                                                <input className="form-control" name="customers" type="text" placeholder="Edit customers" onChange={(e) => setEditCustomers(e.target.value)} value={editCustomers} required />
                                            </div>


                                            <div className="form-group row mb-0">
                                                <label className="col-form-label text-lg-start">Email</label>
                                                <div>
                                                    <div className="typeahead">
                                                        <input className="form-control" name="contact" type="email" placeholder="Add Email" onChange={(e) => setEditEmail(e.target.value)} value={editEmail} required />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row mb-0">
                                                <label className="col-form-label text-lg-start">Contact</label>
                                                <div>
                                                    <div className="typeahead">
                                                        <input className="form-control" name="contact" type="number" placeholder="Add Contact" minLength={10} maxLength={10} pattern="[0-9]{10}" onChange={(e) => setEditContact(e.target.value)} value={editContact} required />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group row mb-0">
                                                <label className="col-form-label text-lg-start">Location</label>
                                                <div>
                                                    <div className="typeahead">
                                                        <input className="form-control" name="location" type="location" placeholder="Add Location" onChange={(e) => setEditLocation(e.target.value)} value={editLocation} required />
                                                    </div>
                                                </div>
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
            </div >
        </div >
    );
}

export default Customers;
