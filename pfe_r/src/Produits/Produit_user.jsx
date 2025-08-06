import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import Header from "../HEADER/Header.jsx";
import Header_login from "../HEADER/Header_login.jsx";

function Produit_user() {
    const [produits, setProduits] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategorie, setSelectedCategorie] = useState("");
    const [selectedStatut, setSelectedStatut] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const connectedUser = JSON.parse(localStorage.getItem("user"));

    const categories = [
        { value: "", label: "Toutes les catégories" },
        { value: "electronique", label: "Électronique" },
        { value: "vetement", label: "Vêtement" },
        { value: "livre", label: "Livre" },
        { value: "Autre", label: "Autre" }
    ];

    const statuts = [
        { value: "", label: "Tous les statuts" },
        { value: "donner", label: "À donner" },
        { value: "changer", label: "À échanger" }
    ];

    useEffect(() => {
        axios.get("http://localhost:8081/api/produit/all")
            .then((res) => {
                setProduits(res.data);
            })
            .catch((err) => {
                console.error("Erreur chargement produits:", err);
                alert("Erreur lors du chargement des produits. Veuillez réessayer plus tard.");
            });
    }, []);

    const activeFiltersCount = [selectedCategorie, selectedStatut].filter(val => val !== "").length;

    const filteredProduits = produits.filter(prod => {
        const isMyProduct = connectedUser && prod.utilisateurId === connectedUser.id;
        const matchSearch = prod.titre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategorie = selectedCategorie === "" || prod.categorie === selectedCategorie;
        const matchStatut = selectedStatut === "" || prod.statut === selectedStatut;
        return isMyProduct && matchSearch && matchCategorie && matchStatut;
    });

    return (
        <>
            <Header_login />
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 py-12 px-6">
                <h2 className="text-4xl font-extrabold text-center mb-10 text-purple-800 drop-shadow-lg">
                    Mes Produits
                </h2>

                <div className="max-w-4xl mx-auto mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                                <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filtres
                                {activeFiltersCount > 0 && (
                                    <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {showFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                                    <select
                                        value={selectedCategorie}
                                        onChange={(e) => setSelectedCategorie(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                                    <select
                                        value={selectedStatut}
                                        onChange={(e) => setSelectedStatut(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                                    >
                                        {statuts.map(stat => (
                                            <option key={stat.value} value={stat.value}>{stat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {(selectedCategorie || selectedStatut) && (
                                    <button
                                        onClick={() => {
                                            setSelectedCategorie("");
                                            setSelectedStatut("");
                                        }}
                                        className="md:col-span-2 text-sm text-purple-600 hover:text-purple-800 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Réinitialiser les filtres
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {filteredProduits.map((prod) => (
                        <Link to={`/produit/${prod.id}`} key={prod.id}
                              className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col link-black">
                            <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-lg">
                                <img
                                    src={`data:image/jpeg;base64,${prod.photo}`}
                                    alt={prod.titre}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center group-hover:text-purple-600 transition-colors">
                                {prod.titre}
                            </h3>
                            <div className="mt-auto">
                                <span className="block text-sm text-gray-600 text-center">
                                    {prod.localisation}
                                </span>
                                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 w-full text-center ${
                                    prod.statut === 'donner' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {prod.statut === 'donner' ? 'À donner' : 'À échanger'}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredProduits.length === 0 && (
                    <p className="text-center text-gray-600 mt-8">Aucun produit trouvé.</p>
                )}
            </div>
        </>
    );
}

export default Produit_user;
