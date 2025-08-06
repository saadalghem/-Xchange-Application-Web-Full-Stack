import Header from "./HEADER/Header.jsx";
import Informaton from "./INFORMATION/Informaton.jsx";
import Footer from "./Footer/Footer.jsx";
import Produit from "./Produits/Produit.jsx";
import F_question from "./FAQ/F_question.jsx";
import Avis from "./Avis/Avis.jsx";
function Home(){
    return (
        <>
            <Header />
            <Informaton />
            <Produit />
            <Avis />
            <F_question />
            <Footer  id="footer_home"/>
        </>
    );
}
export default Home