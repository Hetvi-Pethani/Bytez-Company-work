import React, { useState, useEffect } from 'react';
import Header from '../../component/Header/header';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { authFetch } from '../../../middleware/authfetch';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const Color = () => {

    const [color, setColor] = useState("");
    const [status, setStatus] = useState("");
    const [colorData, setColorData] = useState([]);
    const [editColor, setEditColor] = useState("");

    const [editId, setEditId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredColors, setFilteredColors] = useState([]);
    const [searchKeywords, setSearchKeywords] = useState('');


    const handleCloseAdd = () => setShowAddModal(false);
    const handleShowAdd = () => setShowAddModal(true);
    const handleCloseEdit = () => setShowEditModal(false);
    const handleShowEdit = () => setShowEditModal(true);
      const [showModal, setShowModal] = useState(false);
    

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(filteredColors.length / itemsPerPage);
    const currentItems = filteredColors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
    }, []);


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            let filtered = [...colorData];

            if (search !== "") {
                filtered = filtered.filter(value =>
                    value.color.toLowerCase().includes(search.toLowerCase())
                );
            }

            if (status !== "") {
                filtered = filtered.filter(item => item.status === status);
            }

            setFilteredColors(filtered);
        }, 300);


        return () => clearTimeout(delayDebounce);
    }, [search, colorData, status]);


    useEffect(() => {
        fetchColors(search);
    }, [search]);


    const fetchColors = async (search = '') => {
        try {
            const response = await authFetch(
                `http://localhost:8000/color/getcolors?search=${encodeURIComponent(search)}`,
                {
                    method: 'GET'
                }
            );
            const data = await response.json();
            if (response.ok) {
                setColorData(data);
            } else {
                console.error('Fetch failed:');
            }
        } catch (error) {
            console.error('Error fetching colors:');
        }
    };



    const insertColor = async (e) => {
        e.preventDefault();

        const trimmedColor = color.trim().toLowerCase();

        const colorExists = colorData.some(
            item => item.color.trim().toLowerCase() === trimmedColor
        );

        if (colorExists) {
            handleShowAdd();
            toast.error("Color already exists");
            return;
        }

        const searchKeywords = trimmedColor.split(/\s+/).join(',');

        try {
            const colordata = {
                color: color,
                searchKeywords
            };

            const response = await authFetch('http://localhost:8000/color/insertcolor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(colordata)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Color added successfully");
                setColor("");
                setSearchKeywords("");
                handleCloseAdd();
                fetchColors();
            } else {
                toast.error("Color not added");
            }

        } catch (error) {
            console.error('Error adding color:', error);
            toast.error("Error adding color");
        }
    };


    const handleEdit = (id) => {
        const colorToEdit = colorData.find(item => item._id === id);
        setColor(colorToEdit.color);
        setStatus(colorToEdit.status);
        if (colorToEdit) {
            setEditId(id);
            setEditColor(colorToEdit.color);
            handleShowEdit();
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const trimmedColor = editColor.trim().toLowerCase();

        const colorExists = colorData.some(
            item =>
                item._id !== editId &&
                item.color.trim().toLowerCase() === trimmedColor
        );

        if (colorExists) {
            handleShowEdit();
            toast.error("Color already exists");
            return;
        }


        try {
            const colordata = {
                color: editColor,
                editid: editId,
                status: status
            }
            const response = await authFetch('http://localhost:8000/color/updatecolor', {
                method: 'POST',
                body: JSON.stringify(colordata)
            });
            const data = await response.json();

            if (response.ok) {
                toast.success("color Updated Successfully");
                handleCloseEdit();
                fetchColors();

            } else {
                toast.error("color Not Updated");
            }
        } catch (error) {
            console.error('Error updating color:', error);
            toast.error("Error updating color");
        }
    }

    const handleDelete = async (id) => {

        if (window.confirm("Are you sure you want to delete this color?")) {
            try {
                const response = await authFetch('http://localhost:8000/color/deletecolor', {
                    method: 'POST',
                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    toast.success("color Deleted Successfully");
                    fetchColors();

                } else {
                    toast.error("color Not Deleted");
                }
            } catch (error) {
                console.error('Error deleting color:', error);
                toast.error("Error deleting color");
            }
        }
    }

    const handleExport = async () => {
        try {
            const response = await authFetch('http://localhost:8000/color/export', {
                method: 'GET',
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'colors.csv';
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
            const response = await fetch('http://localhost:8000/color/import', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Color imported successfully!');
                fetchColors();
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
                        <div className="md-4 d-flex ">
                            <div className="page-header-title">
                                <h3 className="mb-3">Color</h3>
                            </div>
                        </div>
                    </div>

                </div>

                {/* View color */}
                <div className="row">
                    <div className="sm-12">
                        <div className="card">
                            <div className="card-header  pb-0 p-3" >
                                <div className="d-flex justify-content-between">
                                    <Button variant="primary" style={{ fontWeight: "bold" }} onClick={handleShowAdd}>
                                        <i className="ti ti-plus" style={{ fontSize: "13px" }}></i> Add Color
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
                                <div className="md-12 d-flex justify-content-between align-items-center">
                                    <div className="md-4">
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
                                <table className="table table-hover text-center" >
                                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                                        <tr>
                                            <th>ID</th>
                                            <th>Color</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentItems.map((item, index) => (
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.color}</td>

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
                                        {filteredColors.length > 0 ? (
                                            <>
                                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                                {Math.min(currentPage * itemsPerPage, filteredColors.length)} of{' '}
                                                {filteredColors.length} entries
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


                    {/* Add color */}
                    <Modal show={showAddModal} onHide={handleCloseAdd} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Add color</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <div className="card-body">
                                <form onSubmit={insertColor}>
                                    <div className="form-group row mb-0">
                                        <label className="form-label m-0 fw-semibold"> Color</label>
                                        <div>
                                            <div className="typeahead">
                                                <input className="form-control" name="color" type="text" placeholder="Add color" onChange={(e) => setColor(e.target.value)} value={color} required />
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

                    {/* Edit color */}
                    <Modal show={showEditModal} onHide={handleCloseEdit} backdrop="static" keyboard={false} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit color</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <div className="card-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="form-group row mb-0">
                                        <label className="form-label m-0 fw-semibold">Edit color</label>
                                        <div>
                                            <div className="typeahead">
                                                <input className="form-control" name="color" type="text" placeholder="Edit color" onChange={(e) => setEditColor(e.target.value)} value={editColor} required />
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

export default Color;
