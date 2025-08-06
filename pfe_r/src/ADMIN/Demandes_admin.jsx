import React, { useEffect, useState } from "react";
import axios from "axios";
import Header_admin from "./Header_admin.jsx";

function Demandes_admin() {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imagesParDemande, setImagesParDemande] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtre, setFiltre] = useState("tous");

    const [user] = useState(() => JSON.parse(localStorage.getItem("user")));

    useEffect(() => {
        if (user && user.id) {
            fetchDemandesRecues();
        }
    }, [user]);

    const fetchDemandesRecues = () => {
        setLoading(true);
        axios
            .get(`http://localhost:8081/api/demmandechange/all`)
            .then(async (res) => {
                setDemandes(res.data);
                setLoading(false);

                const imagesMap = {};
                await Promise.all(
                    res.data.map(async (demande) => {
                        try {
                            const resImg = await axios.get(
                                `http://localhost:8081/api/echange/images/demmande/${demande.id}`
                            );
                            if (resImg.data.length > 0) {
                                imagesMap[demande.id] = resImg.data[0].imageData;
                            }
                        } catch (err) {
                            console.error("Erreur chargement image échange :", err);
                        }
                    })
                );

                setImagesParDemande(imagesMap);
            })
            .catch((err) => {
                console.error("Erreur de chargement :", err);
                setLoading(false);
            });
    };

    const handleDeleteDemande = (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette demande ?")) return;

        axios
            .delete(`http://localhost:8081/api/demmandechange/${id}`)
            .then(() => {
                setDemandes((prev) => prev.filter((d) => d.id !== id));
                setImagesParDemande((prev) => {
                    const newImages = { ...prev };
                    delete newImages[id];
                    return newImages;
                });
            })
            .catch((err) => {
                console.error("Erreur lors de la suppression :", err);
                alert("Erreur lors de la suppression de la demande.");
            });
    };

    // Filtrage
    const demandesFiltrees = demandes.filter((d) => {
        const matchStatut = filtre === "tous" || d.statut === filtre;
        const matchSearch =
            d.produit?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.utilisateur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchStatut && matchSearch;
    });

    return (
        <>
            <Header_admin />
            <main className="max-w-7xl mx-auto p-8 bg-white rounded-3xl shadow-lg my-10">
                <h1 className="text-4xl font-extrabold text-indigo-600 mb-12 text-center">
                    📬 Tous les demandes
                </h1>

                {/* Barre de recherche et filtre */}
                <section className="flex flex-col md:flex-row gap-6 mb-12 justify-between items-center">
                    <input
                        type="search"
                        placeholder="🔎 Rechercher par titre ou prénom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-2/3 px-5 py-3 border-2 border-indigo-300 rounded-3xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
                    />
                    <select
                        value={filtre}
                        onChange={(e) => setFiltre(e.target.value)}
                        className="w-full md:w-1/3 px-5 py-3 border-2 border-indigo-300 rounded-3xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
                    >
                        <option value="tous">📋 Tous</option>
                        <option value="en attente">⏳ En attente</option>
                        <option value="valide">✅ Acceptées</option>
                        <option value="refuse">❌ Refusées</option>
                    </select>
                </section>

                {/* Affichage nombre demandes */}
                {!loading && demandesFiltrees.length > 0 && (
                    <p className="text-gray-600 mt-1 italic">
                        Total : <span className="font-semibold">{demandesFiltrees.length} Demandes</span>
                    </p>
                )}

                {/* Contenu */}
                {loading ? (
                    <p className="text-center text-gray-500 text-lg">Chargement...</p>
                ) : demandesFiltrees.length === 0 ? (
                    <p className="text-center text-gray-400 italic text-lg">Aucune demande trouvée.</p>
                ) : (
                    <ul className="space-y-12">
                        {demandesFiltrees.map((demande) => (
                            <li
                                key={demande.id}
                                className="flex flex-col md:flex-row bg-indigo-50 rounded-3xl shadow-md hover:shadow-xl transition-shadow p-6 md:p-8 gap-10 items-center"
                            >
                                {/* Image produit */}
                                <div className="flex flex-col items-center flex-shrink-0">
                                    <img
                                        src={
                                            demande.produit.photo
                                                ? `data:image/jpeg;base64,${demande.produit.photo}`
                                                : "/default-product.png"
                                        }
                                        alt="Produit"
                                        className="w-32 h-32 rounded-3xl object-cover border-4 border-indigo-400 shadow"
                                    />
                                    <p className="mt-5 text-xl font-semibold text-indigo-700">{demande.produit.titre}</p>
                                </div>

                                {/* Détails */}
                                <div className="flex-1 space-y-3 text-indigo-900">
                                    <p className="text-lg">
                                        <strong>Message :</strong> {demande.message}
                                    </p>
                                    <p>
                                        <strong>Date :</strong>{" "}
                                        <time dateTime={demande.dateDE}>
                                            {new Date(demande.dateDE).toLocaleDateString("fr-FR", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </time>
                                    </p>
                                    <p>
                                        <strong>Statut :</strong>{" "}
                                        <span
                                            className={`inline-block px-4 py-1 rounded-full font-semibold text-sm ${
                                                demande.statut === "en attente"
                                                    ? "bg-yellow-300 text-yellow-900"
                                                    : demande.statut === "valide"
                                                        ? "bg-green-300 text-green-900"
                                                        : demande.statut === "refuse"
                                                            ? "bg-red-300 text-red-900"
                                                            : "bg-gray-300 text-gray-900"
                                            }`}
                                        >
                                            {demande.statut.charAt(0).toUpperCase() + demande.statut.slice(1)}
                                        </span>
                                    </p>

                                    <p className="text-sm text-indigo-700">
                                        👤 <strong>De :</strong> {demande.utilisateur?.prenom || "Inconnu"}
                                    </p>
                                    <p className="text-sm text-indigo-700">
                                        🎯 <strong>À :</strong> {demande.produit?.utilisateur?.prenom || "Inconnu"}
                                    </p>

                                    <span
                                        className={`inline-block mt-3 px-5 py-1 rounded-full text-sm font-semibold ${
                                            demande.produit.statut === "donner"
                                                ? "bg-green-400 text-green-900"
                                                : "bg-blue-400 text-blue-900"
                                        }`}
                                    >
                                        {demande.produit.statut === "donner" ? "Donner" : "Échange"}
                                    </span>
                                </div>

                                {/* Image échange proposée + bouton supprimer */}
                                <div className="flex flex-col items-center gap-6 flex-shrink-0">
                                    {demande.produit.statut === "changer" ? (
                                        imagesParDemande[demande.id] ? (
                                            <>
                                                <img
                                                    src={`data:image/jpeg;base64,${imagesParDemande[demande.id]}`}
                                                    alt="Échange proposé"
                                                    onClick={() => setSelectedImage(imagesParDemande[demande.id])}
                                                    className="w-44 h-44 rounded-3xl border-4 border-indigo-400 shadow-lg cursor-pointer hover:scale-110 transition-transform"
                                                />
                                                <span className="mt-3 text-indigo-600 font-medium text-sm">Produit proposé</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-400 italic">Aucun produit proposé</span>
                                        )
                                    ) : (
                                        <span className="text-gray-400 italic">Aucun échange attendu</span>
                                    )}

                                    <button
                                        onClick={() => handleDeleteDemande(demande.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 shadow-md transition duration-300"
                                        title="Supprimer cette demande"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Modal image zoomée */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 cursor-zoom-out"
                        onClick={() => setSelectedImage(null)}
                    >
                        <img
                            src={`data:image/jpeg;base64,${selectedImage}`}
                            alt="Zoom"
                            className="max-w-[90vw] max-h-[90vh] rounded-3xl shadow-2xl"
                        />
                    </div>
                )}
            </main>
        </>
    );
}

export default Demandes_admin;
