import React from 'react';
import { Building2, Mail, Phone } from 'lucide-react';
function Footer(props) {
    return (
        <footer id={props.id} className="bg-gray-800 text-white py-6 text-center">
            <div className="bg-gray-900 text-white py-16 px-4 text-center">
                <h2 className="text-4xl font-bold mb-4">Contactez-nous</h2>
                <p className="text-gray-300 max-w-xl mx-auto mb-10">
                    La meilleure façon de nous contacter est d'utiliser notre formulaire de contact ci-dessous.
                    Veuillez utiliser les informations ci-dessous pour nous joindre.
                </p>

                <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto border-t border-b border-gray-700 py-8">
                    {/* Adresse */}
                    <div>
                        <div className="flex justify-center mb-2">
                            <Building2 className="text-yellow-500 w-6 h-6" />
                        </div>
                        <p className="font-semibold">Address:</p>
                        <p className="text-gray-300">
                            maghrib al jadid 370<br />
                            larache maroc
                        </p>
                    </div>

                    {/* Téléphone */}
                    <div>
                        <div className="flex justify-center mb-2">
                            <Phone className="text-yellow-500 w-6 h-6" />
                        </div>
                        <p className="font-semibold">Phone:</p>
                        <a href="tel:+212707947436" className="text-blue-400 hover:underline link-white">
                            06 40 79 87 86
                        </a>
                    </div>

                    {/* Email */}
                    <div>
                        <div className="flex justify-center mb-2">
                            <Mail className="text-yellow-500 w-6 h-6" />
                        </div>
                        <p className="font-semibold">Email:</p>
                        <a href="mailto:alghemsaad17@gmail.com" className="text-blue-400 hover:underline link-white">
                            alghemsaad17@gmail.com
                        </a>
                    </div>
                </div>
                <p>© 2025 Xchange. Tous droits réservés.</p>
            </div>
        </footer>
    );
}
export default Footer;
