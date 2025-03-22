import { AuthClient } from "@dfinity/auth-client";

import { createActor, canisterId as backendCanisterId } from "../../../declarations/spotify3_backend";
import useAuth from "../useAuth";
import { Link, Navigate } from 'react-router-dom';
import ParaPage from './../components/ParaPage';
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";

let authClient = null;

async function initAuthClient() {
  authClient = await AuthClient.create();
}

export const LoginPage = () => {
  const {auth, setAuth} = useAuth();

  const [isLoaded, setIsLoaded] = useState(false);
      useEffect(() => {
        // Set loaded after a short delay to trigger animations
        const timer = setTimeout(() => {
          setIsLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
      }, []);

  async function login(type) {

    if (!authClient) await initAuthClient();
  
    // Opens the II window for login
    await authClient.login({
      identityProvider: process.env.DFX_NETWORK == "ic" ? "https://identity.ic0.app/" :"http://asrmz-lmaaa-aaaaa-qaaeq-cai.localhost:4943/", 
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
    auth ? <Navigate to="/dashboard"/> :
    <>
      <div className="min-h-screen bg-black text-white overflow-hidden">      
      <main className="relative pt-20">
        {/* Original Section */}
        <section className="min-h-[calc(80vh-80px)] flex items-center justify-center px-3 py-3">
          <div className="container mx-auto">
            <div className="flex  items-center text-center max-w-4xl mx-auto space-y-7 space-x-8">
                <h1 className={cn("text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight transition-all", isLoaded ? "animate-fade-in-up opacity-100" : "opacity-0")} style={{
                              animationDelay: "200ms"
                            }}>
                    Join As
                </h1>
                              
              
              <Button to={"/Validator"} onClick={() => login("vali")} className="">
                Validator
              </Button>
              <span className='text-9xl'>
                ⚡
              </span>
              <Button onClick={() => login(false)}>
                Customer
              </Button>
            </div>
          </div>
          
          {/* Background gradient effects */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-full aspect-square bg-para-green/10 rounded-full blur-[100px] opacity-30 animate-pulse-light" />
            <div className="absolute -top-1/4 -right-1/4 w-full aspect-square bg-para-green/5 rounded-full blur-[120px] opacity-20" />
            <div className="absolute top-1/3 -left-1/4 w-full aspect-square bg-para-green/5 rounded-full blur-[120px] opacity-20" />
          </div>
        </section>
        
        <div>
            <ParaPage/>
          </div>
       
      </main>
    </div>
    </>
  )
}


