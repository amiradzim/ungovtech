import React from "react";

interface InventoryFilterProps {
    priceCondition: string;
    setPriceCondition: React.Dispatch<React.SetStateAction<string>>;
    handleRadioDeselect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    priceValue: number;
    setPriceValue: React.Dispatch<React.SetStateAction<number>>;
    sortOrder: string;
    setSortOrder: React.Dispatch<React.SetStateAction<string>>;
    supplierId: number;
    setSupplierId: React.Dispatch<React.SetStateAction<number>>;
    fetchInventory: () => Promise<void>;
}

export default function InventoryFilter(
    {   priceCondition,
        setPriceCondition,
        handleRadioDeselect,
        priceValue,
        setPriceValue,
        sortOrder,
        setSortOrder,
        supplierId,
        setSupplierId,
        fetchInventory
    }: InventoryFilterProps)
{
    const handleResetFilter = () => {
        setPriceCondition('');
        setPriceValue(0);
        setSortOrder('');
        setSupplierId(0);
    };

    return (
        <div>
            <div className={"mt-3"}>
                <span>Use the filters below to filter the table.</span>
            </div>
            <form className={"flex items-center m-4"} onSubmit={(e) => e.preventDefault()}>
                <div className={"flex m-2"}>
                    <input
                        className={"flex mr-2"}
                        id="priceConditionMore"
                        type="radio"
                        name="priceCondition"
                        value="More"
                        checked={priceCondition === "More"}
                        onChange={handleRadioDeselect}
                    />
                    <label className={"flex items-center justify-center mr-6"} htmlFor="priceConditionMore">
                        More than
                    </label>

                    <input
                        className={"flex mr-2"}
                        id="priceConditionLess"
                        type="radio"
                        name="priceCondition"
                        value="Less"
                        checked={priceCondition === "Less"}
                        onChange={handleRadioDeselect}
                    />
                    <label className={"flex items-center justify-center mr-6"}  htmlFor="priceConditionLess">
                        Less than
                    </label>

                    <label className={"flex items-center justify-center mr-2"} htmlFor="priceValue">
                        Set the price:
                    </label>
                    <input
                        className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"}
                        id="priceValue"
                        type="number"
                        value={priceValue}
                        onChange={(e) => setPriceValue(Number(e.target.value))}
                        placeholder="Price value"
                    />
                </div>
                <div className={"flex m-2"}>
                    <input
                        className={"mr-2"}
                        id="priceAsc"
                        type="radio"
                        name="sortOrder"
                        value="Asc"
                        checked={sortOrder === "Asc"}
                        onChange={handleRadioDeselect}
                    />
                    <label className={"mr-6"} htmlFor="priceAsc">
                        Price Ascending
                    </label>

                    <input
                        className={"mr-2"}
                        id="priceDesc"
                        type="radio"
                        name="sortOrder"
                        value="Desc"
                        checked={sortOrder === "Desc"}
                        onChange={handleRadioDeselect}
                    />
                    <label className={"mr-6"} htmlFor="priceDesc">
                        Price Descending
                    </label>
                </div>
                <div className={"flex m-2"}>
                    <label className={"flex items-center justify-center mr-2"} htmlFor="supplierId">Set the Supplier ID:</label>
                    <input
                        className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"}
                        id="supplierId"
                        type="number"
                        value={supplierId}
                        onChange={(e) => setSupplierId(Number(e.target.value))}
                        placeholder="Supplier ID"
                    />
                </div>
                <div className={"flex m-2"}>
                    <button className={"text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"} type="submit" onClick={fetchInventory}>Filter</button>
                </div>
                <div className={"flex m-2"}>
                    <button className={"text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"} onClick={handleResetFilter}>Reset Filter</button>
                </div>
            </form>
        </div>

    );
}