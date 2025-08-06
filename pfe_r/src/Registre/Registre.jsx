import React, { useState } from 'react';
import axios from 'axios';
import { FaLock, FaPhone, FaMapMarkerAlt, FaUser, FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa';
import Footer from "../Footer/Footer.jsx";
import Header from "../HEADER/Header.jsx";
import Xchange from "../assets/Xchange-removebg-preview.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

function Registre() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        adress: '',
        telephone: '',
        email: '',
        motdepasse: '',
        confirmmotdepasse: '',
        etat_user:'USER'
    });

    const [showmotdepasse, setShowmotdepasse] = useState(false);
    const [showConfirmmotdepasse, setShowConfirmmotdepasse] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: undefined,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!formData.nom) newErrors.nom = "Name is required";
        if (!formData.prenom) newErrors.prenom = "Surname is required";
        if (!formData.adress) newErrors.adress = "Address is required";
        if (!formData.telephone) newErrors.telephone = "Phone is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.motdepasse) newErrors.motdepasse = "Password is required";
        if (!formData.confirmmotdepasse) newErrors.confirmmotdepasse = "Please confirm your password";
        if (formData.motdepasse && formData.confirmmotdepasse && formData.motdepasse !== formData.confirmmotdepasse) {
            newErrors.confirmmotdepasse = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        try {
            const response = await axios.post('http://localhost:8081/api/utilisateur/signup', formData);
            navigate("/login");
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

    const inputClasses = "w-full pl-10 pr-4 py-3 border rounded-2xl focus:outline-none focus:border-blue-500 hover:border-blue-300 transition-all duration-300";
    const buttonClasses = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-300";

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="w-full max-w-xl">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
                        <div className="text-center mb-8">
                            <img
                                alt="Your Company"
                                src={Xchange}
                                className="image-icon mx-auto h-20 w-auto"
                            />
                            <h2 className="text-3xl font-bold text-gray-800">
                                Sign up to your account
                            </h2>
                        </div>

                        {errors.general && (
                            <div className="text-red-500 text-center mb-4">{errors.general}</div>
                        )}

                        <div className="space-y-5">
                            {/* Nom et Prénom */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="nom"
                                        placeholder="Nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses + (errors.nom ? " border-red-500" : " border-gray-300")}
                                    />
                                    {errors.nom && (
                                        <span className="text-red-500 text-sm mt-1 block">{errors.nom}</span>
                                    )}
                                </div>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        name="prenom"
                                        placeholder="Prénom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses + (errors.prenom ? " border-red-500" : " border-gray-300")}
                                    />
                                    {errors.prenom && (
                                        <span className="text-red-500 text-sm mt-1 block">{errors.prenom}</span>
                                    )}
                                </div>
                            </div>

                            {/* adress */}
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    name="adress"
                                    placeholder="adress"
                                    value={formData.adress}
                                    onChange={handleChange}
                                    required
                                    className={inputClasses + (errors.adress ? " border-red-500" : " border-gray-300")}
                                />
                                {errors.adress && (
                                    <span className="text-red-500 text-sm mt-1 block">{errors.adress}</span>
                                )}
                            </div>

                            {/* Téléphone */}
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    name="telephone"
                                    placeholder="Téléphone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    required
                                    className={inputClasses + (errors.telephone ? " border-red-500" : " border-gray-300")}
                                />
                                {errors.telephone && (
                                    <span className="text-red-500 text-sm mt-1 block">{errors.telephone}</span>
                                )}
                            </div>
                            {/* Email */}
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={inputClasses + (errors.email ? " border-red-500" : " border-gray-300")}
                                />
                                {errors.email && (
                                    <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>
                                )}
                            </div>

                            {/* Mot de passe */}
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    name="motdepasse"
                                    type={showmotdepasse ? "text" : "password"}
                                    placeholder="Mot de passe"
                                    value={formData.motdepasse}
                                    onChange={handleChange}
                                    required
                                    className={inputClasses + (errors.motdepasse ? " border-red-500" : " border-gray-300")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowmotdepasse(!showmotdepasse)}
                                    className={buttonClasses}
                                >
                                    {showmotdepasse ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.motdepasse && (
                                    <span className="text-red-500 text-sm mt-1 block">{errors.motdepasse}</span>
                                )}
                            </div>

                            {/* Confirmer mot de passe */}
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    name="confirmmotdepasse"
                                    type={showConfirmmotdepasse ? "text" : "password"}
                                    placeholder="Confirmer le mot de passe"
                                    value={formData.confirmmotdepasse}
                                    onChange={handleChange}
                                    className={inputClasses + (errors.confirmmotdepasse ? " border-red-500" : " border-gray-300")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmmotdepasse(!showConfirmmotdepasse)}
                                    className={buttonClasses}
                                >
                                    {showConfirmmotdepasse ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.confirmmotdepasse && (
                                    <span className="text-red-500 text-sm mt-1 block">{errors.confirmmotdepasse}</span>
                                )}
                            </div>
                        </div>

                        {/* Bouton d'inscription */}
                        <button
                            type="submit"
                            className="w-full mt-8 bg-blue-500 text-white py-3 rounded-[30px] border-2 border-blue-500
    hover:bg-blue-600 hover:border-blue-600 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]
    active:scale-95 transition-all duration-300 font-semibold transform"
                        >
                            sign up
                        </button>

                        {/* Lien connexion */}
                        <p className="text-center mt-6 text-gray-600">
                            Déjà membre ?{' '}
                            <Link to="/login"> sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Registre;