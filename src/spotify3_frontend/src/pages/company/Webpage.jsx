import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { MoveDownRight, MoveUpRight, RefreshCw } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";

const WebpageDashboard = () => {
  const { webId } = useParams();
  const { auth } = useAuth();
  const { backendActor } = auth;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [url, setUrl] = useState("")
  const [stats, setStats] = useState({
    totalChecks: 0,
    uptimePercentage: 0,
    totalDowntimeMinutes: 0,
    lastCheck: null
  });
  const fetchReport = async () => {
    try {
      setRefreshing(true);
      const res = await backendActor.get_uptime_report(BigInt(webId));
      console.log("Report:", res);
      // Calculate statistics from report data
      const totalChecks = res.length;
      const uptimeChecks = res.filter(r => r.status === 'up').length;
      const uptimePercentage = ((uptimeChecks / totalChecks) * 100).toFixed(2);
      
      // Calculate total downtime in minutes
      const downtimeChecks = res.filter(r => r.status === 'down');
      const totalDowntimeMinutes = downtimeChecks.length * 5; // Assuming 5 min check intervals
      
      // Get last check timestamp
      const lastCheck = res.length > 0 ? new Date(Number(res[res.length-1].timestamp) / 1000000) : null;

      // Set all the state
      setReport(res);
      setStats({
        totalChecks,
        uptimePercentage,
        totalDowntimeMinutes,
        lastCheck
      });
      const url = await backendActor.get_website_url(BigInt(webId));
      console.log("URL:", url);
      setUrl(url);
    } catch (error) {
      console.error("Failed to fetch uptime report", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [webId]);

  return (
    <div className="min-h-screen bg-primary/10 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">
            Website Dashboard
          </h1>
          <Button onClick={fetchReport} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing && 'animate-spin'}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4">
            <Skeleton className="h-24 w-full rounded-xl bg-primary/20" />
            <Skeleton className="h-24 w-full rounded-xl bg-primary/20" />
          </div>
        ) : report ? (
          <div className="grid gap-6">
            <Card className="border-primary shadow-md">
              <CardHeader>
                <CardTitle className="text-primary">
                  Website ID: {webId}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-primary text-sm space-y-2">
                  <p><strong>URL:</strong> {url}</p>
                  <p className="flex gap-1">
                    <strong>Status:</strong> 
                    {report[report.length-1]?.status === "up" ? 
                      <MoveUpRight color="green"/> : 
                      <MoveDownRight color="red"/>
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-md">
              <CardHeader>
                <CardTitle className="text-primary">
                  Uptime Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-primary text-sm">
                <p><strong>Total Checks:</strong> {stats.totalChecks}</p>
                <p><strong>Uptime Percentage:</strong> {stats.uptimePercentage}%</p>
                <p><strong>Total Downtime:</strong> {stats.totalDowntimeMinutes} minutes</p>
                <p><strong>Last Check:</strong> {stats.lastCheck?.toLocaleString() || 'Never'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Website Uptime History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-14 gap-1">
                  {report.map((item, index) => (
                    <div
                      key={index}
                      title={`Status: ${item.status.toUpperCase()}\nResponse: ${Number(item.response_time)}ms\nChecked: ${new Date(Number(item.timestamp) / 1_000_000).toLocaleString()}`}
                      className={`w-6 h-6 rounded-sm mb-2
                        ${item.status === "up" ? "bg-green-400" : "bg-destructive"}
                        hover:opacity-30 cursor-pointer transition-all duration-200`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        ) : (
          <p className="text-center text-primary/60">No report found for this website.</p>
        )}
      </div>
    </div>
  );
};

export default WebpageDashboard;
