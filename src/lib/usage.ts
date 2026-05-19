/**
 * Client-side utility for subscription plan usage verification
 */
export async function verifyAndIncrementUsage(supabaseClient: any): Promise<{ allowed: boolean; error?: string }> {
  try {
    const authClient = supabaseClient?.auth;
    if (!authClient || typeof authClient.getSession !== "function") {
      return { allowed: true }; // Fail-open
    }

    const { data: { session } } = await authClient.getSession();
    if (!session) {
      // If user is not logged in, we let them proceed but warn or limit locally.
      // For this implementation, logged-out users are treated as basic, but we let them proceed 
      // to avoid blocking guests. Logged-in basic users will have strict server tracking.
      return { allowed: true };
    }

    const token = session.access_token;
    const response = await fetch("/api/usage/increment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status === 403) {
      const data = await response.json();
      return { allowed: false, error: data.error };
    }

    if (!response.ok) {
      console.warn("Usage limit server warning:", response.statusText);
      return { allowed: true }; // Fail-open
    }

    return { allowed: true };
  } catch (error) {
    console.error("Exception in verifyAndIncrementUsage:", error);
    return { allowed: true }; // Fail-open
  }
}
