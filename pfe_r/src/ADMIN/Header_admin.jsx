import React from "react";
import {Link, useNavigate} from "react-router-dom";

function AdminHeader() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className="bg-gray-200 text-white shadow-md py-4 px-6 flex justify-between items-center rounded-b-2xl">
            <div className="text-2xl font-extrabold tracking-wide drop-shadow-md">
               <Link to="/Home_admin" className="link-red">ADMiN DASHBOARD</Link>
            </div>

            <nav className="flex gap-4 items-center text-sm font-medium">
                <button
                    onClick={() => navigate("/Home_admin")}
                    className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded-full transition-all duration-300 link-black"
                >
                    Dashboard
                </button>
                <button
                    onClick={() => navigate("/Users")}
                    className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded-full transition-all duration-300 link-black"
                >
                    Users
                </button>
                <button
                    onClick={() => navigate("/Produit_admin")}
                    className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded-full transition-all duration-300 link-black"
                >
                    Posts
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-gray-300 text-purple-700 font-semibold px-4 py-2 rounded-full shadow hover:bg-purple-100 transition-all duration-300"
                >
                    Logout
                </button>
            </nav>
        </header>
    );
}

export default AdminHeader;
