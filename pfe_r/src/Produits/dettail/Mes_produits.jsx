import React, { useEffect, useState } from "react";
import axios from "axios";
import Header_login from "../../HEADER/Header_login.jsx";
import Footer from "../../Footer/Footer.jsx";

function Mes_produits() {
    const [demandes, setDemandes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatut, setSelectedStatut] = useState("");
    const [selectedCategorie, setSelectedCategorie] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const categories = [
        { value: "", label: "Toutes les catégories" },
        { value: "electronique", label: "Électronique" },
        { value: "vetement", label: "Vêtement" },
        { value: "livre", label: "Livre" },
        { value: "Autre", label: "Autre" }
    ];

    useEffect(() => {
        if (user && user.id) {
            const notifications = JSON.parse(localStorage.getItem("notif_mes_demmandes")) || {};
            if (notifications[user.id]) {
                delete notifications[user.id];
                localStorage.setItem("notif_mes_demmandes", JSON.stringify(notifications));
            }

            axios.get(`http://localhost:8081/api/demmandechange/envoyees/${user.id}`)
                .then((res) => setDemandes(res.data))
                .catch((err) => {
                    console.error("Erreur chargement demandes:", err);
                    alert("Erreur lors du chargement.");
                });
        }
    }, [user]);

    const handleSupprimer = (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette demande ?")) return;

        axios.delete(`http://localhost:8081/api/demmandechange/${id}`)
            .then(() => {
                setDemandes(prev => prev.filter((d) => d.id !== id));
            })
            .catch((err) => {
                console.error("Erreur suppression :", err);
                alert("Impossible de supprimer la demande.");
            });
    };

    const filteredDemandes = demandes.filter((demande) => {
        const titreMatch = demande.produit?.titre?.toLowerCase().includes(searchTerm.toLowerCase());
        const statutMatch = selectedStatut === "" || demande.statut === selectedStatut;
        const categorieMatch = selectedCategorie === "" || demande.produit?.categorie === selectedCategorie;
        return titreMatch && statutMatch && categorieMatch;
    });

    const activeFiltersCount = [selectedCategorie, selectedStatut].filter(val => val !== "").length;

    return (
        <>
            <Header_login />
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 min-h-screen pt-16 pb-20 px-6">
                <h1 className="text-4xl font-extrabold text-center text-purple-800 drop-shadow mb-10">
                    Mes Produits Confirmés
                </h1>

                {/* Recherche + Filtres */}
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
                                        <option value="">Tous les statuts</option>
                                        <option value="en attente">En attente</option>
                                        <option value="valide">Validé</option>
                                        <option value="refuse">Refusé</option>
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

                {/* Liste filtrée */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {filteredDemandes.map((demande) => {
                        const produit = demande.produit || {};
                        const isDon = produit.statut === "donner";

                        return (
                            <div
                                key={demande.id}
                                className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-200"
                            >
                                <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-lg">
                                    <img
                                        src={
                                            produit.photo
                                                ? `data:image/jpeg;base64,${produit.photo}`
                                                : "/default-image.png"
                                        }
                                        alt={produit.titre}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center group-hover:text-purple-600 transition-colors">
                                    {produit.titre}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 text-center line-clamp-3">
                                    {produit.description}
                                </p>
                                <div className="flex justify-center gap-2 flex-wrap mt-auto">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDon ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                                        {isDon ? "À Donner" : "À Échanger"}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        demande.statut === "en attente"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : demande.statut === "valide"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                    }`}>
                                        {demande.statut.charAt(0).toUpperCase() + demande.statut.slice(1)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleSupprimer(demande.id)}
                                    className="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full transition-colors"
                                >
                                    Supprimer
                                </button>
                            </div>
                        );
                    })}
                </div>

                {filteredDemandes.length === 0 && (
                    <p className="text-center text-gray-600 mt-8">Aucune demande trouvée.</p>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Mes_produits;
