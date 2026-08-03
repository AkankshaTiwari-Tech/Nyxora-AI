import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import NotFound from "../pages/NotFound";

import Home from "../modules/home/pages/Home";
import Chat from "../modules/chat/pages/Chat";

import Workspace from "../modules/workspace/pages/Workspace";

import PDFGenerator
  from "../modules/workspace/pages/PDFGenerator";

import AIMemory from "../pages/settings/AIMemory";

import ProtectedRoute from "./ProtectedRoute";


export default function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ============================================= */}
        {/* AUTHENTICATION                                */}
        {/* ============================================= */}

        <Route element={<AuthLayout />}>

          <Route
            path="/"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

        </Route>


        {/* ============================================= */}
        {/* DASHBOARD                                     */}
        {/* ============================================= */}

        <Route
          path="/dashboard"
          element={

            <ProtectedRoute>

              <MainLayout>

                <Home />

              </MainLayout>

            </ProtectedRoute>

          }
        />


        {/* ============================================= */}
        {/* AI CHAT                                       */}
        {/* ============================================= */}

        <Route
          path="/chat"
          element={

            <ProtectedRoute>

              <Chat />

            </ProtectedRoute>

          }
        />


        {/* ============================================= */}
        {/* WORKSPACE                                     */}
        {/* ============================================= */}

        <Route
          path="/workspace"
          element={

            <ProtectedRoute>

              <MainLayout>

                <Workspace />

              </MainLayout>

            </ProtectedRoute>

          }
        />


        {/* ============================================= */}
        {/* PDF GENERATOR                                 */}
        {/* ============================================= */}

        <Route
          path="/pdf"
          element={

            <ProtectedRoute>

              <MainLayout>

                <PDFGenerator />

              </MainLayout>

            </ProtectedRoute>

          }
        />


        {/* ============================================= */}
        {/* AI MEMORY                                     */}
        {/* ============================================= */}

        <Route
          path="/ai-memory"
          element={

            <ProtectedRoute>

              <MainLayout>

                <AIMemory />

              </MainLayout>

            </ProtectedRoute>

          }
        />


        {/* ============================================= */}
        {/* 404                                           */}
        {/* ============================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />


      </Routes>

    </BrowserRouter>

  );

}