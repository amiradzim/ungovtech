import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

sqlite3.verbose();

export async function openDb() {
    return open({
        filename: "./mydb.sqlite",
        driver: sqlite3.Database,
    });
}

async function setupDb() {
    const db = await openDb();

    // Inventory Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL,
        supplierId INTEGER,
        FOREIGN KEY (supplierId) REFERENCES Supplier(id)
        );
    `);

    // Supplier Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Supplier (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contactInfo TEXT
        );
    `);

    // User Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
        );
    `);

    // User Roles Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS UserRoles (
        roleId INTEGER PRIMARY KEY AUTOINCREMENT,
        roleName TEXT NOT NULL,
        permissions TEXT NOT NULL
        );
    `);

    // Junction table for multiple user roles
    await db.exec(`
        CREATE TABLE IF NOT EXISTS User_UserRoles (
        userId INTEGER,
        roleId INTEGER,
        FOREIGN KEY (userId) REFERENCES Users(id),
        FOREIGN KEY (roleId) REFERENCES UserRoles(roleId),
        PRIMARY KEY (userId, roleId)
        );
    `);

    // JTI token repository
    await db.exec(`
        CREATE TABLE IF NOT EXISTS TokenStore (
        tokenIdent TEXT PRIMARY KEY,
        userId INTEGER,
        isValid BOOLEAN,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES Users(id)
        );
    `);

    // Predetermined roles
    const roles = [
        { roleName: "create product", permissions: "create" },
        { roleName: "view product", permissions: "read" },
        { roleName: "update product", permissions: "update" },
        { roleName: "delete product", permissions: "delete" },
        { roleName: "admin", permissions: "create,read,update,delete,manageUsers" },
    ];

    for (const role of roles) {
        await db.run(`INSERT INTO UserRoles (roleName, permissions) VALUES (?, ?)`, [role.roleName, role.permissions]);
    }
}

setupDb().catch(console.error);