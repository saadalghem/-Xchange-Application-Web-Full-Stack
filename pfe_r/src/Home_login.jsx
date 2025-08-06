import Header_login from "./HEADER/Header_login.jsx";
import Informaton from "./INFORMATION/Informaton.jsx";
import Produit from "./Produits/Produit.jsx";
import Footer from "./Footer/Footer.jsx";
import F_question from "./FAQ/F_question.jsx";
import Avis from "./Avis/Avis.jsx";

function Home_login(){
    return(
        <>
            <Header_login />
            <Informaton />
            <Produit />
            <Avis />
            <F_question />
            <Footer id="footer_home_login" />
        </>
        
    );
}
export default Home_login;