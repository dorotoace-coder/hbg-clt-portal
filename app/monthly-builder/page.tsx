"use client";

import { useState } from "react";
import { BookText, Wand2, Loader2, CheckCircle2 } from "lucide-react";
import { saveDevotionalForm } from "@/app/actions/devotionals";

export default function MonthlyBuilderPage() {
  const [targetMonth, setTargetMonth] = useState("2026-05");
  const [theme, setTheme] = useState("");
  const [selectedPacks, setSelectedPacks] = useState<string[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 31 });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedPacks(options);
  };

  const getDaysInMonth = (yearMonth: string) => {
    if (!yearMonth) return 31;
    const [year, month] = yearMonth.split('-');
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  };

  const handleGenerate = async () => {
    if (selectedPacks.length === 0) {
      setError("Please select at least one doctrine pack.");
      return;
    }

    const daysCount = getDaysInMonth(targetMonth);
    setProgress({ current: 0, total: daysCount });
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const generatedTitles: string[] = [];

      for (let day = 1; day <= daysCount; day++) {
        const dateStr = `${targetMonth}-${day.toString().padStart(2, '0')}`;
        // Pick a pack round-robin
        const packForDay = selectedPacks[(day - 1) % selectedPacks.length];

        const response = await fetch("/api/generate-devotional", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetDate: dateStr,
            doctrinePack: packForDay,
            anchorCharacter: theme, 
            previouslyGeneratedTitles: generatedTitles.slice(-5) 
          }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || `Failed on day ${day}`);

        const data = result.data;
        if (data?.title) generatedTitles.push(data.title);

        const formState = {
          targetDate: dateStr,
          doctrinePack: packForDay,
          anchorCharacter: theme,
          anchorScripture: "",
          title: data.title || "Untitled",
          wordFocus: data.wordFocus || "",
          prayer: data.prayer || "",
          confession: data.confession || "",
          question1: data.quiz?.[0] || "",
          question2: data.quiz?.[1] || "",
          question3: data.quiz?.[2] || "",
        };

        const saveRes = await saveDevotionalForm(formState, 'draft');
        if (!saveRes.success) {
          throw new Error(`Failed to save draft for Day ${day}`);
        }

        setProgress((prev) => ({ ...prev, current: day }));
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during batch generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-hbg-blue-900">Monthly Edition Builder</h1>
          <p className="text-gray-500 mt-1">Generate a full month's worth of devotionals simultaneously.</p>
        </div>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md border border-red-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md border border-green-200 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Successfully generated and drafted all {progress.total} devotionals! Check the Archive.
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-hbg-blue-900 px-6 py-4">
            <h2 className="text-white font-bold flex items-center gap-2">
              <BookText className="h-5 w-5 text-hbg-gold-500" />
              Batch Configuration
            </h2>
          </div>
          
          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Month</label>
                <input 
                  type="month" 
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Theme</label>
                <input 
                  type="text" 
                  placeholder="e.g. Advancing in Settlement" 
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Doctrine Packs (Select multiple)</label>
                <select 
                  multiple 
                  value={selectedPacks}
                  onChange={handlePackChange}
                  className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500 bg-white" 
                  size={4}
                >
                  <option value="The Power of Settlement (Part 4)">The Power of Settlement (Part 4)</option>
                  <option value="Understanding Kingdom Rest">Understanding Kingdom Rest</option>
                  <option value="The Rules of Engagement">The Rules of Engagement</option>
                  <option value="Faith for the Next Level">Faith for the Next Level</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Command / Ctrl to select multiple packs to pull doctrine from.</p>
              </div>
            </div>

            <div className="bg-hbg-blue-50 p-4 rounded-lg border border-hbg-blue-100 flex items-start gap-4">
              <Wand2 className="h-6 w-6 text-hbg-blue-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-hbg-blue-900 text-sm">How Batch Generation Works</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  The engine will distribute the selected doctrine teachings across the entire month. It ensures all days have distinct titles, alternating scriptures from the source notes, and unique prayer points that align with the monthly theme.
                </p>
              </div>
            </div>

            {isGenerating && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm text-gray-600 font-medium">
                  <span>Generating Devotionals ({progress.current}/{progress.total})</span>
                  <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-hbg-gold-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(progress.current / progress.total) * 100}%` }}></div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200 flex justify-end">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || selectedPacks.length === 0} 
                className="bg-hbg-gold-500 text-hbg-blue-900 px-8 py-3 rounded-md font-bold shadow-sm disabled:opacity-50 flex items-center gap-2 transition-all hover:bg-hbg-gold-400"
              >
                {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
                {isGenerating ? "Processing Month..." : "Generate Full Month"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
