import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// Pags a serem criadas
import { LoginPage } from "../pages/LoginPage";

import { ConfiguracoesPage } from "../pages/ConfiguracoesPage";
import { EditarPerfilPage } from "../pages/EditarPerfilPage";
import { MudarSenhaPage } from "../pages/MudarSenhaPage";
import { SegurancaPrivacidadePage } from "../pages/SegurancaPrivacidadePage";
import { CadastroPage } from "../pages/CadastroPage";
import { CalendarioPage } from "../pages/CalendarioPage";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to='/login' />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/cadastro' element={<CadastroPage />} />

        {/* Rotas Privadas */}
        <Route
          path='/'
          element={
            <PrivateRoute>
              <CalendarioPage />
            </PrivateRoute>
          }
        />
        <Route
          path='/configuracoes'
          element={
            <PrivateRoute>
              <ConfiguracoesPage />
            </PrivateRoute>
          }
        />
        <Route
          path='/editar-perfil'
          element={
            <PrivateRoute>
              <EditarPerfilPage />
            </PrivateRoute>
          }
        />
        <Route
          path='/mudar-senha'
          element={
            <PrivateRoute>
              <MudarSenhaPage />
            </PrivateRoute>
          }
        />
        <Route
          path='/seguranca'
          element={
            <PrivateRoute>
              <SegurancaPrivacidadePage />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  );
};
