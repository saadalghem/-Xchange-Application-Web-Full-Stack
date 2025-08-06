import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header_admin from "./Header_admin.jsx";
import { FaUsers, FaBoxOpen, FaExchangeAlt, FaStar } from "react-icons/fa";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const cards = [
        {
            title: "Users",
            desc: "Manage all users in the platform",
            route: '/users',
            icon: <FaUsers size={20} />,
            headerIcon: <FaUsers className="text-yellow-800" />
        },
        {
            title: "Produits",
            desc: "Track and manage all active sessions",
            route: "/Produit_admin",
            icon: <FaBoxOpen size={20} />,
            headerIcon: <FaBoxOpen className="text-yellow-800" />
        },
        {
            title: "Demmandes",
            desc: "Control and update diet plans",
            route: "/Demandes",
            icon: <FaExchangeAlt size={20} />,
            headerIcon: <FaExchangeAlt className="text-yellow-800" />
        },
        {
            title: "Avis",
            desc: "Moderate and edit posts",
            route: "/Avis_adimn",
            icon: <FaStar size={20} />,
            headerIcon: <FaStar className="text-yellow-800" />
        },
    ];

    return (
        <>
            <Header_admin />
            <div className="min-h-screen bg-[#f9f7f1] flex flex-col items-center py-12 px-6">
                <div className="text-center mb-14 max-w-4xl">
                    <h1 className="text-6xl font-extrabold text-gray-800 drop-shadow-md">Admin Dashboard</h1>
                    <p className="text-xl mt-4 text-gray-600 font-medium">
                        Welcome <span className="text-yellow-600 font-semibold">{user?.prenom || "Admin"}</span> to your control panel
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl w-full px-4">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white bg-opacity-80 backdrop-blur-md border border-gray-300 rounded-3xl shadow-lg p-8 text-center transition-transform hover:scale-105 hover:shadow-2xl duration-300 cursor-pointer"
                            onClick={() => navigate(card.route)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if(e.key === 'Enter') navigate(card.route) }}
                        >
                            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-white shadow-lg text-[56px] hover:from-yellow-300 hover:to-yellow-500 transition-colors duration-300">
                                {card.headerIcon}
                            </div>
                            <h2 className="text-3xl font-semibold text-gray-800 mt-6 mb-3">{card.title}</h2>
                            <p className="text-gray-700 text-md mb-6">{card.desc}</p>
                            <button
                                className="inline-flex items-center justify-center gap-3 bg-gray-600 text-white hover:bg-yellow-500 font-semibold py-3 px-7 rounded-full shadow-md transition duration-300 mx-auto"
                            >
                                {card.icon}
                                View {card.title}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
