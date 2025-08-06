import {BrowserRouter, Route, Routes} from "react-router";
import './i18n.js'
import Home from "./Home.jsx";
import Login from "./LOGIN/Login.jsx";
import Registre from "./Registre/Registre.jsx";
import Obj_donner from "./Donner/Obj_donner.jsx";
import Obj_changer from "./echanger/Obj_changer.jsx";
import Produit_detail from "./Produits/dettail/Produit_detail.jsx";
import Home_login from "./Home_login.jsx";
import Obj_donner_login from "./Donner/Obj_donner_login.jsx";
import Obj_changer_login from "./echanger/Obj_changer_login.jsx";
import Profile from "./Profile/Profile.jsx";
import Mes_produits from "./Produits/dettail/Mes_produits.jsx";
import Message from "./Produits/dettail/Message.jsx";
import Produit_user from "./Produits/Produit_user.jsx";
import ProduitModifier from "./Produits/ProduitModifier.jsx";
import Home_admin from "./ADMIN/Home_admin.jsx";
import Users from "./ADMIN/Users.jsx";
import Produit_admin from "./ADMIN/Produit_admin.jsx";
import Demandes_admin from "./ADMIN/Demandes_admin.jsx";
import Avis_admin from "./ADMIN/Avis_admin.jsx";
import Usermodify from "./ADMIN/Usermodify.jsx";
import Useeradd from "./ADMIN/Useeradd.jsx";
function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registre" element={<Registre />} />
              <Route path="/Obj_donner" element={<Obj_donner />} />
              <Route path="/Obj_achanger" element={<Obj_changer />} />
              <Route path="/produit/:id" element={<Produit_detail />} />
              {/* component apres login */}
              <Route path="/Home_login" element={<Home_login />} />
              <Route path="/Obj_changer_login" element={<Obj_changer_login />} />
              <Route path="/Obj_donner_login" element={<Obj_donner_login/>} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/Mes_produits" element={<Mes_produits/>} />
              <Route path="/Message" element={<Message/>} />
              <Route path="/Produit_user" element={<Produit_user/>} />
              <Route path="/Produit_modifier/:id" element={<ProduitModifier />} />
              {/* component admin */}
              <Route path="/Home_admin" element={<Home_admin />} />
              <Route path="/users" element={<Users />} />
              <Route path="/produit_admin" element={<Produit_admin />} />
              <Route path="/Demandes" element={<Demandes_admin />} />
              <Route path="/Avis_adimn" element={<Avis_admin />} />
              <Route path="/Usermodify/:id" element={<Usermodify />} />
              <Route path="/Useradd" element={<Useeradd />} />
              <Route path="/produit_admin" element={<Produit_admin />} />
              <Route path="/Demandes_admin" element={<Demandes_admin />} />
          </Routes>
      </BrowserRouter>
  );
}
export default App
