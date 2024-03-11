import '../../app/globals.css';

import Link from 'next/link';

export default function Navbar() {
    return (
        <nav>
            <ul className={"flex justify-between px-10 py-5"}>
                <li className={"mr-6"}>
                    <Link className={"text-blue-500 hover:text-blue-800"} href="/">Home</Link>
                </li>
                <li className="mr-6">
                    <Link className={"text-blue-500 hover:text-blue-800"} href="/inventory">Inventory</Link>
                </li>
                <li className="mr-6">
                    <Link className={"text-blue-500 hover:text-blue-800"} href="/user">User</Link>
                </li>
            </ul>
        </nav>
    );
}