import { Routes, Route } from "react-router";
import { Home } from "./components/Home";
import { Layout } from "./components/Layout";
import { CallApi } from "./components/CallApi";
import { UserSession } from "./components/UserSession";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/user-session" element={<UserSession />} />
        <Route path="/call-api" element={<CallApi />} />
      </Route>
    </Routes>
  );
}

export default App;
