import Footer from "../Footer/Footer.jsx";
import { useState } from "react";
import axios from "axios";
import Produit_changer from "../Produits/changer/Produit_changer.jsx";
import Header_login from "../HEADER/Header_login.jsx";

function Obj_changer_login() {
    const [showForm, setShowForm] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [titre, settitre] = useState("");
    const [description, setDescription] = useState("");
    const [categorie, setCategorie] = useState("");
    const [showCategories, setShowCategories] = useState(false);
    const [localisation, setLocalisation] = useState("");
    const [errors, setErrors] = useState({});

    const categories = [
        { value: "electronique", label: "Électronique" },
        { value: "vetement", label: "Vêtement" },
        { value: "livre", label: "Livre" },
        { value: "Maison", label: "Maison" },
        { value: "Autre", label: "Autre" }
    ];

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
        setErrors({ ...errors, photo: undefined });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        let newErrors = {};

        if (!photo) newErrors.photo = "Photo is required";
        if (!titre) newErrors.titre = "Title is required";
        if (!description) newErrors.description = "Description is required";
        if (!localisation) newErrors.localisation = "Location is required";
        if (!categorie) newErrors.categorie = "Category is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        const formData = new FormData();
        formData.append("photo", photo);
        formData.append("titre", titre);
        formData.append("description", description);
        formData.append("categorie", categorie);
        formData.append("localisation", localisation);
        formData.append("statut", "changer");
        formData.append("utilisateur_id", user.id);

        try {
            await axios.post("http://localhost:8081/api/produit/produit", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setShowForm(false);
            setPhoto(null);
            settitre("");
            setDescription("");
            setCategorie("");
            setLocalisation("");
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors({ general: error.response.data });
            } else if (error.request) {
                setErrors({ general: "No response from server" });
            } else {
                setErrors({ general: error.message });
            }
        }
    };

    return (
        <>
            <Header_login/>
            <div className="flex flex-col items-center mt-8">
                <button
                    type="button"
                    className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-green-700 transition mb-6"
                    onClick={() => setShowForm(true)}
                >
                    changer un objet
                </button>
                <div className="relative">
                    {showCategories && (
                        <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                            <ul>
                                {categories.map((cat) => (
                                    <li
                                        key={cat.value}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setCategorie(cat.value);
                                            setShowCategories(false);
                                            setShowForm(true);
                                        }}
                                    >
                                        {cat.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                {showForm && (
                    <form
                        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
                        onSubmit={handleSubmit}
                    >
                        {errors.general && (
                            <div className="text-red-500 text-center mb-2">{errors.general}</div>
                        )}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Photo:</label>
                            <input
                                type="file"
                                name="photo"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className={`w-full border-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.photo ? "border-red-500" : "border-gray-300"}`}
                                required
                            />
                            {errors.photo && (
                                <span className="text-red-500 text-sm mt-1 block">{errors.photo}</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Nom de l'objet:</label>
                            <input
                                type="text"
                                name="titre"
                                value={titre}
                                onChange={e => {
                                    settitre(e.target.value);
                                    setErrors({ ...errors, titre: undefined });
                                }}
                                required
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.titre ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.titre && (
                                <span className="text-red-500 text-sm mt-1 block">{errors.titre}</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Description:</label>
                            <textarea
                                name="description"
                                value={description}
                                onChange={e => {
                                    setDescription(e.target.value);
                                    setErrors({ ...errors, description: undefined });
                                }}
                                required
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.description ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.description && (
                                <span className="text-red-500 text-sm mt-1 block">{errors.description}</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Localisation:</label>
                            <select
                                name="localisation"
                                value={localisation}
                                onChange={e => {
                                    setLocalisation(e.target.value);
                                    setErrors({ ...errors, localisation: undefined });
                                }}
                                required
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.localisation ? "border-red-500" : "border-gray-300"}`}
                            >
                                <option value="">Choisir une ville</option>
                                <option value="Casablanca">Casablanca</option>
                                <option value="Rabat">Rabat</option>
                                <option value="Fès">Fès</option>
                                <option value="Marrakech">Marrakech</option>
                                <option value="Tanger">Tanger</option>
                                <option value="Agadir">Agadir</option>
                                <option value="Meknès">Meknès</option>
                                <option value="Oujda">Oujda</option>
                                <option value="Kenitra">Kenitra</option>
                                <option value="Tétouan">Tétouan</option>
                                <option value="Safi">Safi</option>
                                <option value="Khouribga">Khouribga</option>
                                <option value="El Jadida">El Jadida</option>
                                <option value="Beni Mellal">Beni Mellal</option>
                                <option value="Nador">Nador</option>
                                <option value="Taza">Taza</option>
                                <option value="Settat">Settat</option>
                                <option value="Berrechid">Berrechid</option>
                                <option value="Khemisset">Khemisset</option>
                                <option value="Inezgane">Inezgane</option>
                                <option value="Ksar El Kebir">Ksar El Kebir</option>
                                <option value="Larache">Larache</option>
                                <option value="Guelmim">Guelmim</option>
                                <option value="Khenifra">Khenifra</option>
                                <option value="Al Hoceima">Al Hoceima</option>
                                <option value="Ouarzazate">Ouarzazate</option>
                                <option value="Berkane">Berkane</option>
                                <option value="Taourirt">Taourirt</option>
                                <option value="Bouskoura">Bouskoura</option>
                                <option value="Fquih Ben Salah">Fquih Ben Salah</option>
                                <option value="Dcheira El Jihadia">Dcheira El Jihadia</option>
                                <option value="Mohammedia">Mohammedia</option>
                                <option value="Sidi Slimane">Sidi Slimane</option>
                                <option value="Errachidia">Errachidia</option>
                                <option value="Guercif">Guercif</option>
                                <option value="Oulad Teima">Oulad Teima</option>
                                <option value="Ben Guerir">Ben Guerir</option>
                                <option value="Sidi Kacem">Sidi Kacem</option>
                                <option value="Taroudant">Taroudant</option>
                                <option value="Tiflet">Tiflet</option>
                                <option value="Essaouira">Essaouira</option>
                                <option value="Sefrou">Sefrou</option>
                                <option value="Youssoufia">Youssoufia</option>
                                <option value="Martil">Martil</option>
                                <option value="Ait Melloul">Ait Melloul</option>
                                <option value="Azrou">Azrou</option>
                                <option value="Dakhla">Dakhla</option>
                                <option value="Midelt">Midelt</option>
                                <option value="Azilal">Azilal</option>
                                {/* ...options... */}
                            </select>
                            {errors.localisation && (
                                <span className="text-red-500 text-sm mt-1 block">{errors.localisation}</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Catégorie:</label>
                            <select
                                name="categorie"
                                value={categorie}
                                onChange={e => {
                                    setCategorie(e.target.value);
                                    setErrors({ ...errors, categorie: undefined });
                                }}
                                required
                                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.categorie ? "border-red-500" : "border-gray-300"}`}
                            >
                                <option value="">Choisir une catégorie</option>
                                <option value="electronique">Électronique</option>
                                <option value="vetement">Vêtement</option>
                                <option value="livre">Livre</option>
                                <option value="Maison">Maison</option>
                                <option value="Autre">Autre</option>
                            </select>
                            {errors.categorie && (
                                <span className="text-red-500 text-sm mt-1 block">{errors.categorie}</span>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Envoyer
                        </button>
                    </form>
                )}
            </div>
            <Produit_changer />
            <Footer/>
        </>
    );
}

export default Obj_changer_login;