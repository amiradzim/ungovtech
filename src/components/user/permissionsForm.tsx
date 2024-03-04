import React from "react";
interface PermissionsFormProps {
    handlePermissionChange: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    permissions: Record<string, boolean>;
    handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLogout: () => void;
}
export default function PermissionsForm({ handlePermissionChange, permissions, handleCheckboxChange, handleLogout } : PermissionsFormProps) {
    return (
        <form onSubmit={handlePermissionChange}>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="read"
                        checked={permissions.read}
                        onChange={handleCheckboxChange}
                    />
                    View Inventory
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="create"
                        checked={permissions.create}
                        onChange={handleCheckboxChange}
                    />
                    Create Inventory
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="update"
                        checked={permissions.update}
                        onChange={handleCheckboxChange}
                    />
                    Update Inventory
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="delete"
                        checked={permissions.delete}
                        onChange={handleCheckboxChange}
                    />
                    Delete Inventory
                </label>
            </div>
            <button type="submit">Update Permissions</button>
            <button onClick={handleLogout}>Log Out</button>
        </form>
    );
}
