import React, { useState, useEffect } from "react";
import { FaStar, FaTrash } from "react-icons/fa";  // <-- import icône poubelle
import axios from "axios";
import Header_admin from "./Header_admin.jsx";

function InitialeUtilisateur({ prenom }) {
    const initiale = prenom ? prenom.charAt(0).toUpperCase() : "?";

    return (
        <div
            className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-700 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg select-none"
            aria-label={`Initiale de ${prenom || "Utilisateur"}`}
            title={prenom || "Utilisateur"}
        >
            {initiale}
        </div>
    );
}

function Avis() {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:8081/avis")
            .then((res) => {
                setEvaluations(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSupprimer = (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet avis ?")) return;

        setDeletingId(id);

        axios
            .delete(`http://localhost:8081/avis/delete/${id}`)
            .then(() => {
                setEvaluations((prev) => prev.filter((e) => e.id !== id));
                setDeletingId(null);
            })
            .catch((err) => {
                console.error(err);
                setDeletingId(null);
                alert("Erreur lors de la suppression.");
            });
    };

    return (
        <>
            <Header_admin />
            <h2 className="text-4xl font-extrabold text-center mb-12 relative inline-block text-purple-400">
                Avis des Clients
                <span className="block w-24 h-1 bg-purple-600 rounded-full mt-3 mx-auto"></span>
            </h2>

            {loading ? (
                <p className="text-center text-gray-400 italic">Chargement...</p>
            ) : evaluations.length === 0 ? (
                <p className="text-center text-gray-400 italic">
                    Aucun avis disponible pour le moment.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[420px] overflow-y-auto pr-6 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800">
                    {evaluations.map((evalItem) => (
                        <article
                            key={evalItem.id}
                            className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl shadow-lg border border-purple-700 p-6 flex space-x-6 hover:scale-[1.03] transition-transform duration-300 relative"
                            aria-label={`Avis de ${evalItem.utilisateur?.prenom || "Anonyme"}`}
                        >
                            {evalItem.utilisateur?.photoUrl ? (
                                <img
                                    src={evalItem.utilisateur.photoUrl}
                                    alt={evalItem.utilisateur.prenom || "Utilisateur"}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-purple-600 shadow-md"
                                />
                            ) : (
                                <InitialeUtilisateur prenom={evalItem.utilisateur?.prenom} />
                            )}

                            <div className="flex flex-col justify-between flex-1">
                                <p className="text-purple-400 font-semibold mb-2 text-xl drop-shadow-lg w-full">
                                    {evalItem.utilisateur?.prenom || "Anonyme"}
                                </p>
                                <p className="text-gray-300 mb-4 leading-relaxed select-text whitespace-pre-wrap max-w-md break-words">
                                    {evalItem.contenu}
                                </p>

                                <div
                                    className="flex text-yellow-400"
                                    aria-label={`Note : ${evalItem.note_app} sur 5`}
                                >
                                    {Array(5)
                                        .fill()
                                        .map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={
                                                    i < evalItem.note_app ? "text-yellow-400 drop-shadow" : "text-gray-600"
                                                }
                                                size={20}
                                            />
                                        ))}
                                </div>
                            </div>

                            <button
                                onClick={() => handleSupprimer(evalItem.id)}
                                disabled={deletingId === evalItem.id}
                                className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition disabled:opacity-50"
                                aria-label="Supprimer cet avis"
                                title="Supprimer"
                            >
                                {deletingId === evalItem.id ? (
                                    <span className="animate-spin inline-block">
                    {/* Petite animation de chargement */}
                                        <FaTrash size={20} />
                  </span>
                                ) : (
                                    <FaTrash size={20} />
                                )}
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </>
    );
}

export default Avis;
