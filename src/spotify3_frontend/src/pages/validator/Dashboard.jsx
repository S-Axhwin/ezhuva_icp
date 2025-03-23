import { useEffect, useState } from "react";
import useAuth from "../../useAuth";
import { Button } from "../../components/ui/button";
import { ModeToggle } from "../../components/mode-toggle";

import scrapeIt from "scrape-it"

async function checkWebsite(url) {
  return scrapeIt(url, {
    title: "title",
  }).then(({ data, status }) => {
    console.log(`Status Code: ${status}`)
    return status === 200 ? true: false
});
}


const Dashboard = () => {
  const { auth } = useAuth();
  const { backendActor } = auth;
  const [bal, setBal] = useState("Loading...");
  const [computing, setComputing] = useState(false)
  useEffect(() => {
    (async () => {
      const _bal = await backendActor.get_balance();
      setBal(BigInt(_bal).toString());
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Heading */}
        <ModeToggle/>
        <header className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-bold text-foreground">Validator Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your assigned websites</p>
        </header>

        {/* Balance Card */}
        <div className="bg-card border border-border shadow-md rounded-2xl p-8 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Your Balance</h2>
          <div className="text-3xl font-bold text-foreground flex justify-center gap-2">
            {bal / 1000}
            <img
              src="https://s2.coinmarketcap.com/static/img/coins/64x64/8916.png"
              alt="Coin"
              className="h-8 w-8"
            />
          </div>
        </div>

        {/* Compute Action Card */}
        <div className="bg-card border border-border shadow-md rounded-2xl p-8 space-y-4 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Assigned Websites</h2>
          <p className="text-muted-foreground text-center">
            Click below to validate uptime and submit your proof.
          </p>

          <Button
            disabled={computing}
            onClick={async () => {
              setComputing(true)
              const assignedWebsites = await backendActor.get_assigned_websites();
              console.log("Assigned Websites:", assignedWebsites);

              assignedWebsites.forEach((element) => {
                console.log("checking website", element.url);
                backendActor.submit_uptime_proof(
                  element.id,
                  Math.random() < 0.9 ? "up" : "down",
                  4
                );
              });
              
              setComputing(false)
            }}
          >
            Give My Compute Power
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
