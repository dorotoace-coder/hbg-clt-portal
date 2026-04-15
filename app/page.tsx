import Link from "next/link";
import { ArrowRight, BookOpen, Clock, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-hbg-blue-900 text-white flex-1 flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            The Devotional Engine for <span className="text-hbg-gold-500">HBG-CLT</span>
          </h1>
          <p className="text-xl md:text-2xl text-hbg-blue-50 mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Live devotional generation preserving Pastor Amos's doctrine, formatting, and stylistic customization.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/access"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-md bg-hbg-gold-500 text-hbg-blue-900 hover:bg-hbg-gold-400 transition-all shadow-lg"
            >
              Access Portal <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What is the CLT System?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              A structured content operating system that transforms sermons into potent, bite-sized daily devotionals, complete with scriptures, prayer points, and quizzes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-hbg-blue-50 p-8 rounded-xl border border-hbg-blue-900/10 shadow-sm transition-transform hover:scale-105">
              <div className="bg-hbg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-hbg-gold-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Doctrinal Integrity</h3>
              <p className="text-gray-600">
                Pulls directly from approved doctrine packs and sermons to ensure 100% alignment with Pastor Amos.
              </p>
            </div>

            <div className="bg-hbg-blue-50 p-8 rounded-xl border border-hbg-blue-900/10 shadow-sm transition-transform hover:scale-105">
              <div className="bg-hbg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-hbg-gold-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Rapid Generation</h3>
              <p className="text-gray-600">
                Generate a full daily or monthly devotional series in minutes using the structured generator.
              </p>
            </div>

            <div className="bg-hbg-blue-50 p-8 rounded-xl border border-hbg-blue-900/10 shadow-sm transition-transform hover:scale-105">
              <div className="bg-hbg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-hbg-gold-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Distribution</h3>
              <p className="text-gray-600">
                Export to printable PDFs, copy WhatsApp-ready versions, or read directly in the member portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-10 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} HBG Ministry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
