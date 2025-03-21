import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import useAuth from "../../useAuth"
import { Link } from "react-router-dom";


const CompanyDashboard = () => {
  const {auth} = useAuth();
  const { backendActor } = auth;
  const [websites, setWebsites] = useState([]);
  const [trigger, setTrigger] = useState(false);

  const [url, setUrl] = useState("");
  useEffect(() => {
    (async () => {
      const websites = await backendActor.get_my_websites();
      setWebsites(websites);
    })();
  }, [trigger])

  const handleForm = async (e) => {
    e.preventDefault();
    console.log("form submitted");
    const res = await backendActor.submit_website(url,BigInt(60));
    console.log(Number(res));
    setTrigger(!trigger);
  }
  return (
    <div>
      company dashboard
      <div>
        {websites.map((website) => (
          <Link key={website.id} to={"/dashboard/"+website.id}>
            <div>{website.url}</div>
            <div>{website.status}</div>
          </Link>
        ))}
      </div>
      <form onSubmit={handleForm}>
        <Input placeholder="website url" onChange={(e) => setUrl(e.target.value)}/>
        <Button>Add website</Button>
      </form>
    </div>
  )
}

export default CompanyDashboard
