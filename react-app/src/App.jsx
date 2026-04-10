import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SiteDataProvider } from "./context/SiteDataContext";
import Navbar from "./components/Navbar";
import AdminBar from "./components/AdminBar";
import AuthGate from "./components/AuthGate";
import BackToTop from "./components/BackToTop";
import V1Layout from "./components/V1Layout";
import V2Layout from "./components/V2Layout";

import VersionSelector from "./pages/VersionSelector";
import Home from "./pages/Home";
import HomeV2 from "./pages/HomeV2";
import Activitats from "./pages/Activitats";
import ActivitatsV2 from "./pages/ActivitatsV2";
import Ludoteca from "./pages/Ludoteca";
import LudotecaV2 from "./pages/LudotecaV2";
import SobreNosaltres from "./pages/SobreNosaltres";
import SobreNosaltresV2 from "./pages/SobreNosaltresV2";
import Contacte from "./pages/Contacte";
import ContacteV2 from "./pages/ContacteV2";
import ComArribar from "./pages/ComArribar";
import ComArribarV2 from "./pages/ComArribarV2";
import Login from "./pages/Login";

import "./styles/variables.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components/nav.css";
import "./styles/components/hero.css";
import "./styles/components/intro.css";
import "./styles/components/cards.css";
import "./styles/components/timeline.css";
import "./styles/components/visit.css";
import "./styles/components/backtop.css";
import "./styles/responsive.css";
import "./styles/pages.css";
import "./styles/admin.css";
import "./styles/home-v2.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteDataProvider>
          <AuthGate>
          <AdminBar />
          <Navbar />
          <Routes>
            <Route path="/" element={<VersionSelector />} />

            {/* ─── V1 ─── */}
            <Route path="/v1" element={<V1Layout />}>
              <Route index element={<Home />} />
              <Route path="activitats-2026" element={<Activitats />} />
              <Route path="ludoteca" element={<Ludoteca />} />
              <Route path="sobre-nosaltres" element={<SobreNosaltres />} />
              <Route path="contacte" element={<Contacte />} />
              <Route path="com-arribar" element={<ComArribar />} />
            </Route>

            {/* ─── V2 ─── */}
            <Route path="/v2" element={<V2Layout />}>
              <Route index element={<HomeV2 />} />
              <Route path="activitats-2026" element={<ActivitatsV2 />} />
              <Route path="ludoteca" element={<LudotecaV2 />} />
              <Route path="sobre-nosaltres" element={<SobreNosaltresV2 />} />
              <Route path="contacte" element={<ContacteV2 />} />
              <Route path="com-arribar" element={<ComArribarV2 />} />
            </Route>

            <Route path="/admin" element={<Login />} />
          </Routes>
          <BackToTop />
          </AuthGate>
        </SiteDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
