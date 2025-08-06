import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddUser() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adress: "",
        motdepasse: "",
        etat_user: "USER",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        if (!user.nom.trim()) newErrors.nom = "Le nom est requis.";
        if (!user.prenom.trim()) newErrors.prenom = "Le prénom est requis.";
        if (!user.email.trim()) newErrors.email = "L'email est requis.";
        if (!user.motdepasse.trim()) newErrors.motdepasse = "Le mot de passe est requis.";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        axios
            .post("http://localhost:8081/api/utilisateur/signup", user)
            .then(() => {
                navigate("/users");
            })
            .catch((err) => {
                const message = err.response?.data?.message?.toLowerCase() || "";

                if (message.includes("email")) {
                    setErrors((prev) => ({ ...prev, email: "Cet email est déjà utilisé." }));
                } else if (message.includes("mot de passe")) {
                    setErrors((prev) => ({ ...prev, motdepasse: "Le mot de passe est invalide." }));
                } else {
                    setErrors((prev) => ({ ...prev, global: "Une erreur est survenue lors de l'ajout." }));
                }
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center px-4 py-10 font-sans">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10">
                <h2 className="text-4xl font-extrabold text-center text-green-600 mb-6">
                    ➕ Ajouter un utilisateur
                </h2>

                {errors.global && (
                    <div className="mb-6 text-red-600 bg-red-100 border border-red-300 p-4 rounded-xl text-center">
                        {errors.global}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Nom</label>
                        <input
                            type="text"
                            name="nom"
                            value={user.nom}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${errors.nom ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                    </div>

                    {/* Prénom */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Prénom</label>
                        <input
                            type="text"
                            name="prenom"
                            value={user.prenom}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${errors.prenom ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Téléphone */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Téléphone</label>
                        <input
                            type="text"
                            name="telephone"
                            value={user.telephone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Adresse */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Adresse</label>
                        <input
                            type="text"
                            name="adress"
                            value={user.adress}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {/* Mot de passe */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Mot de passe</label>
                        <input
                            type="password"
                            name="motdepasse"
                            value={user.motdepasse}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${errors.motdepasse ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-green-500`}
                        />
                        {errors.motdepasse && <p className="text-red-500 text-sm mt-1">{errors.motdepasse}</p>}
                    </div>

                    {/* Statut */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Statut</label>
                        <select
                            name="etat_user"
                            value={user.etat_user}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="USER">👤 Utilisateur</option>
                            <option value="ADMIN">🛡️ Administrateur</option>
                        </select>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-between pt-6">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md"
                        >
                            💾 Enregistrer
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/users")}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-3 rounded-xl shadow-md"
                        >
                            ❌ Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUser;
