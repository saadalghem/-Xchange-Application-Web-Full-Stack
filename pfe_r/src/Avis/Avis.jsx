import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

function InitialeUtilisateur({ prenom }) {
    const initiale = prenom ? prenom.charAt(0).toUpperCase() : "?";

    return (
        <div
            className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-md select-none"
            aria-label={`Initiale de ${prenom || "Utilisateur"}`}
            title={prenom || "Utilisateur"}
        >
            {initiale}
        </div>
    );
}

function Avis() {
    const [evaluations, setEvaluations] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [note, setNote] = useState(0);
    const [commentaire, setCommentaire] = useState("");
    const [loading, setLoading] = useState(true);

    // Nouvel état pour le message d'erreur
    const [errorMsg, setErrorMsg] = useState("");

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

    const handleStarClick = (star) => setNote(star);

    const handleSubmit = () => {
        setErrorMsg(""); // Reset erreur avant validation

        if (note === 0 || commentaire.trim() === "") {
            setErrorMsg("Merci de remplir tous les champs et donner une note.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
            setErrorMsg("Vous devez être connecté pour donner un avis.");
            return;
        }

        axios
            .post("http://localhost:8081/avis/add", {
                contenu: commentaire,
                note_app: note,
                utilisateurId: user.id,
            })
            .then((res) => {
                setEvaluations([res.data, ...evaluations]);
                setNote(0);
                setCommentaire("");
                setShowForm(false);
                setErrorMsg("");
            })
            .catch((err) => {
                setErrorMsg("Erreur lors de l'envoi de l'avis.");
                console.error(err);
            });
    };

    return (
        <section className="bg-gray-900 text-white py-12 px-8 max-w-4xl mx-auto rounded-lg shadow-lg">
            <h2 className="text-4xl font-extrabold text-center mb-10 relative inline-block">
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
                <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700">
                    {evaluations.map((evalItem) => (
                        <div
                            key={evalItem.id}
                            className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 flex space-x-6 hover:scale-[1.02] transition-transform duration-300"
                        >
                            {evalItem.utilisateur?.photoUrl ? (
                                <img
                                    src={evalItem.utilisateur.photoUrl}
                                    alt={evalItem.utilisateur.prenom || "Utilisateur"}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-600 shadow-md"
                                />
                            ) : (
                                <InitialeUtilisateur prenom={evalItem.utilisateur?.prenom} />
                            )}

                            <div className="flex flex-col justify-between flex-1">
                                <p className="text-purple-400 font-semibold mb-2 text-xl drop-shadow-lg">
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
                                                    i < evalItem.note_app
                                                        ? "text-yellow-400 drop-shadow"
                                                        : "text-gray-600"
                                                }
                                                size={20}
                                            />
                                        ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="text-center mt-14">
                {!showForm ? (
                    <button
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
              text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
                        onClick={() => setShowForm(true)}
                    >
                        Donner un avis
                    </button>
                ) : (
                    <div className="max-w-md mx-auto mt-8 bg-gray-800 p-8 rounded-3xl shadow-2xl text-black">
                        <h3 className="text-white text-3xl mb-6 font-bold tracking-wide">
                            Donnez votre avis
                        </h3>

                        <div className="flex mb-6 justify-center space-x-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className={`cursor-pointer transition-colors duration-200 ${
                                        note >= star
                                            ? "text-yellow-400 drop-shadow-lg"
                                            : "text-gray-400 hover:text-yellow-400"
                                    }`}
                                    onClick={() => handleStarClick(star)}
                                    size={36}
                                    aria-label={`Donner ${star} étoiles`}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") handleStarClick(star);
                                    }}
                                />
                            ))}
                        </div>

                        {/* Affichage du message d'erreur sous le textarea */}
                        {errorMsg && (
                            <p className="text-red-500 mb-4 font-semibold" role="alert">
                                {errorMsg}
                            </p>
                        )}

                        <textarea
                            placeholder="Votre commentaire..."
                            value={commentaire}
                            onChange={(e) => setCommentaire(e.target.value)}
                            className="w-full p-3 mb-6 rounded-xl text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600 notee"
                            rows={5}
                            spellCheck="true"
                            aria-label="Commentaire"
                            style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
                        />

                        <div className="flex justify-between">
                            <button
                                onClick={handleSubmit}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-shadow"
                            >
                                Envoyer
                            </button>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setErrorMsg("");
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-shadow"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Avis;
