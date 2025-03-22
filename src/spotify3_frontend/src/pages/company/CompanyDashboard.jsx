import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import useAuth from "../../useAuth";
import { RefreshCw, Plus, Globe, CircleDot, Link as Link2 } from "lucide-react";
import { toast } from "sonner"


const CompanyDashboard = () => {
  const { auth } = useAuth();
  const { backendActor } = auth;

  const [websites, setWebsites] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    (async () => {
      const websites = await backendActor.get_my_websites();
      setWebsites(websites);
    })();
  }, [trigger]);

  const handleForm = async (e) => {
    e.preventDefault();
    if(!url) {
      toast.warning("Unable to add URL", {
          description: "Enter a vaild url.",
      })
      return ;
    }
    console.log("form submitted");
    const res = await backendActor.submit_website(url, BigInt(60));
    console.log(Number(res));
    setTrigger(!trigger);
    setUrl(""); // reset form input
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Company Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your websites and track their status
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setTrigger(!trigger)}
            className="flex gap-2 items-center text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </Button>
        </header>

        {/* Add Website Form */}
        <form
          onSubmit={handleForm}
          className="flex flex-col md:flex-row gap-4 items-center border border-border shadow-sm rounded-2xl p-6 bg-[#ffb6f0]"
        >
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow"
          />
          <Button
            type="submit"
            variant={"outline"}
            className="text-black shadow-sm hover:shadow-md hover:text-black/45 hover:cursor-crosshair"
          >
            <Plus className="h-5 w-5" />
            Add Website
          </Button>
        </form>

        {/* Websites List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {websites.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground">
              No websites found. Add one to get started!
            </div>
          ) : (
            websites.map((website) => (
              <div
  key={website.id}
  className={`group block border border-white/20 shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300 backdrop-blur-md
    ${
      website.status === "up"
        ? "bg-gradient-to-br from-green-400/30 to-green-600/30"
        : website.status === "down"
        ? "bg-gradient-to-br from-red-400/30 to-red-600/30"
        : "bg-gradient-to-br from-yellow-300/30 to-yellow-500/30"
    }`}
>
  <div className="flex items-center gap-3 mb-4">
    <Globe className="h-6 w-6 text-muted-foreground group-hover:text-foreground" />
    <h2 className="text-lg font-semibold text-foreground gap-2 group-hover:text-foreground flex items-center">
      {website.url}
      <a
        href={`https://${website.url}`}
        target="_blank"
        rel="noreferrer"
        className="ml-1 flex items-center"
      >
        <Link2 size={"1rem"} className="inline-block" />
      </a>
    </h2>
  </div>
  <div className="flex items-center gap-2 text-sm">
    <CircleDot
      className={`h-4 w-4 ${
        website.status === "up"
          ? "text-green-500"
          : website.status === "down"
          ? "text-red-500"
          : "text-yellow-500"
      }`}
    />
    <span
      className={`font-medium ${
        website.status === "up"
          ? "text-green-600"
          : website.status === "down"
          ? "text-red-600"
          : "text-yellow-600"
      }`}
    >
      {website.status === "up"
        ? "Online"
        : website.status === "down"
        ? "Offline"
        : "In Progress"}
    </span>
  </div>
</div>


            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
