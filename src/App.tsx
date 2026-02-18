import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./login";
import Dashboard from "./dashboard";
import Export from "./export";
import Import from "./import";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/export" element={<Export />} />
      <Route path="/import" element={<Import />} />

      {/* if user types random URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
