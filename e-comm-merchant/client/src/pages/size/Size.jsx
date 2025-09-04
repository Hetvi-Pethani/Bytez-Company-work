import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/header';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { authFetch } from '../../../middleware/authfetch';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const Size = () => {

    const navigate = useNavigate();

    const [size, setSize] = useState("");
    const [status, setStatus] = useState("");
    const [sizeData, setSizeData] = useState([]);
    const [editSize, setEditSize] = useState("");
    const [editId, setEditId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredSizes, setFilteredSizes] = useState([]);


    const handleCloseAdd = () => setShowAddModal(false);
    const handleShowAdd = () => setShowAddModal(true);
    const handleCloseEdit = () => setShowEditModal(false);
    const handleShowEdit = () => setShowEditModal(true);
      const [showModal, setShowModal] = useState(false);
    

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(filteredSizes.length / itemsPerPage);
    const currentItems = filteredSizes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
    }, []);


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            let filtered = [...sizeData];

            if (search !== "") {
                filtered = filtered.filter(value =>
                    value.size.toLowerCase().includes(search.toLowerCase())
                );
            }

            if (status !== "") {
                filtered = filtered.filter(item => item.status === status);
            }

            setFilteredSizes(filtered);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [search, sizeData, status]);


    useEffect(() => {
        fetchSizes(search);
    }, [search]);


    const fetchSizes = async (search = '') => {
        try {
            const response = await authFetch(
                `http://localhost:8000/size/getsizes?search=${encodeURIComponent(search)}`,
                {
                    method: 'GET'
                }
            )
            const data = await response.json();
            if (response.ok) {
                setSizeData(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const insertSize = async (e) => {
        e.preventDefault();

        const trimmedSize = size.trim().toLowerCase();

        const sizeExists = sizeData.some(
            item => item.size.trim().toLowerCase() === trimmedSize
        );
        if (sizeExists) {
            handleShowAdd();
            toast.error("size already exists");
            return;
        }


        try {
            const sizedata = {
                size: size,
            };
            const response = await authFetch('http://localhost:8000/size/insertsize', {
                method: 'POST',
                body: JSON.stringify(sizedata)
            });
            const data = await response.json();

            if (response.ok) {
                toast.success("Size Added Successfully");
                setSize("");
                handleCloseAdd();
                fetchSizes();
            } else {
                toast.error("Size Not Added");
            }

        } catch (error) {
            console.error('Error adding size:', error);
            toast.error("Error adding size");
        }
    }

    const handleEdit = (id) => {
        const sizeToEdit = sizeData.find(item => item._id === id);
        setSize(sizeToEdit.size);

        setStatus(sizeToEdit.status);
        if (sizeToEdit) {
            setEditId(id);
            setEditSize(sizeToEdit.size);
            handleShowEdit();
        }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();

        const trimmedSize = editSize.trim().toLowerCase();

        const sizeExists = sizeData.some(
            item =>
                item._id !== editId &&
                item.size.trim().toLowerCase() === trimmedSize &&
                !item.deleted_at
        );

        if (sizeExists) {
            handleCloseEdit();
            toast.error("Size already exists");
            return;
        }


        try {
            const sizedata = {
                size: editSize,
                editid: editId,
                status: status
            }
            const response = await authFetch('http://localhost:8000/size/updatesize', {
                method: 'POST',
                body: JSON.stringify(sizedata)
            });
            const data = await response.json();

            if (response.ok) {
                toast.success("Size Updated Successfully");
                handleCloseEdit();
                setSize("");
                fetchSizes();

            } else {
                toast.error("Size Not Updated");
            }
        } catch (error) {
            console.error('Error updating size:', error);
            toast.error("Error updating size");
        }
    }

    const handleDelete = async (id) => {

        if (window.confirm("Are you sure you want to delete this size?")) {
            try {
                const response = await authFetch('http://localhost:8000/size/deletesize', {
                    method: 'POST',
                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    toast.success("Size Deleted Successfully");
                    fetchSizes();

                } else {
                    toast.error("Size Not Deleted");
                }
            } catch (error) {
                console.error('Error deleting size:', error);
                toast.error("Error deleting size");
            }
        }
    }

    const handleExport = async () => {
        try {
            const response = await authFetch('http://localhost:8000/size/export', {
                method: 'GET',
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'sizes.csv';
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
            const response = await fetch('http://localhost:8000/size/import', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Sizes imported successfully!');
                fetchSizes();
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
            <div className="pc-container  p-3" style={{ top: "65px" }}>
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-4 d-flex ">
                            <div className="page-header-title">
                                <h3 className="mb-3">Size</h3>
                            </div>
                        </div>
                    </div>

                </div>

                {/* View Size */}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header pb-0 p-3" >
                                <div className="d-flex justify-content-between">
                                    <Button variant="primary" style={{ fontWeight: "bold" }} onClick={handleShowAdd}>
                                        <i className="ti ti-plus" style={{ fontSize: "13px" }}></i> Add Size
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
                                <table className="table table-hover text-center" >
                                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                                        <tr>
                                            <th>ID</th>
                                            <th>Size</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentItems.map((item, index) => (
                                                <tr key={item._id}>
                                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td>{item.size}</td>

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
                            </div>

                            <div className=' d-flex justify-content-between'>
                                <div className="mt-2 ms-3" style={{ display: 'inline-block' }}>
                                    {filteredSizes.length > 0 ? (
                                        <>
                                            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                            {Math.min(currentPage * itemsPerPage, filteredSizes.length)} of{' '}
                                            {filteredSizes.length} entries
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

                    {/* Add Size */}
                    <Modal show={showAddModal} onHide={handleCloseAdd} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Add size</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <div className="card-body">
                                <form onSubmit={insertSize}>
                                    <div className="form-group row mb-0">
                                        <label className="form-label m-0 fw-semibold"> Size</label>
                                        <div>
                                            <div className="typeahead">
                                                <input className="form-control" name="size" type="text" placeholder="Add Size" onChange={(e) => setSize(e.target.value)} value={size} required />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-end ">
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

                    {/* Edit Size */}
                    <Modal show={showEditModal} onHide={handleCloseEdit} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit size</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <div className="card-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="form-group row mb-0">
                                        <label className="form-label m-0 fw-semibold">Edit Size</label>
                                        <div>
                                            <div className="typeahead">
                                                <input className="form-control" name="size" type="text" placeholder="Edit Size" onChange={(e) => setEditSize(e.target.value)} value={editSize} required />
                                            </div>

                                            <div className="form-group row mb-3" style={{ fontSize: '18px' }}>
                                                <label className="form-label m-0 fw-semibold">Status</label>
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
                                            {/* <div class="form-group row mb-3">
                                                <label class="col-form-label text-lg-start">Status</label>
                                                <div>
                                                    <select class="form-select" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                    </select>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                    <div className="text-end">
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

export default Size;
