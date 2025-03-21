import { LoginPage } from "./pages/login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/validator/Dashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import useAuth from "./useAuth";
import Webpage from "./pages/company/Webpage";



const App = () => {
  const {auth, setAuth} = useAuth();
  return (
    <>
      <Routes>
        {auth ? (
          <>
            {auth.type === "validator" ? (
              <Route path="/dashboard" element={<Dashboard/>}/>
            ):(
              <>
                <Route path="/dashboard" element={<CompanyDashboard/>}/>
                <Route path="/dashboard/:webId" element={<Webpage/>}/>
              </>
            )}
          </>
        ):(
          <>
          </>)}
            <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </>
  )
}

export default App
