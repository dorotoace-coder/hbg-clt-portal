import Link from "next/link";
import { BookOpen } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { signOutUser } from "@/app/actions/auth";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="bg-hbg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-hbg-gold-500" />
              <Link href="/" className="font-bold text-xl tracking-wide flex items-center">
                <span>HBG<span className="text-hbg-gold-500">-CLT</span> Portal</span>
              </Link>
            </div>
            
            {user && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4 h-full items-center">
                <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-hbg-blue-800 transition-colors">
                  Dashboard
                </Link>
                <Link href="/generate" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-hbg-blue-800 transition-colors">
                  Generate
                </Link>
                <Link href="/archive" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-hbg-blue-800 transition-colors">
                  Archive
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
               <form action={signOutUser}>
                 <button type="submit" className="text-sm font-bold text-red-300 hover:text-red-400 transition-colors px-4 py-2">
                   Sign Out ({user.email})
                 </button>
               </form>
            ) : (
              <Link
                href="/access"
                className="bg-hbg-gold-500 text-hbg-blue-900 hover:bg-hbg-gold-400 px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm"
              >
                Access Pass
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
