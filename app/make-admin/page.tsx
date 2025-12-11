"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function MakeAdminPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user, isLoaded } = useUser();

  const makeAdmin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch("/api/make-admin", {
        method: "POST",
      });
      const data = await res.json();
      setResult(data);
      
      // Reload after 2 seconds if successful
      if (data.success) {
        setTimeout(() => {
          window.location.href = "/admin";
        }, 2000);
      }
    } catch (error) {
      setResult({ 
        error: "Network error - Failed to connect to API",
        details: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Make Yourself Admin</CardTitle>
              <CardDescription>
                Grant admin access to your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current User Info */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Current User Info:</p>
            <div className="bg-muted p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-mono">{user?.emailAddresses[0]?.emailAddress || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono text-xs">{user?.id || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Role:</span>
                  <span className={`font-semibold ${user?.publicMetadata?.role === 'admin' ? 'text-green-600' : 'text-orange-600'}`}>
                    {(user?.publicMetadata?.role as string) || "user"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={makeAdmin} 
            disabled={loading || user?.publicMetadata?.role === 'admin'} 
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Making you admin...
              </>
            ) : user?.publicMetadata?.role === 'admin' ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                You are already an admin
              </>
            ) : (
              <>
                <Shield className="mr-2 h-5 w-5" />
                Grant Admin Access
              </>
            )}
          </Button>

          {/* Result Display */}
          {result && (
            <div className={`p-4 rounded-lg border-2 ${
              result.success 
                ? "bg-green-50 border-green-500 dark:bg-green-950" 
                : "bg-red-50 border-red-500 dark:bg-red-950"
            }`}>
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    {result.success ? "Success!" : "Error"}
                  </p>
                  <p className="text-sm mt-1">
                    {result.message || result.error}
                  </p>
                  {result.success && (
                    <p className="text-xs mt-2 text-muted-foreground">
                      Redirecting to admin dashboard in 2 seconds...
                    </p>
                  )}
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer hover:underline">
                        Technical Details
                      </summary>
                      <pre className="text-xs mt-2 bg-black/10 dark:bg-white/10 p-2 rounded overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-semibold">How it works:</p>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Click &quot;Grant Admin Access&quot; to update your role in the database</li>
              <li>Your role will be synced to Clerk automatically</li>
              <li>You&apos;ll be redirected to the admin dashboard</li>
              <li>Admin buttons will appear in the navigation</li>
            </ol>
            
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 rounded-lg mt-4">
              <p className="text-xs text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> If you were the first user to sign up, you should already be an admin. 
                If the button doesn&apos;t work, make sure you&apos;re signed in and have a stable internet connection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
