import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AccountPage from './pages/AccountPage'; // adjust path as needed
import CartsList from './pages/CartsList'; // adjust path as needed
import CategoriesList from './pages/CategoriesList'; // adjust path as needed
import CategoryForm from './pages/CategoryForm'; // adjust path as needed
import Login from './pages/Login'; // adjust path as needed
import ProductCommentsWrapper from './pages/ProductCommentsWrapper'; // adjust path as needed
import ProductsPage from './pages/ProductsPage'; // adjust path as needed
import UserPage from './pages/UserPage'; // adjust path as needed
import TextSearch from "./pages/TextSearch";
import VoiceSearch from './pages/VoiceSearch';
import ProductAIAnalysisWrapper from './pages/ProductAIAnalysisWrapper'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/me" element={<AccountPage />} />
        <Route path="/carts" element={<CartsList />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories" element={<CategoryForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/comments/:productId" element={<ProductCommentsWrapper />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/text_search" element={<TextSearch />} />
        <Route path="/voice_search" element={<VoiceSearch />} />
        <Route path="/:productId/ai_analysis" element={<ProductAIAnalysisWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
