import Link from 'next/link';

export default function Navbar() {
    return (
        <nav>
            <ul className="flex justify-between px-10 py-5">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/inventory">Inventory</Link></li>
                <li><Link href="/supplier">Supplier</Link></li>
                <li><Link href="/user">User</Link></li>
            </ul>
        </nav>
    );
}