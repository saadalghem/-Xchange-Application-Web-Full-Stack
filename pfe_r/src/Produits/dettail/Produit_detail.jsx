import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTag, FaCheckCircle, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// Composant pour afficher les étoiles selon la note (ex: 3.5)
function Etoiles({ note }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (note >= i) stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
        else if (note >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 inline" />);
        else stars.push(<FaRegStar key={i} className="text-yellow-400 inline" />);
    }
    return <span>{stars}</span>;
}

// Composant pour afficher la liste des évaluations avec toggle
function ListeEvaluations({ evaluations, showAll, toggleShowAll }) {
    return (
        <>
            <ul className="text-sm text-gray-700">
                {(showAll ? evaluations : evaluations.slice(0, 1)).map((e) => (
                    <li key={e.id} className="border-b py-2 last:border-none flex justify-between items-center">
                        <div>
                            <Etoiles note={e.note} /> - {e.commentaire || "Pas de commentaire"}{" "}
                            <span className="text-gray-500 italic ml-2">({e.dateEvaluation})</span>
                        </div>
                        <div className="text-blue-600 font-semibold ml-4">{e.utilisateurNoteur?.prenom || "Utilisateur"}</div>
                    </li>
                ))}
            </ul>
            {evaluations.length > 1 && (
                <button
                    onClick={toggleShowAll}
                    className="mt-2 text-blue-600 hover:underline focus:outline-none"
                    aria-label="Afficher ou réduire la liste des évaluations"
                >
                    {showAll ? "Réduire les évaluations" : `Afficher toutes les évaluations (${evaluations.length})`}
                </button>
            )}
        </>
    );
}

