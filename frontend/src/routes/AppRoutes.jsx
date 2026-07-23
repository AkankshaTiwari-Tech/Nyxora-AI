import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <h1
              style={{
                color: "white",
                textAlign: "center",
                marginTop: "100px",
              }}
            >
              Nyxora AI Routing Working 🚀
            </h1>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}