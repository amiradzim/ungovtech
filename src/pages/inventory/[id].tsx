import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router';

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
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedPrice, setEditedPrice] = useState(0);
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
        setEditedName(inventoryProduct?.name || '');
        setEditedPrice(inventoryProduct?.price || 0);
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
            <button onClick={handleBack}>
                Back
            </button>
            {(inventoryProduct) ?
                <>
                    <div>Product Name:</div>
                    {isEditMode ? (
                        <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                    ) : (
                        <div>{inventoryProduct.name}</div>
                    )}

                    <div>Price:</div>
                    {isEditMode ? (
                        <input type="number" value={editedPrice} onChange={(e) => setEditedPrice(Number(e.target.value))} />
                    ) : (
                        <div>{inventoryProduct.price}</div>
                    )}

                    <div>Supplier:</div>
                    <div>{inventoryProduct.supplierName}</div>

                    <div>Supplier Contact:</div>
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

                    {isEditMode ? (
                        <>
                            <button onClick={handleUpdate}>Confirm</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleEdit}>Update</button>
                            <button onClick={handleDelete}>Delete</button>
                        </>
                    )}
                </>
                :
                <>
                    <div>The Product ID you&apos;ve entered could not be found.</div>
                </>
            }
        </div>
    )
}