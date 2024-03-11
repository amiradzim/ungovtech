-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Create UserRoles table
CREATE TABLE IF NOT EXISTS UserRoles (
    roleId SERIAL PRIMARY KEY,
    roleName TEXT NOT NULL,
    permissions TEXT NOT NULL
);

-- Create Inventory table
CREATE TABLE IF NOT EXISTS Inventory (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    supplierId INTEGER REFERENCES Supplier(id)
);

-- Create User_UserRoles table
CREATE TABLE IF NOT EXISTS User_UserRoles (
    userId INTEGER REFERENCES Users(id),
    roleId INTEGER REFERENCES UserRoles(roleId),
    PRIMARY KEY (userId, roleId)
);

-- Create TokenStore table
CREATE TABLE IF NOT EXISTS TokenStore (
    tokenIdent TEXT PRIMARY KEY,
    userId INTEGER REFERENCES Users(id),
    isValid BOOLEAN,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default UserRoles
INSERT INTO UserRoles (roleName, permissions) VALUES
    ('create product', 'create'),
    ('view product', 'read'),
    ('update product', 'update'),
    ('delete product', 'delete'),
    ('admin', 'create,read,update,delete,manageUsers')
ON CONFLICT DO NOTHING;