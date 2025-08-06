import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header_admin from "./Header_admin.jsx";

function ListeProduits() {
    const [produits, setProduits] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        axios
            .get("http://localhost:8081/api/produit/all")
            .then((res) => setProduits(res.data))
            .catch((err) => console.error("Erreur chargement produits :", err));

        axios
            .get("http://localhost:8081/api/utilisateur/all")
            .then((res) => setUsers(res.data))
            .catch((err) => console.error("Erreur chargement utilisateurs :", err));
    }, []);

    const usersById = users.reduce((acc, u) => {
        acc[u.id] = u;
        return acc;
    }, {});

    const handleDelete = (id) => {
        if (window.confirm("❌ Voulez-vous supprimer ce produit ?")) {
            axios
                .delete(`http://localhost:8081/api/produit/delete/${id}`)
                .then(() => setProduits(produits.filter((p) => p.id !== id)))
                .catch((err) => console.error("Erreur suppression produit :", err));
        }
    };

    const filteredProduits = produits.filter(
        (produit) =>
            produit.titre.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedUser === "" || String(produit.utilisateurId) === selectedUser)
    );

    return (
        <>
            <Header_admin />
            <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-50 p-8">
                <h1 className="text-5xl font-extrabold text-center text-indigo-900 mb-10 drop-shadow-lg">
                    🛍️ Liste des Produits
                </h1>

                {/* Recherche + filtre utilisateur */}
                <div className="mb-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-6 justify-center items-center">
                    <div className="relative flex-grow max-w-lg w-full md:w-auto">
                        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-indigo-500 text-xl pointer-events-none" />
                        <input
                            type="text"
                            placeholder="🔍 Rechercher un produit par titre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-3 rounded-full border border-indigo-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 text-indigo-900 placeholder-indigo-400 transition duration-300"
                        />
                    </div>

                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full md:w-72 py-3 px-5 rounded-full border border-indigo-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 text-indigo-900 transition duration-300"
                    >
                        <option value="">Tous les utilisateurs</option>
                        {users
                            .filter((user) => user.id !== currentUser?.id)
                            .map((user) => (
                                <option key={user.id} value={String(user.id)}>
                                    {user.nom} {user.prenom}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Nombre de produits */}
                <p className="text-gray-600 mt-1 italic ">
                    Total :{" "}
                    <span className="font-semibold">{filteredProduits.length} Produits</span>
                </p>

                {/* Tableau des produits */}
                <div className="overflow-x-auto rounded-2xl shadow-xl max-w-7xl mx-auto bg-white border border-indigo-200">
                    <table className="min-w-full table-auto border-collapse text-indigo-900">
                        <thead className="bg-indigo-100 uppercase text-sm font-semibold tracking-wide select-none">
                        <tr>
                            <th className="px-7 py-4 border-b border-indigo-300 text-left rounded-tl-2xl">Image</th>
                            <th className="px-7 py-4 border-b border-indigo-300 text-left">Titre</th>
                            <th className="px-7 py-4 border-b border-indigo-300 text-left">Description</th>
                            <th className="px-7 py-4 border-b border-indigo-300 text-left">Catégorie</th>
                            <th className="px-7 py-4 border-b border-indigo-300 text-left">Statut</th>
                            <th className="px-7 py-4 border-b border-indigo-300 text-left">Utilisateur</th>
                            <th className="px-7 py-4 border-b border-indigo-300 text-center rounded-tr-2xl">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProduits.map((produit) => (
                            <tr
                                key={produit.id}
                                className="hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
                            >
                                <td className="px-7 py-4 border-b border-indigo-200">
                                    {produit.photo ? (
                                        <img
                                            src={`data:image/jpeg;base64,${produit.photo}`}
                                            alt={produit.titre}
                                            className="w-28 h-28 object-cover rounded-xl shadow-md"
                                        />
                                    ) : (
                                        <div className="w-28 h-28 bg-indigo-100 flex items-center justify-center text-indigo-400 rounded-xl shadow-inner text-sm font-semibold">
                                            Pas d'image
                                        </div>
                                    )}
                                </td>
                                <td className="px-7 py-4 border-b border-indigo-200 font-semibold text-indigo-700 text-lg">
                                    {produit.titre}
                                </td>
                                <td className="px-7 py-4 border-b border-indigo-200 text-indigo-600 text-sm leading-relaxed max-w-xs truncate">
                                    {produit.description}
                                </td>
                                <td className="px-7 py-4 border-b border-indigo-200 text-indigo-700 font-medium">
                                    {produit.categorie}
                                </td>
                                <td className="px-7 py-4 border-b border-indigo-200">
                    <span
                        className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${
                            produit.statut === "donner"
                                ? "bg-green-200 text-green-800"
                                : produit.statut === "changer"
                                    ? "bg-blue-200 text-blue-800"
                                    : "bg-red-200 text-red-800"
                        }`}
                    >
                      {produit.statut}
                    </span>
                                </td>
                                <td className="px-7 py-4 border-b border-indigo-200 font-medium">
                                    {usersById[produit.utilisateurId]
                                        ? `${usersById[produit.utilisateurId].nom} ${usersById[produit.utilisateurId].prenom}`
                                        : "Inconnu"}
                                </td>
                                <td className="px-7 py-4 border-b border-indigo-200 text-center">
                                    <button
                                        onClick={() => handleDelete(produit.id)}
                                        className="p-3 rounded-full bg-red-300 text-red-700 hover:bg-red-700 hover:text-white shadow-lg transition"
                                        title="Supprimer"
                                    >
                                        <FaTrash size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filteredProduits.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-16 text-indigo-400 text-xl font-semibold select-none">
                                    Aucun produit trouvé.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ListeProduits;
