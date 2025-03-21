import { HttpAgent, Actor } from "@dfinity/agent";

// Use your local canister id or deployed canister id
export const CANISTER_ID = "ajuq4-ruaaa-aaaaa-qaaga-cai"; // <-- your canister id

// Create the agent (local or ic)
const agent = new HttpAgent({
  host: "http://localhost:4943", // Local replica
  // host: "https://ic0.app", // Mainnet if deployed!
});

// If you're on local development, fetch root key
async function initAgent() {
  await agent.fetchRootKey(); // Only if local dev
}

initAgent();

// Define the candid interface for the canister (IDL)
const idlFactory = ({ IDL }) => {
  return IDL.Service({
    register_company: IDL.Func([IDL.Text], [IDL.Bool], []),
    // add other methods if needed...
  });
};

// Create the Actor for communication
export const uptimeActor = Actor.createActor(idlFactory, {
  agent,
  canisterId: CANISTER_ID,
});
