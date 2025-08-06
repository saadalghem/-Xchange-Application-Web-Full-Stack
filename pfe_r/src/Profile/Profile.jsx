import React, { useEffect, useState } from 'react';
import Header_login from "../HEADER/Header_login.jsx";
import Footer from "../Footer/Footer.jsx";
import axios from 'axios';
import { FaUserEdit, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Profile() {
    const [utilisateur, setUtilisateur] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [errors, setErrors] = useState({});       // erreurs par champ
    const [generalError, setGeneralError] = useState(""); // erreur générale

    useEffect(() => {
        async function fetchUser() {
            const userData = localStorage.getItem("user");
            if (userData) {
                const parsed = JSON.parse(userData);
                setUtilisateur(parsed);
                setEditedData(parsed);
            }
        }
        fetchUser();
    }, []);

    const handleEditChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // reset erreur du champ modifié
        setGeneralError("");
    };

    const handleSave = async () => {
        let validationErrors = {};
        if (!editedData.nom || editedData.nom.trim() === "") validationErrors.nom = "Le nom est obligatoire.";
        if (!editedData.prenom || editedData.prenom.trim() === "") validationErrors.prenom = "Le prénom est obligatoire.";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8081/api/utilisateur/${utilisateur.id}`, editedData);
            setUtilisateur(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
            setShowEdit(false);
            setErrors({});
            setGeneralError("");
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            setGeneralError("Échec de la mise à jour du profil.");
        }
    };

    const handleSupprimerCompte = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.")) {
            try {
                setLoadingDelete(true);
                await axios.delete(`http://localhost:8081/api/utilisateur/delete/${utilisateur.id}`, {
                    headers: { "user-id": utilisateur.id }
                });
                localStorage.removeItem("user");
                window.location.href = "/";
            } catch (error) {
                console.error("Erreur lors de la suppression du compte :", error);
                setGeneralError(error.response?.data || "Échec de la suppression du compte.");
            } finally {
                setLoadingDelete(false);
            }
        }
    };

    if (!utilisateur) {
        return (
            <>
                <Header_login />
                <div className="min-h-screen flex justify-center items-center bg-gray-100">
                    <span className="text-gray-600 text-xl">Chargement...</span>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header_login />
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex justify-center items-center py-12 px-4">
                <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-4xl flex flex-col md:flex-row items-center gap-10">
                    <div className="relative flex flex-col items-center">
                        {utilisateur.photo ? (
                            <img
                                src={utilisateur.photo}
                                alt="Profil"
                                className="w-40 h-40 rounded-full object-cover shadow-lg"
                            />
                        ) : (
                            <div className="w-40 h-40 rounded-full bg-purple-600 text-white flex items-center justify-center text-6xl font-bold shadow-lg">
                                {utilisateur.prenom ? utilisateur.prenom.charAt(0).toUpperCase() : "S"}
                            </div>
                        )}
                        <button
                            onClick={() => setShowEdit(true)}
                            className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
                            aria-label="Modifier profil"
                        >
                            <FaUserEdit className="text-purple-600 text-xl" />
                        </button>
                    </div>
                    <div className="flex-1 text-left">
                        <h1 className="text-3xl font-bold text-purple-700 mb-6">Mon Profil</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-md">
                            <p><span className="font-semibold">Nom:</span> {utilisateur.nom}</p>
                            <p><span className="font-semibold">Prénom:</span> {utilisateur.prenom}</p>
                            <p className="flex items-center gap-2"><FaEnvelope className="text-purple-500" /> {utilisateur.email}</p>
                            <p className="flex items-center gap-2"><FaPhoneAlt className="text-purple-500" /> {utilisateur.telephone || '-'}</p>
                            <p className="flex items-center gap-2 col-span-2"><FaMapMarkerAlt className="text-purple-500" /> {utilisateur.adress || '-'}</p>
                        </div>
                        <button
                            onClick={() => setShowEdit(true)}
                            className="mt-8 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl font-semibold shadow hover:scale-105 transition"
                        >
                            Modifier les informations
                        </button>
                        <button
                            onClick={handleSupprimerCompte}
                            disabled={loadingDelete}
                            className={`mt-4 px-6 py-2 rounded-xl font-semibold shadow transition 
                ${loadingDelete ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 text-white hover:scale-105'}`}
                        >
                            {loadingDelete ? "Suppression en cours..." : "Supprimer mon compte"}
                        </button>

                        {generalError && (
                            <p className="mt-4 text-red-600 font-semibold">{generalError}</p>
                        )}
                    </div>
                </div>
            </div>

            {showEdit && (
                <div className="fixed inset-0 bg-gradient-to-br from-purple-200 via-blue-100 to-white bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-gray-200">
                        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Modifier le profil</h2>
                        {generalError && (
                            <p className="mb-4 text-red-600 font-semibold text-center">{generalError}</p>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-600 mb-1">Nom</label>
                                <input
                                    name="nom"
                                    value={editedData.nom || ''}
                                    onChange={handleEditChange}
                                    placeholder="Nom"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                        errors.nom ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                                    }`}
                                />
                                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Prénom</label>
                                <input
                                    name="prenom"
                                    value={editedData.prenom || ''}
                                    onChange={handleEditChange}
                                    placeholder="Prénom"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                        errors.prenom ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                                    }`}
                                />
                                {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    readOnly
                                    value={editedData.email || ''}
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Téléphone</label>
                                <input
                                    name="telephone"
                                    value={editedData.telephone || ''}
                                    onChange={handleEditChange}
                                    placeholder="Téléphone"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Adresse</label>
                                <input
                                    name="adress"
                                    value={editedData.adress || ''}
                                    onChange={handleEditChange}
                                    placeholder="Adresse"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => { setShowEdit(false); setErrors({}); setGeneralError(""); }}
                                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default Profile;
