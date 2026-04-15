import { BookText, FileText, ArrowUpRight, Plus, Download, History, LogOut } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      {/* Header section with active themes */}
      <header className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-hbg-blue-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, {user?.user_metadata?.full_name || user?.email || "Editor"}</p>
            </div>
            
            <div className="flex bg-hbg-blue-50 border border-hbg-blue-900/10 rounded-lg p-3">
              <div className="pr-4 border-r border-hbg-blue-900/10">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Year Theme</p>
                <p className="text-sm font-bold text-hbg-blue-900">Our Year of Rest and Divine Settlement</p>
              </div>
              <div className="pl-4">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Month Theme</p>
                <p className="text-sm font-bold text-hbg-blue-900">Advancing in Divine Settlement</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
            <div className="bg-hbg-blue-900 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-bold text-white flex items-center gap-2">
                Quick Actions
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/generate" className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-hbg-gold-500 hover:bg-hbg-blue-50 transition-colors group">
                <div className="bg-hbg-blue-100 p-3 rounded-md text-hbg-blue-900 group-hover:bg-hbg-blue-900 group-hover:text-hbg-gold-500 transition-colors">
                  <Plus className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Generate Devotional</h3>
                  <p className="text-sm text-gray-500">Create today's CLT daily</p>
                </div>
              </Link>
              
              <Link href="/monthly-builder" className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-hbg-gold-500 hover:bg-hbg-blue-50 transition-colors group">
                <div className="bg-hbg-blue-100 p-3 rounded-md text-hbg-blue-900 group-hover:bg-hbg-blue-900 group-hover:text-hbg-gold-500 transition-colors">
                  <BookText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Monthly Builder</h3>
                  <p className="text-sm text-gray-500">Generate a full month batch</p>
                </div>
              </Link>

              <Link href="/doctrine-packs" className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-hbg-gold-500 hover:bg-hbg-blue-50 transition-colors group">
                <div className="bg-hbg-blue-100 p-3 rounded-md text-hbg-blue-900 group-hover:bg-hbg-blue-900 group-hover:text-hbg-gold-500 transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Upload Doctrine</h3>
                  <p className="text-sm text-gray-500">Update sermon notes</p>
                </div>
              </Link>

              <Link href="/archive" className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-hbg-gold-500 hover:bg-hbg-blue-50 transition-colors group">
                <div className="bg-hbg-blue-100 p-3 rounded-md text-hbg-blue-900 group-hover:bg-hbg-blue-900 group-hover:text-hbg-gold-500 transition-colors">
                  <History className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">View Archive</h3>
                  <p className="text-sm text-gray-500">Browse previous entries</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Status Sidebar */}
          <div className="space-y-6">
            {/* Latest Doctrine Pack */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 object-fill">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                Latest Doctrine Pack
                <Link href="/doctrine-packs" className="text-hbg-blue-500 hover:text-hbg-blue-800"><ArrowUpRight className="h-4 w-4" /></Link>
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Uploaded April 1, 2026</p>
                <p className="text-sm font-bold text-hbg-blue-900">The Power of Settlement (Part 4)</p>
                <p className="text-xs text-gray-600 mt-2 line-clamp-2">Understanding the dimensions of divine settlement through absolute rest in His promises...</p>
              </div>
            </div>
            
            {/* Recent Publications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Recent Devotionals</h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">April 3, 2026</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">Published</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">April 2, 2026</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">Published</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">April 1, 2026</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">Published</span>
                </li>
              </ul>
              
              <button className="w-full mt-6 bg-gray-50 text-hbg-blue-900 font-medium text-sm py-2 rounded border border-gray-200 hover:bg-hbg-blue-50">
                Export Month to PDF
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
