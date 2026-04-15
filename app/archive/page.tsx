import { Search, Filter, CalendarDays, ExternalLink, Download } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function ArchivePage() {
  const supabase = await createClient();
  const { data: devotionals, error } = await supabase
    .from("devotionals")
    .select("*")
    .order("date", { ascending: false });

  // Format date correctly
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-hbg-blue-900">Devotional Archive</h1>
            <p className="text-gray-500 mt-1">Browse, read, and export past CLT devotionals.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2 font-medium">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <Link href="/generate" className="bg-hbg-gold-500 text-hbg-blue-900 px-4 py-2 rounded-md hover:bg-hbg-gold-400 font-bold shadow-sm">
              New Devotional
            </Link>
          </div>
        </div>

        {/* Filters Box */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search by title, keyword, or characters..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hbg-blue-500 text-sm"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-hbg-blue-500 flex-1 sm:flex-none">
              <option>All Months</option>
              <option>April 2026</option>
              <option>March 2026</option>
            </select>
            <button className="bg-gray-100 p-2 rounded-lg text-gray-600 hover:bg-gray-200 border border-gray-200">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-hbg-blue-900 text-white">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Title & Scripture</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider hidden md:table-cell">Theme</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              
              {(!devotionals || devotionals.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No devotionals found.
                  </td>
                </tr>
              )}

              {devotionals?.map((dev: any) => (
                <tr key={dev.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <CalendarDays className={`h-4 w-4 mr-2 ${dev.status === 'published' ? 'text-hbg-gold-500' : 'text-gray-400'}`} />
                      {formatDate(dev.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-hbg-blue-900">{dev.title}</div>
                    <div className="text-sm text-gray-500">{dev.scripture || "No Scripture"}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="text-sm text-gray-900">{dev.theme || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dev.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {dev.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-hbg-blue-500 hover:text-hbg-blue-900 ml-4">Edit</button>
                    <button className="text-gray-400 hover:text-gray-900 ml-4"><ExternalLink className="h-4 w-4"/></button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
             <span>Showing {devotionals?.length || 0} entries</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50">Prev</button>
              <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
