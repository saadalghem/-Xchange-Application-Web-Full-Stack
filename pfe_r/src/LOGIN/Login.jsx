import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Header from "../HEADER/Header.jsx";
import Xchange from '../assets/Xchange-removebg-preview.png';
import Footer from "../Footer/Footer.jsx";
import { useNavigate } from "react-router";

function Login() {
    const [formData, setFormData] = useState({ email: "", motdepasse: "" });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined, general: undefined });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.motdepasse) newErrors.motdepasse = "Password is required";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        try {
            const response = await axios.post("http://localhost:8081/api/utilisateur/signin", formData);
            const user = response.data;
            localStorage.setItem("user", JSON.stringify(response.data));
            // ✅ Redirection selon le rôle
            if (user.etat_user === "ADMIN") {
                navigate("/home_admin");
            } else {
                navigate("/Home_login");
            }

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

    const inputClass = (field) =>
        "w-full py-2 px-2 bg-transparent outline-none text-gray-900 placeholder-gray-400" +
        (errors[field] ? " border-red-500" : "");

    return (
        <>
            <Header />
            <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4">
                <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    <div className="flex flex-col items-center">
                        <img
                            alt="Your Company"
                            src={Xchange}
                            className="mx-auto h-20 w-auto mb-4"
                        />
                        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {errors.general && (
                            <div className="text-red-500 text-center mb-2">{errors.general}</div>
                        )}
                        <div>
                            <div className={`flex items-center border rounded-lg px-3 bg-white focus-within:ring-2 focus-within:ring-indigo-400 ${errors.email ? "border-red-500" : "border-gray-300"}`}>
                                <FaEnvelope className="text-gray-400 mr-2" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    required
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={inputClass("email")}
                                />
                            </div>
                            {errors.email && (
                                <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>
                            )}
                        </div>
                        <div>
                            <div className={`flex items-center border rounded-lg px-3 bg-white focus-within:ring-2 focus-within:ring-indigo-400 ${errors.motdepasse ? "border-red-500" : "border-gray-300"}`}>
                                <FaLock className="text-gray-400 mr-2" />
                                <input
                                    id="motdepasse"
                                    name="motdepasse"
                                    type="password"
                                    placeholder="motdepasse"
                                    required
                                    autoComplete="current-motdepasse"
                                    value={formData.motdepasse}
                                    onChange={handleChange}
                                    className={inputClass("motdepasse")}
                                />
                            </div>
                            {errors.motdepasse && (
                                <span className="text-red-500 text-sm mt-1 block">{errors.motdepasse}</span>
                            )}
                            <div className="flex items-center justify-between mt-2">
                                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 font-semibold">
                                    Forgot motdepasse?
                                </a>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold shadow hover:bg-indigo-700 transition"
                        >
                            Sign in
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <Link to="/registre" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            sign up
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}
export default Login;