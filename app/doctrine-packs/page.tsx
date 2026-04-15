import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function DoctrinePacksPage() {
  return (
    <div className="flex-1 bg-gray-50 flex flex-col py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-hbg-blue-900">Doctrine Pack Manager</h1>
          <p className="text-gray-500 mt-1">Upload sermon notes and transcripts to feed the Devotional Engine.</p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-hbg-blue-900 px-6 py-4">
            <h2 className="text-white font-bold flex items-center gap-2">
              <Upload className="h-5 w-5 text-hbg-gold-500" />
              Upload New Sermon / Doctrine
            </h2>
          </div>
          
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sermon Title</label>
                <input type="text" placeholder="e.g. The Rules of Settlement" className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Preached</label>
                <input type="date" className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" />
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 font-medium mb-1">Drag and drop transcription or notes file</p>
              <p className="text-xs text-gray-500 mb-4">Supported formats: .txt, .docx, .md</p>
              <button className="bg-hbg-blue-100 text-hbg-blue-900 px-4 py-2 rounded-md font-medium text-sm">Browse Files</button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Or paste transcript directly</label>
              <textarea rows={6} className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" placeholder="Paste sermon content here..." />
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button className="bg-hbg-blue-900 text-white px-6 py-2 rounded-md font-bold hover:bg-hbg-blue-800 transition-colors shadow-sm">
                Process to Doctrine Pack
              </button>
            </div>
          </div>
        </div>

        {/* Existing Packs List */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Doctrine Packs</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg text-green-700">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-hbg-blue-900">The Power of Settlement (Part 4)</h3>
                <div className="flex gap-4 text-xs text-gray-500 mt-1">
                  <span>Preached: Mar 29, 2026</span>
                  <span>Processed: Apr 1, 2026</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Active
              </span>
              <button className="text-sm font-medium text-hbg-blue-500 hover:text-hbg-blue-700">View Details</button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-3 rounded-lg text-gray-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-hbg-blue-900">Understanding Kingdom Rest</h3>
                <div className="flex gap-4 text-xs text-gray-500 mt-1">
                  <span>Preached: Mar 22, 2026</span>
                  <span>Processed: Mar 25, 2026</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                Archive
              </span>
              <button className="text-sm font-medium text-hbg-blue-500 hover:text-hbg-blue-700">View Details</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
