"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Lock } from "lucide-react";

export default function AccessPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-4 pt-20">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="bg-hbg-blue-900 p-6 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-hbg-gold-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Access Portal</h2>
          <p className="text-hbg-blue-50 mt-1 opacity-80 text-sm">Sign in to Editor or Viewer role</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500 transition-colors"
                placeholder="editor@hbg.org"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Pass (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500 transition-colors"
                placeholder="Enter your assigned passcode"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-hbg-blue-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-hbg-blue-800 focus:ring-4 focus:ring-hbg-blue-900/30 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? "Verifying..." : "Enter Portal"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
