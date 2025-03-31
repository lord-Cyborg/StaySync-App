import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";  
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import PropertyPage from "./pages/PropertyPage";
import EditProperty from "./pages/EditProperty";
import PropertyCardPage from "./pages/PropertyCard/PropertyCard";
import AddPropertyPage from "./pages/AddPropertyPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="properties" element={<PropertyPage />} />
          <Route path="property/:id" element={<PropertyCardPage />} />
          <Route path="edit-property/:id" element={<EditProperty />} />
          <Route path="add-property" element={<AddPropertyPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;