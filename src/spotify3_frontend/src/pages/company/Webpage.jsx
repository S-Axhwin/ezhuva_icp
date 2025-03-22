import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";

const WebpageDashboard = () => {
  const { webId } = useParams();
  const { auth } = useAuth();
  const { backendActor } = auth;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReport = async () => {
    try {
      setRefreshing(true);
      const res = await backendActor.get_uptime_report(BigInt(webId));
      console.log("Report:", res);
      setReport(res);
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Website Dashboard</h1>
          <Button onClick={fetchReport} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing && 'animate-spin'}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : report ? (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Website ID: {webId}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-700 text-sm">
                  <p><strong>URL:</strong> {report.url}</p>
                  <p><strong>Status:</strong> {report.status}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uptime Report</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-gray-700 text-sm">
                <p><strong>Uptime %:</strong> {Number(report.uptime_percent).toFixed(2)}%</p>
                <p><strong>Total Downtime:</strong> {report.total_downtime} minutes</p>
                <p><strong>Last Checked:</strong> {new Date(Number(report.last_checked) / 1_000_000).toLocaleString()}</p>
                <p><strong>Checks Performed:</strong> {report.check_count}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-center text-gray-500">No report found for this website.</p>
        )}
      </div>
    </div>
  );
};

export default WebpageDashboard;
