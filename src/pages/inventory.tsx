import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';

export default function Inventory() {
    interface InventoryItem {
        id: number;
        name: string;
        description: string;
        price: number;
        supplierName: string;
        supplierContact: string;
    }

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInventory = async () => {
            setLoading(true);
            const res = await fetch(`/api/inventory?page=${page}`);
            const data = await res.json();
            setInventory(data.items);
            setLoading(false);
        };

        fetchInventory();
    }, [page]);

    return (
        <div>
            <Navbar />
            <h1>Inventory</h1>

        </div>

    );
}