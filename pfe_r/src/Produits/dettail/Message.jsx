import React, { useEffect, useState } from "react";
import Header_login from "../../HEADER/Header_login.jsx";
import Footer from "../../Footer/Footer.jsx";
import axios from "axios";

function Message() {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imagesParDemande, setImagesParDemande] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);  // حالة الصورة المكبرة

    const [user] = useState(() => JSON.parse(localStorage.getItem("user")));

    useEffect(() => {
        if (user && user.id) {
            fetchDemandesRecues();
        }
    }, [user]);

    const fetchDemandesRecues = () => {
        setLoading(true);
        axios
            .get(`http://localhost:8081/api/demmandechange/recues/en_attente/${user.id}`)
            .then(async (res) => {
                setDemandes(res.data);
                setLoading(false);

                const imagesMap = {};
                await Promise.all(res.data.map(async (demande) => {
                    try {
                        const resImg = await axios.get(`http://localhost:8081/api/echange/images/demmande/${demande.id}`);
                        if (resImg.data.length > 0) {
                            imagesMap[demande.id] = resImg.data[0].imageData;
                        }
                    } catch (err) {
                        console.error("Erreur chargement image échange :", err);
                    }
                }));

                setImagesParDemande(imagesMap);
            })
            .catch((err) => {
                console.error("Erreur de chargement :", err);
                setLoading(false);
            });
    };

    const handleChangeStatut = (id, newStatut, demande) => {
        axios
            .put(`http://localhost:8081/api/demmandechange/${id}/statut`, null, {
                params: { statut: newStatut },
            })
            .then(() => {
                const notifications = JSON.parse(localStorage.getItem("notif_mes_demmandes")) || {};
                notifications[demande.utilisateurId] = true;
                localStorage.setItem("notif_mes_demmandes", JSON.stringify(notifications));

                setDemandes((prev) => prev.filter((d) => d.id !== id));
            })
            .catch((err) => {
                console.error("Erreur lors du changement du statut :", err);
                alert("Impossible de changer le statut.");
            });
    };

    return (
        <>
            <Header_login />
            <div className="max-w-4xl mx-auto mt-10 mb-10 p-6 bg-white shadow-xl rounded-xl">
                <h2 className="text-3xl font-bold text-center mb-6">Messages reçus</h2>
                {loading ? (
                    <p className="text-center text-gray-500">Chargement...</p>
                ) : demandes.length === 0 ? (
                    <p className="text-center text-gray-500">Aucune demande pour vos produits.</p>
                ) : (
                    <ul className="space-y-6">
                        {demandes.map((demande) => (
                            <li
                                key={demande.id}
                                className="border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 bg-gray-50"
                            >
                                <div className="grid md:grid-cols-3 gap-4 items-center">
                                    {/* Image produit */}
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={
                                                demande.produit.photo
                                                    ? `data:image/jpeg;base64,${demande.produit.photo}`
                                                    : "/default-product.png"
                                            }
                                            alt="Produit"
                                            className="w-28 h-28 object-cover rounded-xl border border-gray-300 mb-2"
                                        />
                                        <p className="text-center text-sm font-medium text-gray-700">{demande.produit.titre}</p>
                                    </div>

                                    {/* Détails */}
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <p><strong>Message :</strong> {demande.message}</p>
                                        <p><strong>Date :</strong> {demande.dateDE}</p>
                                        <p><strong>Statut :</strong> {demande.statut}</p>
                                        <span
                                            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                                demande.produit.statut === "donner"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                        >
                                            {demande.produit.statut === "donner" ? "Donner" : "Échange"}
                                        </span>
                                        <p className="text-xs text-gray-500">
                                            Demandeur : {demande.utilisateur?.prenom || "Inconnu"}
                                        </p>
                                    </div>

                                    {/* Image échange proposée */}
                                    <div className="flex flex-col items-center">
                                        {demande.produit.statut === "changer" ? (
                                            imagesParDemande[demande.id] ? (
                                                <>
                                                    <img
                                                        src={`data:image/jpeg;base64,${imagesParDemande[demande.id]}`}
                                                        alt="Échange proposé"
                                                        onClick={() => setSelectedImage(imagesParDemande[demande.id])}
                                                        className="w-40 h-40 object-cover rounded-xl border border-gray-300 cursor-pointer hover:scale-105 transition"
                                                    />
                                                    <span className="mt-1 text-xs text-gray-500">Produit proposé</span>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Aucun produit proposé</span>
                                            )
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Aucun échange attendu</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 mt-5">
                                    {demande.statut === "en attente" ? (
                                        <>
                                            <button
                                                onClick={() => handleChangeStatut(demande.id, "valide", demande)}
                                                className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                                            >
                                                ✅ Accepter
                                            </button>
                                            <button
                                                onClick={() => handleChangeStatut(demande.id, "refuse", demande)}
                                                className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                                            >
                                                ❌ Refuser
                                            </button>
                                        </>
                                    ) : (
                                        <span className="italic text-gray-500">Action terminée</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Footer />

            {/* Modal de l'image zoomée */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50 cursor-zoom-out"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={`data:image/jpeg;base64,${selectedImage}`}
                        alt="Zoom"
                        className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-lg"
                    />
                </div>
            )}
        </>
    );
}

export default Message;
