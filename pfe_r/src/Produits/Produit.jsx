import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import {FaTag} from "react-icons/fa";

function Produit() {
    const [produits, setProduits] = useState([]);
    const connectedUser = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:8081/api/produit/all")
            .then((res) => {
                setProduits(res.data);
            })
            .catch((err) => {
                console.error("Erreur chargement produits:", err);
                alert("Erreur lors du chargement des produits. Veuillez réessayer plus tard.");
            });
    }, []);

    const handleClickDonner = () => {
        if (connectedUser) {
            navigate("/Obj_donner_login");
        } else {
            navigate("/Login");
        }
        window.scrollTo(0, 0);
    };

    const handleClickChanger = () => {
        if (connectedUser) {
            navigate("/Obj_changer_login");
        } else {
            navigate("/Login");
        }
        window.scrollTo(0, 0);
    };

    const filteredProduits = produits.filter(
        (prod) => !connectedUser || prod.utilisateurId !== connectedUser.id
    );

    const limitedProduits = filteredProduits.slice(0, 6);

    return (
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 py-12 px-6">
            <h2 className="text-4xl font-extrabold text-center mb-10 text-purple-800 drop-shadow-lg">
                Dernières annonces
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {limitedProduits.map((prod) => (
                    <div
                        key={prod.id}
                        onClick={() => {
                            if (connectedUser) {
                                navigate(`/produit/${prod.id}`);
                            } else {
                                navigate("/Login");
                            }
                            window.scrollTo(0, 0);
                        }}
                        className="cursor-pointer group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                        <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-lg">
                            <img
                                src={`data:image/jpeg;base64,${prod.photo}`}
                                alt={prod.titre}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-1 text-center group-hover:text-purple-600 transition-colors">
                            {prod.titre}
                        </h3>
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
                        <div className="mt-auto">
                          <span className="block text-sm text-gray-600 text-center">
                            {prod.localisation}
                          </span>
                            <span
                                className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 w-full text-center ${
                                    prod.statut === "donner"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                }`}
                            >
                {prod.statut === "donner" ? "À donner" : "À échanger"}
              </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-12 gap-6">
                <button
                    onClick={handleClickDonner}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-2xl shadow-lg transition"
                >
                    Voir plus À donner
                </button>
                <button
                    onClick={handleClickChanger}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl shadow-lg transition"
                >
                    Voir plus À échanger
                </button>
            </div>
        </div>
    );
}

export default Produit;
