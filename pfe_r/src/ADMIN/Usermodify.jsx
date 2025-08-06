import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Usermodify() {
    const { id } = useParams();
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

    // Pour afficher un message d’erreur ou de succès
    const [alert, setAlert] = useState({ type: "", message: "" });

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/utilisateur/${id}`)
            .then((res) => setUser(res.data))
            .catch(() =>
                setAlert({
                    type: "error",
                    message: "Erreur lors du chargement de l'utilisateur.",
                })
            );
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
        // Clear alert on input change
        if (alert.message) setAlert({ type: "", message: "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .put(`http://localhost:8081/api/utilisateur/${id}`, user)
            .then(() => {
                setAlert({
                    type: "success",
                    message: "✅ Utilisateur modifié avec succès !",
                });
                // Redirection avec délai pour que l'utilisateur voie le message
                setTimeout(() => navigate("/users"), 1500);
            })
            .catch(() =>
                setAlert({
                    type: "error",
                    message: "❌ Une erreur est survenue lors de la mise à jour.",
                })
            );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-10">
                    🛠 Modifier l'utilisateur
                </h2>

                {/* Alert */}
                {alert.message && (
                    <div
                        className={`mb-6 rounded-xl p-4 text-center font-semibold ${
                            alert.type === "error"
                                ? "bg-red-100 text-red-700 border border-red-300"
                                : "bg-green-100 text-green-700 border border-green-300"
                        }`}
                    >
                        {alert.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Nom</label>
                        <input
                            type="text"
                            name="nom"
                            value={user.nom}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Prénom</label>
                        <input
                            type="text"
                            name="prenom"
                            value={user.prenom}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            readOnly
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Téléphone</label>
                        <input
                            type="text"
                            name="telephone"
                            value={user.telephone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">adress</label>
                        <input
                            type="text"
                            name="adress"
                            value={user.adress}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Mot de passe</label>
                        <input
                            type="password"
                            name="motdepasse"
                            value={user.motdepasse}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Statut</label>
                        <select
                            name="etat_user"
                            value={user.etat_user}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-sm"
                        >
                            <option value="USER">👤 User</option>
                            <option value="ADMIN">🛡️ Admin</option>
                        </select>
                    </div>

                    <div className="flex justify-between pt-6">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
                        >
                            💾 Enregistrer
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/users")}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
                        >
                            ❌ Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Usermodify;
