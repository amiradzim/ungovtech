import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import InventoryTable from "@/components/inventory/inventoryTable";
import InventoryFilter from "@/components/inventory/inventoryFilter";

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
    const [readPermission, setReadPermission] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [priceCondition, setPriceCondition] = useState("");
    const [priceValue, setPriceValue] = useState(0);
    const [sortOrder, setSortOrder] = useState("");
    const [supplierId, setSupplierId] = useState(0);
    const pageSize = 20;

    useEffect(() => {
        fetchInventory();
    }, [page]);

    const fetchInventory = async () => {
        setLoading(true);

        const token = localStorage.getItem("token");
        const queryParamsObj = {
            page: page.toString(),
            pageSize: pageSize.toString(),
            ...(priceCondition && { priceCondition }),
            ...(priceValue && { priceValue: priceValue.toString() }),
            ...(sortOrder && { sortOrder }),
            ...(supplierId && { supplierId: supplierId.toString() })
        };

        const queryParams = new URLSearchParams(queryParamsObj).toString();

        try {
            const res = await fetch(`/api/inventory?${queryParams}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                const totalItems = data.total;
                const pages = Math.ceil(totalItems / pageSize);
                setTotalPages(pages);
                setInventory(data.data);
                setLoading(false);
                setReadPermission(true);
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

    const handleRadioDeselect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "priceCondition") {
            if (value !== priceCondition) {
                setPriceCondition(value);
            } else {
                setPriceCondition('');
            }
        } else if (name === "sortOrder") {
            if (value !== sortOrder) {
                setSortOrder(value);
            } else {
                setSortOrder('');
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div>
                {(readPermission) ?
                    <>
                        <InventoryFilter
                            priceCondition={priceCondition}
                            setPriceCondition={setPriceCondition}
                            handleRadioDeselect={handleRadioDeselect}
                            priceValue={priceValue}
                            setPriceValue={setPriceValue}
                            sortOrder={sortOrder}
                            setSortOrder={setSortOrder}
                            supplierId={supplierId}
                            setSupplierId={setSupplierId}
                            fetchInventory={fetchInventory}
                        />
                        <InventoryTable
                            inventory={inventory}
                            page={page}
                            setPage={setPage}
                            totalPages={totalPages}
                        />
                    </>
                    :
                    <>
                        <h1>{errorMessage}</h1>
                    </>
                }
            </div>
        </div>

    );
}