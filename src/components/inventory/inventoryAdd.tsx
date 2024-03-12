import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';

interface InventoryAddProps {
    handleCreateProductClick: () => void;
    errorMessage: string;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setAddProduct: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Supplier {
    id: number;
    name: string;
    contactinfo: string;
}

export default function InventoryAdd ( { handleCreateProductClick, errorMessage, setErrorMessage, setAddProduct }: InventoryAddProps) {
    const router = useRouter();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            const response = await fetch('/api/supplier/get-suppliers');
            const data = await response.json();
            setSuppliers(data.data);
        };
        fetchSuppliers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/inventory/add-inventory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    description,
                    price: Number(price),
                    supplierid: Number(supplierId),
                }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Inventory item added successfully");
                router.push(`/inventory/${data.data.id}`);
            } else if (res.status === 403) {
                setErrorMessage("Access denied. You do not have permission to access this resource.");
                console.error(errorMessage);
            } else {
                console.error("An error occurred:", res.status);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        const confirmed = window.confirm("Are you sure you want to generate 1000 products? This action will take about 1 minute to execute.");

        if (confirmed) {
            setAddProduct(false);
            const token = localStorage.getItem("token");

            try {
                const res = await fetch("/api/inventory/generate-products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log("Products generated successfully.");
                    router.push(`/inventory`);
                } else if (res.status === 403) {
                    setErrorMessage("Access denied. You do not have permission to access this resource.");
                    console.error(errorMessage);
                } else {
                    console.error("An error occurred:", res.status);
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
    };

    const handleClearProducts = async (e: React.FormEvent) => {
        const confirmed = window.confirm("Are you sure you want to delete everything in the Inventory table? This action IS NOT REVERSIBLE.");

        if (confirmed) {
            setAddProduct(false);
            const token = localStorage.getItem("token");

            try {
                const res = await fetch("/api/inventory/clear-inventory", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log("Products deleted successfully.");
                } else if (res.status === 403) {
                    setErrorMessage("Access denied. You do not have permission to access this resource.");
                    console.error(errorMessage);
                } else {
                    console.error("An error occurred:", res.status);
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
    };

    return (
        <div className={"flex items-center justify-center pt-5"}>
            <form className={"bg-white shadow-md rounded px-30 pt-6 pb-8 mb-4 px-10 w-full xl:w-1/2"} onSubmit={handleSubmit}>
                <div className={"mb-6"}>
                    <label className={"block text-gray-700 text-sm font-bold mb-2"} htmlFor="prodName">Product Name</label>
                    <input id="prodName" className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"} type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className={"mb-6"}>
                    <label className={"block text-gray-700 text-sm font-bold mb-2"} htmlFor="prodDesc">Product Description</label>
                    <input id="prodDesc" className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"} type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>

                <div className={"mb-6"}>
                    <label className={"block text-gray-700 text-sm font-bold mb-2"} htmlFor="prodPrice">Product Price</label>
                    <input id="prodPrice" className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"} type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>

                <div className={"mb-6"}>
                    <label className={"block text-gray-700 text-sm font-bold mb-2"} htmlFor="prodName">Supplier</label>
                    <select id="suppId" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
                        <option value="">Select Supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.id} - {supplier.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={"flex items-center justify-between"}>
                    <button className={"text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"} onClick={handleSubmit} disabled={!name || !description || !price || !supplierId}>
                        Submit
                    </button>
                    <button className={"text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"} onClick={handleGenerate}>
                        Generate Products
                    </button>
                    <button className={"text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"} onClick={handleClearProducts}>
                        Delete All Products
                    </button>
                    <button className={"text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"} onClick={handleCreateProductClick}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}