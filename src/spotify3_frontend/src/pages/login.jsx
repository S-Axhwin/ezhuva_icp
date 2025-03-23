import { AuthClient } from "@dfinity/auth-client";
import { createActor, canisterId as backendCanisterId } from "../../../declarations/spotify3_backend";
import useAuth from "../useAuth";
import { Navigate } from 'react-router-dom';
import ParaPage from './../components/ParaPage';
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";

let authClient = null;

async function initAuthClient() {
  authClient = await AuthClient.create();
}

export const LoginPage = () => {
  const { auth, setAuth } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  async function login(type) {
    if (!authClient) await initAuthClient();

    await authClient.login({
      identityProvider: process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/"
        : "http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943/",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();

        const backendActor = createActor(backendCanisterId, {
          agentOptions: { identity },
        });

        if (type === "vali") {
          const res = await backendActor.register_validator(principal);
          console.log(res);
          setAuth({ principal, type: "validator", backendActor });
        } else {
          await backendActor.register_company(principal);
          setAuth({ principal, type: "customer", backendActor });
        }
      },
    });
  }

  return (
    auth ? <Navigate to="/dashboard" /> :
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden flex flex-col justify-center items-center">
        <main className="relative w-full max-w-6xl mx-auto px-4">
          
          <section className="flex flex-col items-center justify-center py-16 space-y-12">
            {/* Logo */}
            <div className={cn(
              "transition-all",
              isLoaded ? "animate-fade-in-down opacity-100" : "opacity-0"
            )}
              style={{ animationDelay: "100ms" }}
            >
              <img src="/logo.png" alt="Logo" className="h-20 w-auto mb-8" />
            </div>
            
            {/* Title */}
            <h1 className={cn(
              "text-center text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight transition-all bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500",
              isLoaded ? "animate-fade-in-up opacity-100" : "opacity-0"
            )}
              style={{ animationDelay: "200ms" }}
            >
              Join As
            </h1>

            {/* Buttons and Icon */}
            <div className={cn(
              "flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-16 transition-all",
              isLoaded ? "animate-fade-in-up opacity-100" : "opacity-0"
            )}
              style={{ animationDelay: "100ms" }}
            >
              
              {/* Validator Button */}
              <Button 
                onClick={() => login("vali")} 
                  className="px-10 py-6 text-xl font-semibold rounded-xl bg-blue-500 text-primary   border-white transition-all border-2 hover:text-white"
                  >
                Validator
              </Button>

              {/* Icon */}
              <div className="relative">
                <span className="text-7xl md:text-8xl animate-pulse">⚡</span>
                <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full -z-10"></div>
              </div>

              {/* Customer Button */}
              <Button 
                onClick={() => login(false)} 
                className="px-10 py-6 text-xl font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg transition-all text-white"
              >
                Customer
              </Button>
            </div>
            
          </section>

          {/* Background Effects */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-full aspect-square bg-para-green/10 rounded-full blur-[100px] opacity-30 animate-pulse-light" />
            <div className="absolute -top-1/4 -right-1/4 w-full aspect-square bg-para-green/5 rounded-full blur-[120px] opacity-20" />
            <div className="absolute top-1/3 -left-1/4 w-full aspect-square bg-para-green/5 rounded-full blur-[120px] opacity-20" />
          </div>

          {/* Additional Page */}
          <div className="mt-10">
            <ParaPage />
          </div>
        </main>
      </div>
  );
};
