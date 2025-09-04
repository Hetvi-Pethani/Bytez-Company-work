import React, { useState, useEffect } from "react";
import Header from "../../component/Header/header";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { authFetch } from "../../../middleware/authfetch";

const Exsubcategory = () => {
    const [categories, setCategories] = useState([]);
    const [subcategoryData, setSubcategoryData] = useState([]);
    const [exsubcategoryData, setExsubcategoryData] = useState([]);
    const [exsubcategory, setExSubCategory] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
    const [status, setStatus] = useState(false);
    const [filteredExsubCategories, setFilteredExSubCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [subcategories, setSubcategories] = useState([]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleCloseAdd = () => setShowAddModal(false);
    const handleShowAdd = () => setShowAddModal(true);
    const handleCloseEdit = () => setShowEditModal(false);
    const handleShowEdit = () => setShowEditModal(true);



    useEffect(() => {
        let filtered = [...exsubcategoryData];

        if (search !== "") {
            filtered = filtered.filter(value => value.category.includes(search) || value.subcategory.includes(search) || value.exsubcategory.includes(search));
        }
        setFilteredExSubCategories(filtered);
    }, [search, exsubcategoryData]);



    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
        fetchExSubCategories();

    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await authFetch('http://localhost:8000/category/getcategories', {
                method: 'GET',
              
            });
            const data = await response.json();
            if (response.ok) {
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };


    const fetchSubCategories = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await authFetch('http://localhost:8000/subcategory/getsubcategories', {
                method: 'GET',
            
            })
            const data = await response.json();
            if (response.ok) {
                setSubcategoryData(data);
            }
        }
        catch (error) {
            console.error('Error fetching categories:', error);
        }
    }
    const fetchExSubCategories = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await authFetch('http://localhost:8000/exsubcategory/getexsubcategories', {
                method: 'GET',
               
            })
            const data = await response.json();
            if (response.ok) {
                setExsubcategoryData(data);
            } else {
                console.error('Invalid data received:', data);
                setExsubcategoryData([]);
            }

        }
        catch (err) {
            console.error('Error fetching exsubcategories:', err);
        }
    }

    const findCategoryName = (categoryId) => {

        const category = categories.find(category => category.id === categoryId);
        return category ? category.category : categoryId;
    };

    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setSelectedCategoryId(categoryId);

        try {
            const res = await fetch(`http://localhost:8000/exsubcategory/ajaxcategorywiserecord?categoryId=${categoryId}`);
            const data = await res.json();
            if (data.status) {
                setSubcategories(data.subcategory);
            }
        } catch (err) {
            console.error('Error fetching subcategories:', err);
        }
    };

    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;
        setSelectedSubcategoryId(subcategoryId)

    };

    const insertExsubCategory = async (e) => {
        e.preventDefault();

        if (selectedCategoryId === "") {
            alert("Please select a category");
            return;
        }
        if (selectedSubcategoryId === "") {
            alert("Please enter subcategory name");
            return;
        }
        if (exsubcategory.length === 0) {
            alert("Please enter exsubcategory data");
            return;
        }

        try {
            const exsubdata = {
                categoryId: selectedCategoryId,
                subcategoryId: selectedSubcategoryId,
                exsubcategory: exsubcategory
            }

            const response = await authFetch('http://localhost:8000/exsubcategory/insertexsubcategory', {
                method: 'POST',
                body: JSON.stringify(exsubdata),
            })

            if (response.ok) {
                alert('Exsubcategory inserted successfully');
                setExSubCategory('');
                setExsubcategoryData([]);
                setSelectedCategoryId("");
                setSelectedSubcategoryId("");
                fetchExSubCategories();
                handleCloseAdd("");
            }
            else {
                alert('Failed to insert ex subcategory');
            }
        }
        catch (error) {
            console.error('Error adding exsubcategory:', error);

        }
    }


    const handleEdit = (id) => {
        const itemToEdit = exsubcategoryData.find(item => item.id === id);

        if (itemToEdit) {
            setEditId(id);
            setExSubCategory(itemToEdit.exsubcategory);
            setSelectedCategoryId(itemToEdit.categoryId);
            setSelectedSubcategoryId(itemToEdit.subcategoryId);
            setStatus(itemToEdit.status);
            handleShowEdit("");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const exsubcatdata = {
                editid: editId,
                category: selectedCategoryId,
                subcategory: selectedSubcategoryId,
                exsubcategory: exsubcategory,
                status: status
            };

            const response = await authFetch(`http://localhost:8000/exsubcategory/updateexsubcategory`, {
                method: 'POST',
                body: JSON.stringify(exsubcatdata),
            })
            const data = await response.json();

            if (response.ok) {
                alert('Exsubcategory updated successfully');
                setExSubCategory('');
                setExsubcategoryData([]);
                fetchExSubCategories();
                handleCloseEdit("");
                setEditId("");
            }
            else {
                alert("Failed to update subcategory");
            }
        }
        catch (error) {
            console.error('Error updating exsubcategory:', error);
            alert('Error updating exsubcategory');
        }
    }

    const handleDelete = async (id) => {

        if (window.confirm('Are you sure you want to delete this exsubcategory?')) {

            const response = await authFetch(`http://localhost:8000/exsubcategory/deleteexsubcategory`, {
                method: 'POST',
                body: JSON.stringify({ id }),
            })
            const data = await response.json();
            if (response.ok) {
                alert('Ex subcategory deleted successfully');
                fetchExSubCategories();
                setExSubCategory('');
                setExsubcategoryData([]);
            }
            else {
                alert("Failed to delete subcategory");

            }
        }

    };

    return (
        <div>
            <Header />
            <section className="pc-container">
                <div className="pc-content">
                    <div className="page-header">
                        <div className="page-block">
                            <div className="row align-items-center">
                                <div className="col-md-12">
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="../dashboard/index.html">Home</a></li>
                                        <li className="breadcrumb-item"><a href="javascript: void(0)">Forms</a></li>
                                        <li className="breadcrumb-item" aria-current="page">TypeAhead</li>
                                    </ul>
                                </div>
                                <div className="col-md-4 d-flex">
                                    <div className="page-header-title">
                                        <h2 className="mb-0">Exsub Category</h2>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <form className="header-search">
                                        <input type="search" className="form-control" id="searchInput" placeholder="Search here. . ." onChange={(e) => setSearch(e.target.value)} value={search} />
                                    </form>
                                </div>
                                <div className="col-md-4 d-flex justify-content-end">
                                    <Button variant="primary" onClick={handleShowAdd}>
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* View Exsub category */}
                    <div className="card table-card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover text-center" style={{ fontFamily: "cursive" }} id="pc-dt-simple">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Category</th>
                                            <th>Sub Category</th>
                                            <th>Exsub Category</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            filteredExsubCategories.map((item, index) => (
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{findCategoryName(item.category)}</td>
                                                    <td>{item.subcategory}</td>
                                                    <td>{item.exsubcategory}</td>
                                                    <td>
                                                        <button className="btn btn-primary btn-sm" style={{ backgroundColor: item.status === "active" ? "#eef9e8" : "#ffeded", color: item.status === "active" ? "#52c41a" : "#ff4d4f", border: 0, borderRadius: 5 }}>
                                                            {item.status}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm" style={{ color: "#6c757d", border: 0 }} onClick={() => handleEdit(item.id)}><FaRegEdit /></button>
                                                        &nbsp; &nbsp;
                                                        <button className="btn btn-sm" onClick={() => handleDelete(item.id)} style={{ color: "#6c757d", border: 0 }}><RiDeleteBin6Line /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Add Exsub category */}
                    <Modal show={showAddModal} onHide={handleCloseAdd}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Exsubcategory</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="card">
                                <div className="card-body">
                                    <form onSubmit={insertExsubCategory}>
                                        <div className="form-group row my-3">
                                            <label className="col-form-label text-lg-start">Category</label>
                                            <div>
                                                <select className="form-control" value={selectedCategoryId} onChange={handleCategoryChange}>
                                                    <option value="">Select a category</option>
                                                    {
                                                        categories.map(cat => (
                                                            <option key={cat._id} value={cat._id}>{cat.category}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row my-3">
                                            <label className="col-form-label text-lg-start">Sub Category</label>
                                            <div>
                                                <select
                                                    name="subcategory"
                                                    className="form-control"
                                                    value={selectedSubcategoryId}
                                                    onChange={handleSubcategoryChange}
                                                >
                                                    <option value="">-- Select SubCategory --</option>
                                                    {subcategories.map((sub) => (
                                                        <option key={sub._id} value={sub._id}>
                                                            {sub.subcategory}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label text-lg-start">ExSubCategory</label>
                                            <div>
                                                <input
                                                    className="form-control"
                                                    name="exsubcategory"
                                                    type="text"
                                                    placeholder="ExSubCategory"
                                                    value={exsubcategory}
                                                    onChange={(e) => setExSubCategory(e.target.value)}
                                                />
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
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/* Edit Exsub category */}
                    <Modal show={showEditModal} onHide={handleCloseEdit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Exsubcategory</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="card">
                                <div className="card-body">

                                    <form onSubmit={handleUpdate} >
                                        <div className="form-group row my-3">
                                            <label className="col-form-label text-lg-start">Category</label>
                                            <div>
                                                <select className="form-control" value={selectedCategoryId} onChange={handleCategoryChange}>
                                                    <option value="">---Select a category---</option>
                                                    {
                                                        categories.map(cat => (
                                                            <option key={cat._id} value={cat._id}>{cat.category}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row my-3">
                                            <label className="col-form-label text-lg-start">Sub Category</label>
                                            <div>
                                                <select className="form-control" name="subcategory" value={selectedSubcategoryId} onChange={handleSubcategoryChange} >
                                                    <option value="">-- Select SubCategory --</option>
                                                    {subcategories.map((sub) => (
                                                        <option key={sub._id} value={sub._id}>
                                                            {sub.subcategory}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row mb-3">
                                            <label className="col-form-label text-lg-start">ExSubCategory</label>
                                            <div>
                                                <input className="form-control" name="exsubcategory" type="text" placeholder="ExSubCategory" value={exsubcategory} onChange={(e) => setExSubCategory(e.target.value)} />
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
                                        <div className="text-end p-3 pb-md-3">
                                            <Button variant="secondary" onClick={handleCloseEdit}>
                                                Close
                                            </Button>
                                            &nbsp;&nbsp;
                                            <Button variant="primary" type='submit'>
                                                Update
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                </div>
            </section>
        </div>
    );
}

export default Exsubcategory;
