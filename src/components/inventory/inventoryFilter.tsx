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
        <form onSubmit={(e) => e.preventDefault()}>
            <div>
                <label>
                    <input
                        type="radio"
                        name="priceCondition"
                        value="More"
                        checked={priceCondition === "More"}
                        onChange={handleRadioDeselect}
                    />
                    More than
                </label>
                <label>
                    <input
                        type="radio"
                        name="priceCondition"
                        value="Less"
                        checked={priceCondition === "Less"}
                        onChange={handleRadioDeselect}
                    />
                    Less than
                </label>
                <input
                    type="number"
                    value={priceValue}
                    onChange={(e) => setPriceValue(Number(e.target.value))}
                    placeholder="Price value"
                />
            </div>
            <div>
                <label>
                    <input
                        type="radio"
                        name="sortOrder"
                        value="Asc"
                        checked={sortOrder === "Asc"}
                        onChange={handleRadioDeselect}
                    />
                    Price Ascending
                </label>
                <label>
                    <input
                        type="radio"
                        name="sortOrder"
                        value="Desc"
                        checked={sortOrder === "Desc"}
                        onChange={handleRadioDeselect}
                    />
                    Price Descending
                </label>
            </div>
            <div>
                <input
                    type="number"
                    value={supplierId}
                    onChange={(e) => setSupplierId(Number(e.target.value))}
                    placeholder="Supplier ID"
                />
            </div>
            <div>
                <button type="submit" onClick={fetchInventory}>Filter</button>
            </div>
            <div>
                <button onClick={handleResetFilter}>Reset Filter</button>
            </div>
        </form>
    );
}