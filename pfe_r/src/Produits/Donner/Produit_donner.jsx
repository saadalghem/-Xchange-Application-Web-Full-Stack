import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import {FaTag} from "react-icons/fa";

function Produit_donner() {
    const [produits, setProduits] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategorie, setSelectedCategorie] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    
    const connectedUser = JSON.parse(localStorage.getItem("user"));

    const categories = [
        { value: "", label: "Toutes les catégories" },
        { value: "electronique", label: "Électronique" },
        { value: "vetement", label: "Vêtement" },
        { value: "livre", label: "Livre" },
        { value: "Maison", label: "Maison" },
        { value: "Autre", label: "Autre" }
    ];

    const locations = [
        { value: "", label: "Toutes les villes" },
        { value: "Casablanca", label: "Casablanca" },
        { value: "Rabat", label: "Rabat" },
        { value: "Fès", label: "Fès" },
        { value: "Marrakech", label: "Marrakech" },
        { value: "Tanger", label: "Tanger" },
        { value: "Agadir", label: "Agadir" },
        { value: "Meknès", label: "Meknès" },
        { value: "Oujda", label: "Oujda" },
        { value: "Kenitra", label: "Kenitra" },
        { value: "Tétouan", label: "Tétouan" },
        { value: "Safi", label: "Safi" },
        { value: "Khouribga", label: "Khouribga" },
        { value: "El Jadida", label: "El Jadida" },
        { value: "Beni Mellal", label: "Beni Mellal" },
        { value: "Nador", label: "Nador" },
        { value: "Taza", label: "Taza" },
        { value: "Settat", label: "Settat" },
        { value: "Berrechid", label: "Berrechid" },
        { value: "Khemisset", label: "Khemisset" },
        { value: "Inezgane", label: "Inezgane" },
        { value: "Ksar El Kebir", label: "Ksar El Kebir" },
        { value: "Larache", label: "Larache" },
        { value: "Guelmim", label: "Guelmim" },
        { value: "Khenifra", label: "Khenifra" },
        { value: "Al Hoceima", label: "Al Hoceima" },
        { value: "Ouarzazate", label: "Ouarzazate" },
        { value: "Berkane", label: "Berkane" },
        { value: "Taourirt", label: "Taourirt" },
        { value: "Bouskoura", label: "Bouskoura" },
        { value: "Fquih Ben Salah", label: "Fquih Ben Salah" },
        { value: "Dcheira El Jihadia", label: "Dcheira El Jihadia" },
        { value: "Mohammedia", label: "Mohammedia" },
        { value: "Sidi Slimane", label: "Sidi Slimane" },
        { value: "Errachidia", label: "Errachidia" },
        { value: "Guercif", label: "Guercif" },
        { value: "Oulad Teima", label: "Oulad Teima" },
        { value: "Ben Guerir", label: "Ben Guerir" },
        { value: "Sidi Kacem", label: "Sidi Kacem" },
        { value: "Taroudant", label: "Taroudant" },
        { value: "Tiflet", label: "Tiflet" },
        { value: "Essaouira", label: "Essaouira" },
        { value: "Sefrou", label: "Sefrou" },
        { value: "Youssoufia", label: "Youssoufia" },
        { value: "Martil", label: "Martil" },
        { value: "Ait Melloul", label: "Ait Melloul" },
        { value: "Azrou", label: "Azrou" },
        { value: "Dakhla", label: "Dakhla" },
        { value: "Midelt", label: "Midelt" },
        { value: "Azilal", label: "Azilal" }
    ];

    useEffect(() => {
        axios.get("http://localhost:8081/api/produit/donner")
            .then((res) => {
                setProduits(res.data);
            })
            .catch((err) => {
                console.error("Erreur chargement produits:", err);
                alert("Erreur lors du chargement des produits. Veuillez réessayer plus tard.");
            });
    }, []);

    const filteredProduits = produits.filter(prod => {
        const notOwnProduct = !connectedUser || prod.utilisateurId !== connectedUser.id;
        const matchSearch = prod.titre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategorie = selectedCategorie === "" || prod.categorie === selectedCategorie;
        const matchLocation = selectedLocation === "" || prod.localisation === selectedLocation;
        
        return notOwnProduct && matchSearch && matchCategorie && matchLocation;
    });

    const activeFiltersCount = [selectedCategorie, selectedLocation].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-12 px-6">
            <h2 className="text-4xl font-extrabold text-center mb-10 text-purple-800 drop-shadow-lg">
                {selectedCategorie || selectedLocation ?
                    `Produits à donner ${selectedCategorie ? `- ${categories.find(cat => cat.value === selectedCategorie)?.label}` : ''} 
                    ${selectedLocation ? `à ${selectedLocation}` : ''}` :
                    'Produits à donner'}
            </h2>

            {/* Barre de recherche et bouton filtres */}
            <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
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

                    {/* Filtres déroulants */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                                <select
                                    value={selectedCategorie}
                                    onChange={(e) => setSelectedCategorie(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Ville</label>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                >
                                    {locations.map(loc => (
                                        <option key={loc.value} value={loc.value}>
                                            {loc.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {(selectedCategorie || selectedLocation) && (
                                <button
                                    onClick={() => {
                                        setSelectedCategorie("");
                                        setSelectedLocation("");
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

            {/* Le reste du composant reste inchangé ... */}
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
                            <p className="flex items-center justify-center gap-2 text-gray-700 italic mb-4 text-sm select-none">
                                <FaTag className="text-purple-500" />
                                Catégorie : <span className="font-medium text-purple-600">{prod.categorie}</span>
                            </p>
                            <p className="flex items-center justify-center gap-2 text-gray-700 italic mb-4 text-sm select-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-purple-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.77.698 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                Publié par : <span className="font-semibold text-purple-600">{prod.utilisateur?.prenom || "Anonyme"}</span>
                            </p>
                            <span className="block text-sm text-gray-600 text-center">
                                {prod.localisation}
                            </span>
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mt-2 w-full text-center">
                                À donner
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredProduits.length === 0 && (
                <div className="text-center bg-white p-8 rounded-lg shadow-md mt-10 max-w-2xl mx-auto">
                    <p className="text-gray-600 text-lg">
                        Aucun produit ne correspond à vos critères de recherche.
                    </p>
                </div>
            )}
        </div>
    );
}

export default Produit_donner;