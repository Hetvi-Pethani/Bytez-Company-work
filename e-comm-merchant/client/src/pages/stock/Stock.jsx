import { useEffect, useState } from "react"
import Header from "../../component/Header/header";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { authFetch } from "../../../middleware/authfetch";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'


const Stock = () => {

    const navigate = useNavigate();

    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
    const [selectedProductId, setSelectedProductId] = useState("");
    const [stock, setStock] = useState([]);

    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [preview, setPreview] = useState(null);
    const [stocks, setStocks] = useState([]);

    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState("");
    const [products, setProducts] = useState([]);
    const [image, setImage] = useState(null);
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [search, setSearch] = useState("");
    const [searchKeywords, setSearchKeywords] = useState('');
    const [selectedSizeId, setSelectedSizeId] = useState("");
    const [selectedColorId, setSelectedColorId] = useState("");
    const [qty, setQty] = useState("");
    const [rate, setrate] = useState("");
    const [amount, setamount] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editId, setEditId] = useState(null)
    const [showModal, setShowModal] = useState(false);


    const handleCloseAdd = () => setShowAddModal(false);
    const handleShowAdd = () => setShowAddModal(true);
    const handleCloseEdit = () => setShowEditModal(false);
    const handleShowEdit = () => setShowEditModal(true);


    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
    const currentItems = filteredStocks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/')
        }
    }, []);


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            let filtered = [...stocks];

            if (search !== "") {
                const lowerSearch = search.toLowerCase();
                filtered = filtered.filter(value =>
                    String(value.stock).toLowerCase().includes(lowerSearch) ||
                    String(value.productName).toLowerCase().includes(lowerSearch) ||
                    String(value.categoryName).toLowerCase().includes(lowerSearch) ||
                    String(value.subcategoryName).toLowerCase().includes(lowerSearch) ||
                    String(value.size).toLowerCase().includes(lowerSearch) ||
                    String(value.color).toLowerCase().includes(lowerSearch)
                );
            }

            if (status !== "") {
                filtered = filtered.filter(item => item.status === status);
            }

            setFilteredStocks(filtered);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [search, stocks, status]);

    useEffect(() => {
        fetchCategories(search);
        fetchSubCategories(search);
        fetchProduct(search);
        fetchStocks(search);
        fetchSizes(search);
        fetchColors(search);
    }, [search]);


    const fetchCategories = async () => {
        try {
            const response = await authFetch(
                `http://localhost:8000/category/getcategories?search=${encodeURIComponent(search)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
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

            const response = await authFetch(
                `http://localhost:8000/subcategory/getsubcategories?search=${encodeURIComponent(search)}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            const data = await response.json();
            if (response.ok) {
                setSubcategories(data);
            }
        }
        catch (error) {
            console.error('Error fetching Subcategories:', error);
        }
    }

    const fetchStocks = async () => {
        try {

            const response = await authFetch('http://localhost:8000/stock/getstocks', {
                method: 'GET',
            })
            const data = await response.json();
            if (response.ok) {
                setStocks(data);
            }
        }
        catch (error) {
            console.error('Error fetching stock:', error);
        }
    }

    const fetchProduct = async () => {
        try {

            const response = await authFetch(
                `http://localhost:8000/product/getproducts?search=${encodeURIComponent(search)}`,
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

    const fetchSizes = async (search = '') => {
        try {
            const response = await authFetch(
                `http://localhost:8000/size/getsizes?search=${encodeURIComponent(search)}`,
                {
                    method: 'GET'
                }
            );
            const data = await response.json();
            if (response.ok) {
                setSizes(data);
            }
        }
        catch (error) {
            console.error('Error fetching Size:', error);
        }
    }

    const fetchColors = async () => {
        try {
            const response = await authFetch(
                `http://localhost:8000/color/getcolors?search=${encodeURIComponent(search)}`,
                {
                    method: 'GET'
                }
            );
            const data = await response.json();
            if (response.ok) {
                setColors(data);
            }
        } catch (err) {
            console.error("Error fetching colors:", err);
        }
    };

    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setSelectedCategoryId(categoryId);

        try {
            const res = await fetch(`http://localhost:8000/subcategory/ajaxcategorywiserecord?categoryId=${categoryId}`);
            const data = await res.json();
            if (data.status) {
                setSubcategories(data.subcategory);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleSubcategoryChange = async (e) => {
        const subcategoryId = e.target.value;
        setSelectedSubcategoryId(subcategoryId);
    };
    const handleProductChange = async (e) => {
        const productId = e.target.value;
        setSelectedProductId(productId);

    };

    const insertStock = async (e) => {
        e.preventDefault();

        const stockExists = stocks.some(item =>
            item.productId?.toString() === selectedProductId?.toString() &&
            item.categoryId?.toString() === selectedCategoryId?.toString() &&
            item.subCategoryId?.toString() === selectedSubcategoryId?.toString() &&
            !item.deleted_at
        );

        if (stockExists) {
            handleShowAdd();
            toast.error("Stock already exists for this category and subcategory");
            return;
        }
        try {

            const formData = new FormData();
            formData.append('category', selectedCategoryId);
            formData.append('subcategory', selectedSubcategoryId);
            formData.append('product', selectedProductId);
            formData.append('image', image);
            formData.append('size', selectedSizeId);
            formData.append('color', selectedColorId);
            formData.append('qty', qty);
            formData.append('stock', stock)
            formData.append('rate', rate);
            formData.append('amount', amount);
            formData.append('searchKeywords', searchKeywords);


            const response = await fetch('http://localhost:8000/stock/insertstock', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: formData
            });

            const data = await response.json();


            if (response.ok) {
                toast.success("stock Inserted Successfully");
                setImage("");
                setSelectedCategoryId("");
                setSelectedSubcategoryId("");
                setSelectedProductId("");
                setSelectedSizeId("");
                setSelectedColorId("");
                setQty("");
                setStock("");
                setrate("");
                setamount("");
                setStatus("");
                setSearchKeywords("");
                setEditId("");
                fetchStocks();
                handleCloseAdd();
            }
        }
        catch (err) {
            console.error('Error inserting product:', err);
        }
    }

    const handleEdit = async (id) => {
        try {
            const stockitemToEdit = stocks.find(item => item._id === id);
            setSelectedCategoryId(stockitemToEdit.categoryId);
            setSelectedSubcategoryId(stockitemToEdit.subcategoryId);
            setSelectedProductId(stockitemToEdit.productId);
            setSelectedSizeId(stockitemToEdit.sizeId);
            setSelectedColorId(stockitemToEdit.colorId);
            setQty(stockitemToEdit.qty);
            setrate(stockitemToEdit.rate)
            setamount(stockitemToEdit.amount);
            setStatus(stockitemToEdit.status);
            setImage(stockitemToEdit.image);
            setStatus(stockitemToEdit.status);
            setStock(stockitemToEdit.stock);
            handleShowEdit();
            if (stockitemToEdit) {
                setEditId(id);
            }
        }
        catch (err) {
            console.error('Error fetching stock to edit:', err);

        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        const stockExists = stocks.some(item =>
            item._id !== editId &&
            item.productId?.toString() === selectedProductId?.toString() &&
            item.categoryId?.toString() === selectedCategoryId?.toString() &&
            item.subCategoryId?.toString() === selectedSubcategoryId?.toString() &&
            item.sizeId?.toString() === selectedSizeId?.toString() &&
            item.colorId?.toString() === selectedColorId?.toString() &&
            !item.deleted_at
        );

        if (stockExists) {
            toast.error("Stock already exists for this category, subcategory, product, size, and color");
            handleShowEdit();
            return;
        }
        try {
            const formData = new FormData();
            formData.append('editid', editId);
            formData.append('category', selectedCategoryId);
            formData.append('subcategory', selectedSubcategoryId);
            formData.append('product', selectedProductId);
            formData.append('stock', stock);
            formData.append('image', image);
            formData.append('size', selectedSizeId);
            formData.append('color', selectedColorId);
            formData.append('qty', qty);
            formData.append('rate', rate);
            formData.append('amount', amount);
            formData.append('status', status);
            formData.append('searchKeywords', searchKeywords);

            const response = await fetch('http://localhost:8000/stock/updatestock', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("stock updated successfully");

                setStock("");
                setImage("");
                setSelectedCategoryId("");
                setSelectedSubcategoryId("");
                setSelectedProductId("");
                setStatus("");
                setEditId("");
                setSelectedSizeId("");
                setSelectedColorId("");
                setQty("");
                setrate("");
                setamount("");
                handleCloseEdit("");
                fetchStocks();
            }
            else {
                toast.error("Failed to update stock");
            }

        } catch (err) {
            console.error('Error updating  stock:', err);
            toast.error('Error updating  stock');
        }
    }

    const handleDelete = async (id) => {

        if (window.confirm('Are you sure you want to delete this  stock?')) {
            try {
                const response = await authFetch('http://localhost:8000/stock/deletestock', {
                    method: 'POST',

                    body: JSON.stringify({ id })
                });
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    toast.success("stock deleted successfully");
                    fetchStocks();
                }
            }
            catch (err) {
                console.error('Error deleting stock:', err);
                toast.error('Error deleting stock');
            }
        }
    }

    const handleExport = async () => {
        try {
            const response = await authFetch('http://localhost:8000/stock/export', {
                method: 'GET',
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'stocks.csv';
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
            const response = await fetch('http://localhost:8000/stock/import', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Stocks imported successfully!');
                fetchStocks();
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
            <section className="pc-container p-3" style={{ top: "65px" }}>

                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-4 d-flex">
                            <div className="page-header-title">
                                <h3 className="mb-3">Stock</h3>
                            </div>
                        </div>

                    </div>
                </div>


                {/* View stock*/}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header pb-0 p-3" >
                                <div className="d-flex justify-content-between">
                                    <Button variant="primary" style={{ fontWeight: "bold" }} onClick={handleShowAdd}>
                                        <i className="ti ti-plus" style={{ fontSize: "13px" }}></i> Add Stock
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
                                            <input type="search" className="form-control p-2" id="searchInput" placeholder="Search here. . ." onChange={(e) => setSearch(e.target.value)} value={search} />
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
                                            className="form-control m-1"
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
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Image</th>
                                            <th>Category</th>
                                            <th>Sub Category </th>
                                            <th>Product</th>
                                            <th>Size</th>
                                            <th>Color</th>
                                            <th>Stock</th>
                                            <th>Qty</th>
                                            <th>Purchase ₹</th>
                                            <th>Amount ₹</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentItems.map((item, index) => (
                                                <tr key={item._id}>
                                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td style={{ padding: "0" }}> <img src={`http://localhost:8000/uploads/${item.image}`} alt="stock"
                                                        width="30"
                                                        style={{ borderRadius: '10%' }} /> </td>
                                                    <td>{item.categoryName}</td>
                                                    <td>{item.subcategoryName}</td>
                                                    <td>{item.productName}</td>
                                                    <td>{item.sizeName}</td>
                                                    <td>{item.colorName}</td>
                                                    <td>{item.stock}</td>
                                                    <td>{item.qty}</td>
                                                    <td>{item.rate}</td>
                                                    <td>{item.amount}</td>
                                                    <td>
                                                        <button className="btn btn-primary btn-sm" style={{ backgroundColor: item.status === "active" ? "#eef9e8" : "#ffeded", color: item.status === "active" ? "#52c41a" : "#ff4d4f", border: 0, borderRadius: 5 }}>
                                                            {item.status}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="btn  btn-sm" data-bs-toggle="modal" data-bs-target="#editModal" style={{ color: "#94a3b8", border: 0 }} onClick={() => handleEdit(item._id)} ><FaRegEdit onClick={handleShowEdit} />
                                                        </button>
                                                        &nbsp; &nbsp;
                                                        <button className="btn btn-sm" onClick={() => handleDelete(item._id)} style={{ color: "#94a3b8", border: 0 }}><RiDeleteBin6Line /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </table>

                                <div className=' d-flex justify-content-between'>
                                    <div className="mt-2 ms-3" style={{ display: 'inline-block' }}>
                                        {filteredStocks.length > 0 ? (
                                            <>
                                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                                {Math.min(currentPage * itemsPerPage, filteredStocks.length)} of{' '}
                                                {filteredStocks.length} entries
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


                    {/* Add Stock */}


                    <Modal show={showAddModal} onHide={handleCloseAdd} backdrop="static" keyboard={false} centered >
                        <Modal.Header closeButton>
                            <Modal.Title>Add Stock</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={insertStock} encType="multipart/form-data">
                                <div className="row" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Category</label>
                                        <select className="form-control m-1 m-0" value={selectedCategoryId} onChange={handleCategoryChange} required>
                                            <option value="">--- Select Category---</option>
                                            {categories
                                                .filter(cat => cat.status === "active")
                                                .map(cat => (
                                                    <option key={cat._id} value={cat._id}>{cat.category}</option>
                                                ))}
                                        </select>
                                    </div>


                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Subcategory</label>
                                        <select className="form-control m-1" value={selectedSubcategoryId} onChange={handleSubcategoryChange} required>
                                            <option value=""> --- Select Subcategory---</option>
                                            {subcategories

                                                .filter(sub => sub.status === "active")
                                                .map(sub => (
                                                    <option key={sub._id} value={sub._id}>{sub.subcategory}</option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Product</label>
                                        <select className="form-control m-1" value={selectedProductId} onChange={handleProductChange} required>
                                            <option value=""> --- Select Product---</option>
                                            {products
                                                .filter(product => product.status === "active")
                                                .map(product => (
                                                    <option key={product._id} value={product._id}>{product.product}</option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Size</label>
                                        <select className="form-control m-1" value={selectedSizeId} onChange={(e) => setSelectedSizeId(e.target.value)} required>
                                            <option value=""> --- Select Size---</option>
                                            {sizes
                                                .filter(size => size.status === "active")
                                                .map(size => (
                                                    <option key={size._id} value={size._id}>{size.size}</option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Color</label>
                                        <select className="form-control m-1" value={selectedColorId} onChange={(e) => setSelectedColorId(e.target.value)} required>
                                            <option value="">--- Select Color---</option>
                                            {colors
                                                .filter(color => color.status === "active")
                                                .map(color => (
                                                    <option key={color._id} value={color._id}>{color.color}</option>
                                                ))}
                                        </select>
                                    </div>


                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Quantity</label>
                                        <input type="number" className="form-control m-1" placeholder="Enter quantity" value={qty} onChange={(e) => setQty(e.target.value)} required />
                                    </div>


                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Stock</label>
                                        <input type="number" className="form-control m-1" placeholder="Enter stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
                                    </div>


                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Purchase Price</label>
                                        <input type="number" className="form-control m-1" placeholder="Enter purchase price" value={rate} onChange={(e) => setrate(e.target.value)} required />
                                    </div>


                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">amount</label>
                                        <input type="number" className="form-control m-1" placeholder="Enter selling price" value={amount} onChange={(e) => setamount(e.target.value)} required />
                                    </div>


                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Product Image</label>
                                        <input type="file" className="form-control m-1" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="text-end pt-2">
                                    <Button variant="secondary" onClick={handleCloseAdd}>Close</Button>
                                    &nbsp;
                                    <Button type="submit" variant="primary">Submit</Button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>

                    {/* Edit Stock */}

                    <Modal show={showEditModal} onHide={handleCloseEdit} backdrop="static" keyboard={false} centered scrollable >
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Stock</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <form onSubmit={handleUpdate}>
                                <div className="row">

                                    {/* Category */}
                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Category</label>
                                        <select className="form-control m-1 m-0" value={selectedCategoryId} onChange={handleCategoryChange} required>
                                            <option value="">-- Select Category --</option>
                                            {categories
                                                .filter(cat => cat.status === "active")
                                                .map(cat => (
                                                    <option key={cat._id} value={cat._id}>{cat.category}</option>
                                                ))}

                                        </select>
                                    </div>

                                    {/* Subcategory */}
                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Subcategory</label>
                                        <select className="form-control m-1" value={selectedSubcategoryId} onChange={handleSubcategoryChange} required>
                                            <option value="">-- Select Subcategory --</option>
                                            {subcategories

                                                .filter(sub => sub.status === "active")
                                                .map(sub => (
                                                    <option key={sub._id} value={sub._id}>{sub.subcategory}</option>
                                                ))}
                                        </select>
                                    </div>

                                    {/* Product */}
                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Product</label>
                                        <select className="form-control m-1" value={selectedProductId} onChange={handleProductChange} required>
                                            <option value="">-- Select Product --</option>
                                            {products

                                                .filter(product => product.status === "active")
                                                .map(product => (
                                                    <option key={product._id} value={product._id}>{product.product}</option>
                                                ))}
                                        </select>
                                    </div>

                                    {/* Size */}
                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Size</label>
                                        <select className="form-control m-1" value={selectedSizeId} onChange={(e) => setSelectedSizeId(e.target.value)} required>
                                            <option value="">-- Select Size --</option>
                                            {sizes

                                                .filter(size => size.status === "active")
                                                .map(size => (
                                                    <option key={size._id} value={size._id}>{size.size}</option>
                                                ))}
                                        </select>
                                    </div>

                                    {/* Color */}
                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Color</label>
                                        <select className="form-control m-1" value={selectedColorId} onChange={(e) => setSelectedColorId(e.target.value)} required>
                                            <option value="">-- Select Color --</option>
                                            {colors
                                                .filter(color => color.status === "active")
                                                .map(color => (
                                                    <option key={color._id} value={color._id}>{color.color}</option>
                                                ))}
                                        </select>
                                    </div>

                                    {/* Quantity */}
                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Quantity</label>
                                        <input type="number" className="form-control m-1" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Enter Quantity" required />
                                    </div>

                                    {/* Stock */}
                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Stock</label>
                                        <input type="number" className="form-control m-1" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Enter Stock" required />
                                    </div>

                                    {/* Purchase Price */}
                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold"> rate</label>
                                        <input type="number" className="form-control m-1" value={rate} onChange={(e) => setrate(e.target.value)} placeholder="Enter Purchase Price" required />
                                    </div>



                                    {/* Image Upload and Preview */}
                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Image</label>
                                        <input
                                            type="file"
                                            className="form-control m-1"
                                            name="image"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setImage(file);
                                                    setPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                        {preview || image ? (
                                            <div className="mt-2">
                                                <img
                                                    src={preview ? preview : `http://localhost:8000/uploads/${image}`}
                                                    alt="Preview"
                                                    width={50}
                                                    height={50}
                                                    style={{ borderRadius: '10%', margin: '2%' }}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                    {/* Selling Price */}
                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Selling Price</label>
                                        <input type="number" className="form-control m-1" value={amount} onChange={(e) => setamount(e.target.value)} placeholder="Enter Selling Price" required />
                                    </div>
                                    {/* Status Toggle */}
                                    <div className="form-group mb-0 w-50">
                                        <label className="col-form-label m-0 fw-semibold">Status</label>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="statusSwitch"
                                                checked={status === 'active'}
                                                onChange={(e) => setStatus(e.target.checked ? 'active' : 'inactive')}
                                            />
                                            <label className="form-check-label" htmlFor="statusSwitch">
                                                {status === 'active' ? 'Active' : 'Inactive'}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-end ">
                                    <Button variant="secondary" onClick={handleCloseEdit}>
                                        Close
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button type="submit" variant="primary">
                                        Update
                                    </Button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                </div >
            </section >
        </div >

    )
}

export default Stock;