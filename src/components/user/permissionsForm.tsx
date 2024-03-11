import React from "react";
interface PermissionsFormProps {
    handlePermissionChange: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    permissions: Record<string, boolean>;
    handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLogout: () => void;
}
export default function PermissionsForm({ handlePermissionChange, permissions, handleCheckboxChange, handleLogout } : PermissionsFormProps) {
    return (
        <div className={"flex items-center justify-center pt-5"}>
            <form className={"bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4"} onSubmit={handlePermissionChange}>
                <div className={"flex items-center mb-4"}>
                    <input
                        className={"mr-3"}
                        id="viewInv"
                        type="checkbox"
                        name="read"
                        checked={permissions.read}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="viewInv">
                        View Inventory
                    </label>
                </div>
                <div className={"mb-4"}>
                    <input
                        className={"mr-3"}
                        id="createInv"
                        type="checkbox"
                        name="create"
                        checked={permissions.create}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="createInv">
                        Create Inventory
                    </label>
                </div>
                <div className={"mb-4"}>
                    <input
                        className={"mr-3"}
                        id="updateInv"
                        type="checkbox"
                        name="update"
                        checked={permissions.update}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="updateInv">
                        Update Inventory
                    </label>
                </div>
                <div className={"mb-4"}>
                    <input
                        className={"mr-3"}
                        id="deleteInv"
                        type="checkbox"
                        name="delete"
                        checked={permissions.delete}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="deleteInv">
                        Delete Inventory
                    </label>
                </div>
                <button className={"text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"} type="submit">Update Permissions</button>
                <button className={"py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"} onClick={handleLogout}>Log Out</button>
            </form>
        </div>

    );
}
