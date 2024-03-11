import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';

interface InventoryAddProps {
    handleCreateProductClick: () => void;
    errorMessage: string;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

interface Supplier {
    id: number;
    name: string;
    contactinfo: string;
}

export default function InventoryAdd ( { handleCreateProductClick, errorMessage, setErrorMessage }: InventoryAddProps) {
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

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                            {supplier.id} - {supplier.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleSubmit} disabled={!name || !description || !price || !supplierId}>
                    Submit
                </button>
                <button onClick={handleCreateProductClick}>
                    Cancel
                </button>
            </form>


        </>
    )
}