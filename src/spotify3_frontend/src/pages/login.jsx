import { AuthClient } from "@dfinity/auth-client";


import { createActor, canisterId as backendCanisterId } from "../../../declarations/spotify3_backend";
import useAuth from "../useAuth";
import { Navigate } from 'react-router-dom';
import { Button } from "../components/ui/button";

let authClient = null;

async function initAuthClient() {
  authClient = await AuthClient.create();
}

export const LoginPage = () => {
  const {auth, setAuth} = useAuth();


  async function login(type) {

    if (!authClient) await initAuthClient();
  
    // Opens the II window for login
    await authClient.login({
      identityProvider: "http://asrmz-lmaaa-aaaaa-qaaeq-cai.localhost:4943/", 
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();
        console.log("Logged in as:", principal, identity);
        
        const backendActor = createActor(backendCanisterId, {
          agentOptions: {
            identity,
          },
        });

        if(type) {
          const res = await backendActor.register_validator(principal);
          console.log(res);
          setAuth({
            principal,
            type: "validator",
            backendActor
          });
        } else {
          await backendActor.register_company(principal);
          setAuth({
            principal,
            type: "customer",
            backendActor
          });
        }
      },
    });
  }

  return (
    <div>
      {auth ? (
        <Navigate to="/dashboard"/>
      ) : (
        <div className="grid place-items-center h-screen w-screen">
          <Button onClick={() => login("vali")}>Login as validator</Button>
          <Button onClick={() => login(null)}>Login as customer</Button>
        </div>
      )}
    </div>
  )
}


