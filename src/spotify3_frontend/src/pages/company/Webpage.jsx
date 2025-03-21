import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../useAuth";

const Webpage = () => {
  let { webId } = useParams();
  const {auth} = useAuth();
  const { backendActor } = auth;

  useEffect(() => {
    (async() => {
        const res = await backendActor.get_uptime_report(BigInt(webId));
        console.log(res);
    })()
  });
  
  return (
    <div>
      {webId}
    </div>
  )
}

export default Webpage
