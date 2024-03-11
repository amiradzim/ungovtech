import React from 'react';
import Link from "next/link";
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
        <div className={"relative overflow-x-auto shadow-md"}>
            <table className={"w-full text-sm text-left rtl:text-right text-gray-500"}>
                <thead className={"text-xs text-gray-700 uppercase bg-gray-50"}>
                <tr>
                    <th scope={"col"} className={"px-6 py-3"}>Id</th>
                    <th scope={"col"} className={"px-6 py-3"}>Name</th>
                    <th scope={"col"} className={"px-6 py-3"}>Price</th>
                    <th scope={"col"} className={"px-6 py-3"}>Supplier Name</th>
                    <th scope={"col"} className={"px-6 py-3"}>Supplier Contact</th>
                </tr>
                </thead>
                <tbody>
                {inventory.map((item) => (
                    <tr className={"bg-white border-b hover:bg-gray-50"} key={item.id}>
                        <td className={"px-6 py-4"}>{item.id}</td>
                        <td className={"px-6 py-4"}>
                            <Link className={"font-medium text-gray-900 whitespace-nowrap"} href={`/inventory/${item.id}`}>
                                {item.name}
                            </Link>
                        </td>
                        <td className={"px-6 py-4"}>${item.price.toFixed(2)}</td>
                        <td className={"px-6 py-4"}>{item.supplierName}</td>
                        <td className={"px-6 py-4"}>{item.supplierContact}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className={"flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"}>
                <div className={"flex -space-x-px rtl:space-x-reverse text-sm h-8"}>
                    <button className={"flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"} onClick={() => setPage(1)} disabled={page === 1}>
                        Start
                    </button>
                    <button className={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"} onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))} disabled={page === 1}>
                        Previous
                    </button>
                    <span className={"flex items-center justify-center px-3 h-8 leading-tight text-gray-900 bg-white border border-gray-300"}>Page {page} of {totalPages}</span>
                    <button className={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"} onClick={() => setPage(Math.min(page + 1, totalPages))} disabled={page === totalPages}>
                        Next
                    </button>
                    <button className={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"} onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                        End
                    </button>
                </div>
            </div>

        </div>
    );
}