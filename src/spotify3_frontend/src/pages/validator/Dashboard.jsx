
import { canisterId as backendCanisterId } from "declarations/internet_identity";
import { useEffect, useState } from "react";
import useAuth from "../../useAuth";
import { Button } from "../../components/ui/button";

async function isUrlAlive(url) {
  try {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const response = await fetch(proxy + url);
    console.log(response);
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

const Dashboard = () => {
  const {auth} = useAuth();
  const { backendActor } = auth;
  const [bal, setBal] = useState("wait");

  useEffect(() => {
    (async() => {
      const _bal = (await backendActor.get_balance());
    
      setBal(BigInt(_bal).toString());   
    })()
  }, [])

  return (
    <div>
      validator dashboard
      <div>
        bal: {bal}
      </div>
      <div>
        <Button onClick={async() => {
          const assignedWebsites = await backendActor.get_assigned_websites();
          console.log(assignedWebsites);
          assignedWebsites.forEach(element => {
            isUrlAlive(element).then(isAlive => {
              backendActor.submit_uptime_proof(element.id, isAlive?"up":"down", isAlive?4:0);
            });
          }
          );
        }
        }
          >Give my compute</Button>
      </div>
    </div>
  )
}

export default Dashboard
