import '../app/globals.css';

import React, { useEffect, useState } from "react";

import Navbar from "../components/common/Navbar";
import InventoryTable from "@/components/inventory/inventoryTable";
import InventoryFilter from "@/components/inventory/inventoryFilter";
import InventoryAdd from "@/components/inventory/inventoryAdd";

export default function Inventory() {
    interface InventoryItem {
        id: number;
        name: string;
        description: string;
        price: number;
        supplierName: string;
        supplierContact: string;
    }

    interface Permissions {
        read: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
    }

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState<Permissions>({ read: false, create: false, update: false, delete: false });
    const [addProduct, setAddProduct] = useState(false);
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

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = () => {
        const storedPermissions = localStorage.getItem("permissions");

        if (storedPermissions) {
            try {
                const parsedPermissions = JSON.parse(storedPermissions);
                setPermissions(parsedPermissions);
            } catch (error) {
                console.error("Failed to parse permissions from local storage:", error);
            }
        }
    };


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

    const handleCreateProductClick = () => {
        setAddProduct(!addProduct);
    };

    return (
        <div>
            <Navbar />
            <div className={"p-10"}>
                {!addProduct ? (
                    permissions.read ? (
                        <>
                            <button className={"text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"} onClick={handleCreateProductClick} disabled={!permissions.create}>
                                Create Product
                            </button>
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
                    ) : (
                        <h1>{errorMessage}</h1>
                    )
                ) : (
                    <InventoryAdd
                        handleCreateProductClick={handleCreateProductClick}
                        errorMessage={errorMessage}
                        setErrorMessage={setErrorMessage}
                    />
                )}
            </div>
        </div>
    );
}

