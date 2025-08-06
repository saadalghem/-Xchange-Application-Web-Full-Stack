import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header_admin from "./Header_admin.jsx";

function Users() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get("http://localhost:8081/api/utilisateur/all")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Erreur chargement utilisateurs :", error));
    };

    const handleDelete = (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
            axios.delete(`http://localhost:8081/api/utilisateur/delete/${id}`)
                .then(() => fetchUsers())
                .catch((error) => console.error("Erreur suppression utilisateur :", error));
        }
    };

    const handleEdit = (id) => {
        navigate(`/Usermodify/${id}`);
    };

    const filteredUsers = users.filter(user =>
        user.id !== currentUser?.id &&
        (
            user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <>
            <Header_admin />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                                <span>👤</span> Liste des utilisateurs
                            </h1>
                            <p className="text-gray-600 mt-1 italic">
                                Total : <span className="font-semibold">{filteredUsers.length}</span> utilisateur{filteredUsers.length > 1 ? "s" : ""}
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/Useradd")}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-5 py-2 rounded-full shadow-lg transition duration-300"
                        >
                            <FaPlus /> Ajouter utilisateur
                        </button>
                    </div>

                    {/* Search bar */}
                    <div className="relative max-w-md mb-8 mx-auto md:mx-0">
                        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Rechercher par nom, prénom ou email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg shadow-lg bg-white border border-gray-300">
                        <table className="w-full text-left text-gray-700 text-sm">
                            <thead className="bg-gray-100 uppercase text-xs font-semibold text-gray-600">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Nom complet</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Téléphone</th>
                                <th className="px-6 py-3">Statut</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-500 italic">
                                        Aucun utilisateur trouvé.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-3">{user.id}</td>
                                        <td className="px-6 py-3 font-medium">{user.nom} {user.prenom}</td>
                                        <td className="px-6 py-3">{user.email}</td>
                                        <td className="px-6 py-3">{user.telephone}</td>
                                        <td className="px-6 py-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold
                                                        ${user.etat_user === "USER" ? "bg-green-100 text-green-800" :
                                                        user.etat_user === "ADMIN" ? "bg-red-100 text-red-800" :
                                                            "bg-gray-100 text-gray-600"}`}
                                                >
                                                    {user.etat_user}
                                                </span>
                                        </td>
                                        <td className="px-6 py-3 flex justify-center gap-3">
                                            <button
                                                onClick={() => handleEdit(user.id)}
                                                title="Modifier"
                                                className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                title="Supprimer"
                                                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Users;
