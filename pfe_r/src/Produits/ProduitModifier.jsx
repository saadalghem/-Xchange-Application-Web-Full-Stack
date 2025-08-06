import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ProduitModifier() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [produit, setProduit] = useState({
        titre: "",
        description: "",
        statut: "donner",
        categorie: "",
        localisation: "",
        photo: null,
    });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erreurs, setErreurs] = useState({});  // state pour erreurs

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/produit/${id}`)
            .then((res) => {
                const p = res.data;
                setProduit({
                    titre: p.titre || "",
                    description: p.description || "",
                    statut: p.statut || "donner",
                    categorie: p.categorie || "",
                    localisation: p.localisation || "",
                    photo: p.photo || null,
                });
                if (p.photo) {
                    setPhotoPreview(`data:image/jpeg;base64,${p.photo}`);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur chargement produit :", err);
                setErreurs({ general: "Erreur lors du chargement du produit." });
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduit((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1];
                setProduit((prev) => ({ ...prev, photo: base64String }));
                setPhotoPreview(reader.result);
            };
            reader.onerror = () => {
                setErreurs({ ...erreurs, photo: "Erreur lors du chargement de la photo." });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const nouvellesErreurs = {};

        if (!produit.titre) nouvellesErreurs.titre = "Veuillez remplir le titre.";
        if (!produit.description) nouvellesErreurs.description = "Veuillez remplir la description.";
        if (!produit.categorie) nouvellesErreurs.categorie = "Veuillez choisir une catégorie.";
        if (!produit.localisation) nouvellesErreurs.localisation = "Veuillez choisir une localisation.";

        if (Object.keys(nouvellesErreurs).length > 0) {
            setErreurs(nouvellesErreurs);
            return;
        }

        setErreurs({});

        axios
            .put(`http://localhost:8081/api/produit/update/${id}`, produit)
            .then(() => {
                navigate(`/produit_user`);
            })
            .catch((err) => {
                console.error("Erreur lors de la mise à jour :", err);
                setErreurs({ general: "Erreur lors de la mise à jour du produit." });
            });
    };

    if (loading) {
        return <div className="text-center p-8 text-gray-600">Chargement...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-10 mt-12 bg-white rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-8 tracking-wide">
                Modifier le produit
            </h2>

            {erreurs.general && (
                <div className="mb-6 text-red-600 font-semibold text-center">
                    {erreurs.general}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-7" noValidate>
                <div>
                    <label className="block mb-1 font-semibold" htmlFor="photo">Photo</label>
                    <input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                            erreurs.photo ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-400"
                        }`}
                    />
                    {erreurs.photo && <p className="text-red-500 text-sm mt-1">{erreurs.photo}</p>}
                    {photoPreview && (
                        <img
                            src={photoPreview}
                            alt="Aperçu"
                            className="mt-4 max-h-64 rounded-2xl border border-gray-300 shadow-md"
                        />
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-semibold" htmlFor="titre">Titre *</label>
                    <input
                        id="titre"
                        name="titre"
                        type="text"
                        value={produit.titre}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 ${
                            erreurs.titre ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                        }`}
                    />
                    {erreurs.titre && <p className="text-red-500 text-sm mt-1">{erreurs.titre}</p>}
                </div>

                <div>
                    <label className="block mb-1 font-semibold" htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={produit.description}
                        onChange={handleChange}
                        rows={5}
                        className={`w-full px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 ${
                            erreurs.description ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                        }`}
                    />
                    {erreurs.description && <p className="text-red-500 text-sm mt-1">{erreurs.description}</p>}
                </div>

                <div>
                    <label className="block mb-1 font-semibold" htmlFor="categorie">Catégorie *</label>
                    <select
                        id="categorie"
                        name="categorie"
                        value={produit.categorie}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 ${
                            erreurs.categorie ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                        }`}
                    >
                        <option value="">-- Choisir une catégorie --</option>
                        <option value="electronique">Électronique</option>
                        <option value="vetement">Vêtement</option>
                        <option value="livre">Livre</option>
                        <option value="Autre">Autre</option>
                    </select>
                    {erreurs.categorie && <p className="text-red-500 text-sm mt-1">{erreurs.categorie}</p>}
                </div>

                <div>
                    <label className="block mb-1 font-semibold" htmlFor="localisation">Localisation *</label>
                    <select
                        id="localisation"
                        name="localisation"
                        value={produit.localisation}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 ${
                            erreurs.localisation ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                        }`}
                    >
                        <option value="">-- Choisir une ville --</option>
                        <option value="Casablanca">Casablanca</option>
                        <option value="Rabat">Rabat</option>
                        <option value="Fès">Fès</option>
                        <option value="Marrakech">Marrakech</option>
                        <option value="Tanger">Tanger</option>
                        <option value="Agadir">Agadir</option>
                        <option value="Meknès">Meknès</option>
                        <option value="Oujda">Oujda</option>
                        <option value="Tétouan">Tétouan</option>
                        <option value="Safi">Safi</option>
                        <option value="Khouribga">Khouribga</option>
                        <option value="El Jadida">El Jadida</option>
                        <option value="Nador">Nador</option>
                        <option value="Beni Mellal">Beni Mellal</option>
                        <option value="Taza">Taza</option>
                        <option value="Khénifra">Khénifra</option>
                        <option value="Errachidia">Errachidia</option>
                        <option value="Laâyoune">Laâyoune</option>
                        <option value="Guelmim">Guelmim</option>
                        <option value="Al Hoceïma">Al Hoceïma</option>
                        <option value="Settat">Settat</option>
                        <option value="Kénitra">Kénitra</option>
                        <option value="Essaouira">Essaouira</option>
                        <option value="Larache">Larache</option>
                        <option value="Berrechid">Berrechid</option>
                        <option value="Salé">Salé</option>
                        <option value="Inezgane">Inezgane</option>
                        <option value="Ouarzazate">Ouarzazate</option>
                        <option value="Azrou">Azrou</option>
                        <option value="Autre">Autre</option>
                    </select>
                    {erreurs.localisation && <p className="text-red-500 text-sm mt-1">{erreurs.localisation}</p>}
                </div>

                <div>
                    <label className="block mb-1 font-semibold" htmlFor="statut">Statut *</label>
                    <select
                        id="statut"
                        name="statut"
                        value={produit.statut}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="donner">À donner</option>
                        <option value="changer">À échanger</option>
                    </select>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg shadow transition"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold rounded-lg shadow hover:from-purple-600 hover:to-purple-800 transition"
                    >
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProduitModifier;
