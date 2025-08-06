import './Information.css';
import Xchange from '../assets/Xchange-removebg-preview.png';
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";

function Informaton(){
    const navigate = useNavigate();

    const handleClickDonner = () => {
        const user = localStorage.getItem("user");
        if (user) {
            // Utilisateur connecté => on va au profil
            navigate("/Obj_donner_login");
        } else {
            // Non connecté => on va à la page donner
            navigate("/Login");
        }
    };
    const handleClickchanger = () => {
        const user = localStorage.getItem("user");
        if (user) {
            // Utilisateur connecté => on va au profil
            navigate("/Obj_changer_login");
        } else {
            // Non connecté => on va à la page donner
            navigate("/Login");
        }
    };
    return(
    <>
        <div className="information">
            <div className="left">
                <h1>XCHANGE</h1>
                <p>Des milliers d'objets à donner et changer en Maroc !</p>
            </div>
            <div className="right">
                <h2>Découvrez les annonces</h2>
                <p>Jeux, vêtements, meubles, livres, cours particuliers,  jardinage... Tout s'échange
                    gratuitement sur Xchange !</p>
                <div className="buttons">
                    <button type="button" className="btn btn-light" onClick={handleClickDonner}>objet a donner</button>
                    <button type="button" className="btn btn-light" onClick={handleClickchanger}> objet a changer</button>
                </div>
            </div>
        </div>
        <div className=" flex flex-col md:flex-row justify-between items-center p-10 rounded-xl shadow-md">
            <div className="text-gray-800 md:max-w-2xl">
                <p className="text-xl leading-relaxed">
                    Échangez des objets sans dépenser 1dh ! <strong>Xchange</strong>, c'est la <strong>plateforme de troc</strong> en ligne <strong>solidaire</strong> qui fait du bien à votre portefeuille. C'est 100% Gratuit et c'est déjà plusieurs tonnes de déchets évités.
                </p>
                <p className="text-xl mt-4 leading-relaxed">
                    Publiez des annonces en proposant vos services et objets, découvrez ce que les autres membres de la communauté proposent, et faites des échanges sans dépenser un seul euro ! Un système à la fois économique, écologique et qui permet de tisser du lien social !
                </p>
            </div>
            <div className="mt-6 md:mt-0 md:ml-10">
                <img src={Xchange} alt="Illustration poignée de main" className="w-40 md:w-89" />
            </div>
        </div>
        <hr></hr>
    </>
    );
}
export default Informaton;