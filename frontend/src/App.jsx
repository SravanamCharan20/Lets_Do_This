import { Outlet } from "react-router";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <main className="mt-20">
        <Outlet />
      </main>
    </>
  );
}

export default App;