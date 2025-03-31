import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import IncidentsList from '../pages/incidents/IncidentsList';
import IncidentDetails from '../pages/incidents/IncidentDetails';
import NewIncident from '../pages/incidents/NewIncident';

const IncidentRoutes = () => {
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/incidents" element={<IncidentsList />} />
        <Route path="/incidents/:id" element={<IncidentDetails />} />
        <Route path="/incidents/new" element={<NewIncident />} />
      </Routes>
    </ChakraProvider>
  );
};

export default IncidentRoutes;
