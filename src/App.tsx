import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:series/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}
