"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function SyncAdminPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const syncRole = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sync-admin", {
        method: "POST",
      });
      const data = await res.json();
      setResult(data);
      
      // Reload after 2 seconds to see the updated role
      if (data.success) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setResult({ error: "Failed to sync role" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Sync Admin Role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Current User Info:</p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-xs overflow-auto">
              {JSON.stringify({
                id: user?.id,
                email: user?.emailAddresses[0]?.emailAddress,
                currentRole: user?.publicMetadata?.role || "not set",
              }, null, 2)}
            </pre>
          </div>

          <Button onClick={syncRole} disabled={loading} className="w-full">
            {loading ? "Syncing..." : "Sync Role from Database to Clerk"}
          </Button>

          {result && (
            <div className={`p-4 rounded ${result.success ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
              {result.success && (
                <p className="mt-2 text-sm font-semibold">
                  ✅ Success! Page will reload in 2 seconds...
                </p>
              )}
            </div>
          )}

          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-semibold mb-2">Instructions:</p>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>If you&apos;re the first user, you should already be admin in the database</li>
              <li>Click &quot;Sync Role from Database to Clerk&quot; to update your Clerk profile</li>
              <li>The page will reload and admin buttons should appear</li>
              <li>Check the browser console for detailed user data</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
