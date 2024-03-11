import '../app/globals.css';

import Navbar from "@/components/common/Navbar";

export default function Home() {
    return (
        <div>
            <Navbar />
            <div className={"p-10"}>
                <h1 className={"mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 sm:px-16 xl:px-48 md:text-5xl lg:text-6xl"}>
                    CRUD application with <span className="text-blue-600 dark:text-blue-500">Next.js</span> by Che Wan Muhammad Amiradzim.
                </h1>
                <p className={"p-0 mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"}>
                    Complete with authorization with JWT and JTI tokens, backend pagination, dynamic user permissions, and more. Please go through the README file on my <a href="https://github.com/amiradzim/ungovtech/tree/master" className={"font-medium text-blue-600 dark:text-blue-500 hover:underline"}>GitHub repository</a> before proceeding.
                </p>
            </div>
        </div>
    )
}