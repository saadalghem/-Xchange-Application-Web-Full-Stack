import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {FaEnvelope, FaUser, FaSignOutAlt, FaChevronDown, FaBoxOpen, FaExchangeAlt} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Xchange from "../assets/Xchange-removebg-preview.png";
import {HashLink} from "react-router-hash-link";
import './Header.css'

function Header_login() {
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState("FR");
    const [pendingCount, setPendingCount] = useState(0);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [initial, setInitial] = useState("U");
    const navigate = useNavigate();
    const [notifCount, setNotifCount] = useState(0);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const utilisateur = JSON.parse(userData);
            const userId = utilisateur.id;

            if (utilisateur.nom && utilisateur.nom.length > 0) {
                setInitial(utilisateur.prenom.charAt(0).toUpperCase());
            }

            // Demandes en attente reçues
            axios.get(`http://localhost:8081/api/demmandechange/recues/en_attente/${userId}`)
                .then(res => setPendingCount(res.data.length))
                .catch(err => {
                    console.error("Erreur en récupérant les demandes en attente :", err);
                    setPendingCount(0);
                });

            // ✅ Vérifie si notification existe
            const notifications = JSON.parse(localStorage.getItem("notif_mes_demmandes")) || {};
            if (notifications[userId]) {
                setNotifCount(1);
            }
        }
    }, []);

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };
    const handleLangChange = (e) => {
        const selectedLang = e.target.value;
        setLang(selectedLang);
        i18n.changeLanguage(selectedLang);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg bg-light relative">
            {/* Logo and navigation links */}
            <ul className="nav">
                <li>
                    <img className="mx-auto h-16 w-auto" src={Xchange} alt="Xchange Logo" />
                </li>
                <li className="nav-item">
                    <h1 className="titre">
                        <Link to="/Home_login" className="link-red">XCHANGE</Link>
                    </h1>
                </li>
                <li className="nav-item">
                    <p className="phrase">
                        <Link to="/Obj_donner_login" className="link-black">{t("donner")}</Link>
                    </p>
                </li>
                <li className="nav-item">
                    <p className="phrase">
                        <Link to="/Obj_changer_login" className="link-black">{t("echanger")}</Link>
                    </p>
                </li>
                <li className="nav-item">
                    <p className="phrase">
                        <HashLink smooth to="/Home_login#footer_home_login" className="link-black">
                            {t("nous_contacter")}
                        </HashLink>
                    </p>
                </li>
            </ul>
            {/* Right side: Notification and profile */}
            <div className="flex items-center gap-4 ml-auto mr-4">
                <Link to="/Message" className="relative flex items-center gap-1 hover:text-blue-600 nav-item message">
                    <FaEnvelope size={20} />
                    {pendingCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {pendingCount}
                        </span>
                    )}
                </Link>
                <select
                    value={lang}
                    onChange={handleLangChange}
                    className="border rounded px-2 py-1 cursor-pointer lang"
                >
                    <option value="fr">FR</option>
                    <option value="en">EN</option>
                </select>

                {/* Profile Menu */}
                <div className="relative">
                    {notifCount > 0 && (
                        <span className="absolute top-1 right-1 bg-red-600 rounded-full w-3 h-3"></span>
                    )}
                    <button onClick={toggleProfileMenu} className="flex items-center gap-2 focus:outline-none">
                        <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg font-bold">
                            {initial}
                        </div>
                        <FaChevronDown size={12} className={`${showProfileMenu ? 'rotate-180' : ''} transition-transform`} />
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                            <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer link-black">
                                <FaUser className="text-gray-500" />
                                <span>{t("mon_profil")}</span>
                            </Link>
                            <Link to="/Produit_user
                            " className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer link-black">
                                <FaBoxOpen className="text-gray-500" />
                                <span>{t("mes_produit")}</span>
                            </Link>
                            <Link to="/Mes_produits" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer link-black relative">
                                <FaExchangeAlt className="text-gray-500" />
                                <span>{t("mes_demmande")}</span>
                                {notifCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-600 rounded-full w-3 h-3"></span>
                                )}
                            </Link>

                            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer w-full">
                                <FaSignOutAlt className="text-red-500" />
                                <span>{t("deconnexion")}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Header_login;
