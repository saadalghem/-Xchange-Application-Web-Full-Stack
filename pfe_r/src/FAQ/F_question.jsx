import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function F_question() {
    const faqData = [
        {
            question: "Comment puis-je créer un compte ?",
            answer: "Cliquez sur 'S'inscrire' en haut à droite, remplissez le formulaire et validez."
        },
        {
            question: "Comment publier un produit ?",
            answer: "Allez dans votre profil, puis cliquez sur 'Ajouter un produit'."
        },
        {
            question: "Puis-je modifier mon annonce après publication ?",
            answer: "Oui, allez dans 'Mes produits', cliquez sur 'Modifier' à côté du produit."
        },
        {
            question: "Comment effectuer un échange ?",
            answer: "Vous devez envoyer une demande d'échange via la page du produit qui vous intéresse."
        }
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                        Foire Aux Questions
                    </h1>
                    <p className="text-gray-600 text-xl">Trouvez rapidement les réponses à vos questions</p>
                </div>

                <div className="space-y-6">
                    {faqData.map((item, index) => (
                        <div 
                            key={index} 
                            className={`
                                bg-white backdrop-blur-lg rounded-2xl
                                ${activeIndex === index 
                                    ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-200' 
                                    : 'hover:shadow-md'}
                                transition-all duration-300 ease-out
                            `}
                        >
                            <button
                                onClick={() => toggleAnswer(index)}
                                className="w-full px-8 py-6 text-left"
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`
                                        text-xl font-medium
                                        ${activeIndex === index 
                                            ? 'text-blue-600' 
                                            : 'text-gray-800'}
                                    `}>
                                        {item.question}
                                    </span>
                                    <ChevronDown 
                                        className={`
                                            w-6 h-6 transform transition-transform duration-300
                                            ${activeIndex === index ? 'rotate-180 text-blue-600' : 'text-gray-400'}
                                        `}
                                    />
                                </div>
                            </button>
                            
                            <div className={`
                                overflow-hidden transition-all duration-300 ease-in-out
                                ${activeIndex === index ? 'max-h-96' : 'max-h-0'}
                            `}>
                                <div className="px-8 pb-6">
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"/>
                                    <p className="text-gray-600 leading-relaxed">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default F_question;