function Produit_detail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [produit, setProduit] = useState(null);
    const [showMessageForm, setShowMessageForm] = useState(false);
    const [message, setMessage] = useState("");
    const [erreurMessage, setErreurMessage] = useState("");
    const [erreurImage, setErreurImage] = useState("");
    const [preuveImage, setPreuveImage] = useState(null);

    const [showUserModal, setShowUserModal] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [evaluations, setEvaluations] = useState([]);

    const [noteValeur, setNoteValeur] = useState(0);
    const [noteCommentaire, setNoteCommentaire] = useState("");
    const [noteEnvoye, setNoteEnvoye] = useState(false);
    const [aDejaNote, setADejaNote] = useState(false);
    const [demandeValideExiste, setDemandeValideExiste] = useState(false);
    const [estDemandeur, setEstDemandeur] = useState(false);

    const [showAllEvaluations, setShowAllEvaluations] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    // Charger le produit
    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/produit/${id}`)
            .then((res) => setProduit(res.data))
            .catch(() => {});
    }, [id]);

    const [produitIndisponible, setProduitIndisponible] = useState(false);

    useEffect(() => {
        if (!produit?.id) return;

        axios
            .get(`http://localhost:8081/api/demmandechange/valide/produit/${produit.id}`)
            .then(res => {
                // Si demande validée existe et que ce n’est pas le propriétaire
                if (res.data && produit.utilisateurId !== user?.id) {
                    setProduitIndisponible(true);
                } else {
                    setProduitIndisponible(false);
                }
            })
            .catch(() => setProduitIndisponible(false));
    }, [produit, user]);

    // Charger les demandes validées pour ce produit et cet utilisateur
    useEffect(() => {
        const fetchDemandesValides = async () => {
            if (!user?.id || !produit?.id) return;

            try {
                const res = await axios.get(
                    `http://localhost:8081/api/demmandechange/valide/utilisateur/${user.id}/produit/${produit.id}`
                );

                const demandeValide = res.data.find((d) => d.statut === "valide");
                setDemandeValideExiste(!!demandeValide);
                setEstDemandeur(!!demandeValide);
            } catch {
                setDemandeValideExiste(false);
                setEstDemandeur(false);
            }
        };

        fetchDemandesValides();
    }, [user, produit]);

    // Trier les évaluations par date décroissante
    const evaluationsTriees = useMemo(() => {
        return [...evaluations].sort((a, b) => new Date(b.dateEvaluation) - new Date(a.dateEvaluation));
    }, [evaluations]);

    // Récupérer évaluations et vérifier si utilisateur a déjà noté
    const fetchEvaluations = async (userId) => {
        try {
            const resEval = await axios.get(`http://localhost:8081/api/evaluation/utilisateur/${userId}`);
            setEvaluations(resEval.data);

            const dejaNote = resEval.data.some(
                (e) => e.utilisateurNoteurId === user?.id && e.produitId === produit?.id
            );
            setADejaNote(dejaNote);
        } catch {}
    };

    // Ouvrir modal utilisateur et charger évaluations
    const openUserModal = async (userId) => {
        try {
            const resUser = await axios.get(`http://localhost:8081/api/utilisateur/${userId}`);
            setUserDetails(resUser.data);

            await fetchEvaluations(userId);

            setNoteValeur(0);
            setNoteCommentaire("");
            setNoteEnvoye(false);
            setShowAllEvaluations(false);
            setShowUserModal(true);
        } catch {}
    };

    // Afficher formulaire message de demande don/échange
    const handleConfirmerClick = () => {
        setShowMessageForm(true);
        setMessage(produit.statut === "donner" ? "Je souhaite recevoir ce donne." : "Je souhaite échanger ce produit.");
        setErreurMessage("");
        setErreurImage("");
    };

    // Envoyer la demande don/échange
    const handleEnvoyerDemande = async () => {
        setErreurMessage("");
        setErreurImage("");

        if (!user?.id || message.trim() === "") {
            setErreurMessage("Veuillez vous connecter et écrire un message.");
            return;
        }

        if (produit.statut === "changer" && !preuveImage) {
            setErreurImage("Veuillez téléverser une image du produit à échanger.");
            return;
        }

        try {
            const resDemande = await axios.post("http://localhost:8081/api/demmandechange/ajouter", {
                dateDE: new Date().toISOString().split("T")[0],
                statut: "en attente",
                message,
                utilisateurId: user.id,
                produitId: produit.id,
            });

            const demandeCreee = resDemande.data;

            if (produit.statut === "changer" && preuveImage) {
                const formData = new FormData();
                formData.append("imageEchange", preuveImage);
                formData.append("utilisateurId", user.id);
                formData.append("produitId", produit.id);
                formData.append("demmandechangeId", demandeCreee.id);

                await axios.post("http://localhost:8081/api/echange/image", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            setShowMessageForm(false);
            setMessage("");
            setPreuveImage(null);

            // Après envoi, on remet à jour l’état
            setDemandeValideExiste(false);
            navigate(-1);
        } catch {
            setErreurMessage("Une erreur est survenue lors de la demande.");
        }
    };

    // Supprimer le produit
    const handleSupprimer = () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            axios
                .delete(`http://localhost:8081/api/produit/delete/${produit.id}`)
                .then(() => navigate(-1))
                .catch(() => {});
        }
    };

    // Envoyer une note/évaluation
    const handleEnvoyerNote = async () => {
        if (!user?.id || noteValeur === 0) return;

        try {
            await axios.post("http://localhost:8081/api/evaluation/ajouter", {
                note: noteValeur,
                commentaire: noteCommentaire,
                utilisateurNoteurId: user.id,
                utilisateurNoteeId: userDetails.id,
                produitId: produit.id,
            });

            setNoteEnvoye(true);
            setNoteValeur(0);
            setNoteCommentaire("");

            await fetchEvaluations(userDetails.id);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setADejaNote(true);
            }
        }
    };

    // Calcul note moyenne
    const noteMoyenne = useMemo(() => {
        if (evaluations.length === 0) return null;
        const somme = evaluations.reduce((acc, e) => acc + e.note, 0);
        return somme / evaluations.length;
    }, [evaluations]);

    if (!produit) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
                Chargement du produit...
            </div>
        );
    }

    return (
        <>
            <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <img
                        src={`data:image/jpeg;base64,${produit.photo}`}
                        alt={produit.titre}
                        className="w-full h-96 object-cover rounded-2xl border border-gray-300 shadow-sm"
                    />
                    <div>
                        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">{produit.titre}</h1>
                        <p className="text-gray-700 mb-8 text-lg">{produit.description}</p>

                        <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                            <FaTag className="text-blue-600" />
                            Catégorie : <strong>{produit.categorie}</strong>
                        </div>
                        <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                            <FaCheckCircle className="text-green-600" />
                            Statut : <strong>{produit.statut}</strong>
                        </div>
                        <div className="text-sm text-gray-600 mb-6">
                            Publié par:{" "}
                            <span
                                onClick={() => openUserModal(produit.utilisateurId)}
                                className="text-blue-600 cursor-pointer hover:underline"
                            >
                {produit.utilisateur?.prenom || "Utilisateur inconnu"}
              </span>
                        </div>

                        {/* Gestion bouton / message selon statut et demande valide */}
                        {produit.utilisateurId !== user?.id && !showMessageForm && (
                            produitIndisponible ? (
                                <p className="p-4 bg-red-100 text-red-800 rounded-xl font-semibold text-center">
                                    Ce produit a déjà été {produit.statut === "donner" ? "donné" : "échangé"}.
                                </p>
                            ) : (
                                <button
                                    onClick={handleConfirmerClick}
                                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl"
                                >
                                    {produit.statut === "donner" ? "Confirmer le donne" : "Confirmer l'échange"}
                                </button>
                            )
                        )}


                        {/* Formulaire demande */}
                        {showMessageForm && (
                            <>
                <textarea
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        setErreurMessage("");
                    }}
                    className={`w-full border rounded-xl p-4 mt-4 ${erreurMessage ? "border-red-500" : ""}`}
                    rows={5}
                    placeholder="Écrivez votre message ici..."
                />
                                {erreurMessage && <p className="text-red-500 text-sm mt-2">{erreurMessage}</p>}

                                {produit.statut === "changer" && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Téléversez une image du produit que vous proposez en échange :
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                setPreuveImage(e.target.files[0]);
                                                setErreurImage("");
                                            }}
                                            className="w-full border p-2 rounded-lg"
                                        />
                                        {erreurImage && <p className="text-red-500 mt-1 text-sm">{erreurImage}</p>}
                                    </div>
                                )}

                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => {
                                            setShowMessageForm(false);
                                            setErreurMessage("");
                                            setErreurImage("");
                                        }}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleEnvoyerDemande}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                                    >
                                        Envoyer la demande
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Boutons modifier / supprimer pour propriétaire */}
                        {produit.utilisateurId === user?.id && (
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => navigate(`/Produit_modifier/${produit.id}`)}
                                    className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={handleSupprimer}
                                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
                                >
                                    Supprimer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal utilisateur */}
            {showUserModal && userDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full relative overflow-auto max-h-[90vh] shadow-lg">
                        <button
                            onClick={() => {
                                setShowUserModal(false);
                                setNoteValeur(0);
                                setNoteCommentaire("");
                                setNoteEnvoye(false);
                                setEvaluations([]);
                                setADejaNote(false);
                            }}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            aria-label="Fermer la modal"
                        >
                            &times;
                        </button>
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Profil de {userDetails.prenom}</h2>
                        <p className="mb-3 text-gray-800">
                            <strong>Prénom :</strong> {userDetails.prenom}
                        </p>
                        <p className="mb-3 text-gray-800">
                            <strong>Téléphone :</strong> {userDetails.telephone || "Non renseigné"}
                        </p>
                        <p className="mb-6 text-gray-800 flex items-center gap-2">
                            <strong>Note moyenne :</strong>{" "}
                            {noteMoyenne !== null ? <Etoiles note={noteMoyenne || 0} /> : "Aucune"}
                        </p>

                        <div className="mt-4">
                            <h3 className="text-xl font-semibold mb-4">Évaluations</h3>
                            {evaluationsTriees.length === 0 ? (
                                <p className="text-gray-600">Aucune évaluation.</p>
                            ) : (
                                <ListeEvaluations
                                    evaluations={evaluationsTriees}
                                    showAll={showAllEvaluations}
                                    toggleShowAll={() => setShowAllEvaluations(!showAllEvaluations)}
                                />
                            )}
                        </div>

                        <div className="mt-8 border-t pt-6">
                            <h3 className="text-xl font-semibold mb-4">Laissez une note</h3>
                            {aDejaNote ? (
                                <p className="text-red-600 font-medium">Vous avez déjà noté ce produit.</p>
                            ) : noteEnvoye ? (
                                <p className="text-green-600 font-medium">Merci pour votre note !</p>
                            ) : (
                                <>
                                    <div
                                        className="flex space-x-2 mb-4 justify-center"
                                        role="radiogroup"
                                        aria-label="Choisir une note"
                                    >
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setNoteValeur(star)}
                                                className={`focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded transition-colors ${
                                                    noteValeur >= star ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"
                                                }`}
                                                aria-checked={noteValeur === star}
                                                role="radio"
                                                tabIndex={0}
                                                aria-label={`${star} étoiles`}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") setNoteValeur(star);
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    stroke="none"
                                                    className="w-10 h-10"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.947c.3.922-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.196-1.539-1.118l1.287-3.947a1 1 0 00-.364-1.118L2.025 9.373c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.946z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={noteCommentaire}
                                        onChange={(e) => setNoteCommentaire(e.target.value)}
                                        placeholder="Laissez un commentaire (optionnel)"
                                        className="w-full p-3 border rounded-xl resize-none"
                                        rows={3}
                                    />
                                    <button
                                        onClick={handleEnvoyerNote}
                                        className="mt-4 w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl"
                                    >
                                        Envoyer la note
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Produit_detail;
