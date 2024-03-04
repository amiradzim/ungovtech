import React from 'react';
interface InventoryItem {
    id: number;
    name: string;
    price: number;
    supplierName: string;
    supplierContact: string;
}

interface InventoryTableProps {
    inventory: InventoryItem[];
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
}

export default function InventoryTable({ inventory, page, setPage, totalPages }: InventoryTableProps) {
    return (
        <>
            <table>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Supplier Name</th>
                    <th>Supplier Contact</th>
                </tr>
                </thead>
                <tbody>
                {inventory.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>{item.supplierName}</td>
                        <td>{item.supplierContact}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => setPage(1)} disabled={page === 1}>
                    Start
                </button>
                <button onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))} disabled={page === 1}>
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={() => setPage(Math.min(page + 1, totalPages))} disabled={page === totalPages}>
                    Next
                </button>
                <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                    End
                </button>
            </div>
        </>
    );
}