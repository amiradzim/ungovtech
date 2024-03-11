import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router';
import Navbar from "@/components/common/Navbar";

interface InventoryItem {
    id: number;
    name: string;
    description: string;
    price: number;
    supplierName: string;
    supplierContact: string;
    supplierid: number;
}

interface Supplier {
    id: number;
    name: string;
    contactInfo: string;
}

export default function InventoryDetails() {
    const router = useRouter();
    const { id } = router.query;

    const [inventoryProduct, setInventoryProduct] = useState<InventoryItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedPrice, setEditedPrice] = useState(0);
    const [editedDescription, setEditedDescription] = useState("");
    const [supplierId, setSupplierId] = useState(0);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const fetchInventoryDetails = async () => {
        setLoading(true);

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`/api/inventory/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setInventoryProduct(data);
                setLoading(false);
            } else if (res.status === 403) {
                setErrorMessage("Access denied. You do not have permission to access this resource.");
                console.error(errorMessage);
            } else {
                console.error("An error occurred:", res.status);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditMode(true);
        setEditedName(inventoryProduct?.name || "");
        setEditedPrice(inventoryProduct?.price || 0);
        setEditedDescription(inventoryProduct?.description || "");
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem("token");
        if (!inventoryProduct) return;

        const updatedItem = {
            id: inventoryProduct.id,
            name: editedName,
            description: inventoryProduct.description,
            price: editedPrice,
            supplierid: supplierId,
        };

        const res = await fetch('/api/inventory/update-inventory', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(updatedItem),
        });

        if (res.ok) {
            // setInventoryProduct({...inventoryProduct, name: editedName, price: editedPrice, supplierid: supplierId});
            fetchInventoryDetails();
            setIsEditMode(false);
        } else if (res.status === 403) {
            setErrorMessage("Access denied. You do not have permission to access this resource.");
            alert(errorMessage);
        } else {
            console.error("An error occurred:", res.status);
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        const isConfirmed = confirm("Are you sure you want to delete this product?");

        if (isConfirmed && inventoryProduct) {
            const res = await fetch('/api/inventory/delete-inventory', {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ id: inventoryProduct.id }),
            });

            if (res.ok) {
                router.push("/inventory");
                alert("Product deleted successfully.")
            } else if (res.status === 403) {
                setErrorMessage("Access denied. You do not have permission to access this resource.");
                alert(errorMessage);
            } else {
                console.error("An error occurred:", res.status);
            }
        }
    };

    const handleCancel = () => {
        setIsEditMode(false);
    };

    const handleBack = () => {
        const currentPage = localStorage.getItem("currentPage");

        if (currentPage) {
            router.push(`/inventory?page=${currentPage}`);
        } else {
            router.back();
        }
    };

    useEffect(() => {
        if (id) fetchInventoryDetails();
    }, [id, isEditMode])

    useEffect(() => {
        const fetchSuppliers = async () => {
            const response = await fetch('/api/supplier/get-suppliers');
            const data = await response.json();
            setSuppliers(data.data);
        };

        fetchSuppliers();
    }, []);

    return (
        <div>
            <Navbar />
            <div className={"p-10"}>
                <h5 className={"mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 sm:px-16 xl:px-48 md:text-5xl lg:text-6xl flex items-center justify-center"}>
                    <span className={"align-middle"}>Product Details</span>
                </h5>
                {(inventoryProduct) ?
                    <>
                        <div className={"grid gap-6 mb-6 md:grid-cols-2 pt-5"}>
                            <div>
                                <div className={"block mb-2 text-sm font-medium text-gray-900"}>Product Name:</div>
                                {isEditMode ? (
                                    <input className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"} type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                                ) : (
                                    <div>{inventoryProduct.name}</div>
                                )}
                            </div>

                            <div>
                                <div className={"block mb-2 text-sm font-medium text-gray-900"}>Product Description:</div>
                                {isEditMode ? (
                                    <input className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"} type="text" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
                                ) : (
                                    <div>{inventoryProduct.description}</div>
                                )}
                            </div>

                            <div>
                                <div className={"block mb-2 text-sm font-medium text-gray-900"}>Price:</div>
                                {isEditMode ? (
                                    <input className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"} type="number" value={editedPrice} onChange={(e) => setEditedPrice(Number(e.target.value))} />
                                ) : (
                                    <div>{inventoryProduct.price}</div>
                                )}
                            </div>

                            <div>
                                <div className={"block mb-2 text-sm font-medium text-gray-900"}>Supplier:</div>
                                <div>{inventoryProduct.supplierName}</div>
                            </div>

                            <div>
                                <div className={"block mb-2 text-sm font-medium text-gray-900"}>Supplier Contact:</div>
                                {isEditMode ? (
                                    <>
                                        <select value={supplierId} onChange={(e) => setSupplierId(Number(e.target.value))} >
                                            <option value="">Select Supplier</option>
                                            {suppliers.map((supplier) => (
                                                <option key={supplier.id} value={supplier.id}>
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </select>
                                    </>

                                ) : (
                                    <>
                                        <div>{inventoryProduct.supplierContact}</div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            {isEditMode ? (
                                <>
                                    <button className={"text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"} onClick={handleUpdate}>Confirm</button>
                                    <button className={"inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 rounded-full px-5 py-2.5 text-center me-2 mb-2"} onClick={handleCancel}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button className={"text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"} onClick={handleEdit}>Update</button>
                                    <button className={"text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"} onClick={handleDelete}>Delete</button>
                                </>
                            )}
                        </div>
                    </>
                    :
                    <>
                        <div>The Product ID you&apos;ve entered could not be found.</div>
                    </>
                }
            <button className={"inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 rounded-full px-5 py-2.5 text-center me-2 mb-2"} onClick={handleBack}>
                Back
            </button>
            </div>
        </div>
    )
}