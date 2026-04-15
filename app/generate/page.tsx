"use client";

import { useState } from "react";
import { HardDriveDownload, Sparkles, Send, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveDevotionalForm } from "@/app/actions/devotionals";

type DevotionalFormState = {
  targetDate: string;
  doctrinePack: string;
  anchorCharacter: string;
  anchorScripture: string;
  title: string;
  wordFocus: string;
  prayer: string;
  confession: string;
  question1: string;
  question2: string;
  question3: string;
};

export default function GenerateDevotional() {
  const router = useRouter();

  // Thematic Context
  const [sourceType, setSourceType] = useState("doctrine_pack");
  const [rawMaterialText, setRawMaterialText] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [doctrinePack, setDoctrinePack] = useState("");
  const [anchorCharacter, setAnchorCharacter] = useState("");
  const [anchorScripture, setAnchorScripture] = useState("");

  // Generated Content
  const [title, setTitle] = useState("");
  const [wordFocus, setWordFocus] = useState("");
  const [prayer, setPrayer] = useState("");
  const [confession, setConfession] = useState("");

  // Quizzes
  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question3, setQuestion3] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAiAutoFill = async () => {
    if (sourceType === "doctrine_pack" && (!doctrinePack || doctrinePack === "")) {
      setError("Please select a Doctrine Pack before generating.");
      return;
    }
    if ((sourceType === "sermon" || sourceType === "song") && !rawMaterialText.trim()) {
      setError("Please paste your Sermon Notes or Song Lyrics to proceed.");
      return;
    }

    setIsGenerating(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await fetch("/api/generate-devotional", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceType,
          rawMaterialText,
          targetDate,
          doctrinePack: sourceType === "doctrine_pack" ? doctrinePack : "Custom Source",
          anchorCharacter,
          anchorScripture,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate devotional");
      }

      if (result.success && result.data) {
        setTitle(result.data.title || "");
        setWordFocus(result.data.wordFocus || "");
        setPrayer(result.data.prayer || "");
        setConfession(result.data.confession || "");
        
        if (result.data.quiz && Array.isArray(result.data.quiz)) {
          setQuestion1(result.data.quiz[0] || "");
          setQuestion2(result.data.quiz[1] || "");
          setQuestion3(result.data.quiz[2] || "");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setError("");
    setSuccessMsg("");
    setIsSaving(true);
    
    const currentFormState: DevotionalFormState = {
      targetDate,
      doctrinePack: sourceType === "doctrine_pack" ? doctrinePack : `${sourceType === 'sermon' ? 'Sermon' : 'Song'} Reference`,
      anchorCharacter,
      anchorScripture,
      title,
      wordFocus,
      prayer,
      confession,
      question1,
      question2,
      question3,
    };

    try {
      const result = await saveDevotionalForm(currentFormState, status);
      if (result.success) {
        if (status === 'published') {
          router.push('/archive');
        } else {
          setSuccessMsg("Draft saved successfully!");
        }
      } else {
        setError(result.error || "Failed to save the devotional.");
      }
    } catch (err: any) {
       setError("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-hbg-blue-900">CLT Generator</h1>
          <p className="text-gray-500 mt-1">Create a new daily devotional derived from active doctrine packs, sermons, or songs.</p>
        </div>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md border border-red-200">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md border border-green-200">
            {successMsg}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-hbg-blue-900 px-6 py-4 flex items-center justify-between">
            <h2 className="text-white font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-hbg-gold-500" />
              Generator Form
            </h2>
          </div>
          
          <form className="p-6 md:p-8 space-y-8">
            {/* Context Inputs */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">1. Source Context</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Material Type</label>
                  <select 
                    value={sourceType} 
                    onChange={(e) => setSourceType(e.target.value)} 
                    className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500 bg-white"
                  >
                    <option value="doctrine_pack">Pre-installed Doctrine Pack</option>
                    <option value="sermon">Raw Sermon Transcript / Notes</option>
                    <option value="song">Song Lyrics / Theme</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Date <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" />
                </div>

                {sourceType === "doctrine_pack" ? (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctrine Pack</label>
                    <select value={doctrinePack} onChange={(e) => setDoctrinePack(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500 bg-white">
                      <option value="">Select a Sermon / Doctrine Pack</option>
                      <option value="The Power of Settlement (Part 4)">The Power of Settlement (Part 4)</option>
                      <option value="Understanding Kingdom Rest">Understanding Kingdom Rest</option>
                      <option value="The Rules of Engagement">The Rules of Engagement</option>
                      <option value="Faith for the Next Level">Faith for the Next Level</option>
                    </select>
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {sourceType === "sermon" ? "Paste Sermon Notes / Transcript" : "Paste Song Lyrics / Theme Notes"}
                    </label>
                    <textarea 
                      rows={5} 
                      value={rawMaterialText} 
                      onChange={(e) => setRawMaterialText(e.target.value)} 
                      placeholder={sourceType === "sermon" ? "Paste your exact sermon transcription here..." : "Paste your song lyrics here..."}
                      className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" 
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bible Character / Concept <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" placeholder="e.g. David, Joseph, Peter" value={anchorCharacter} onChange={(e) => setAnchorCharacter(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Anchor Scripture <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input type="text" placeholder="e.g. Psalms 23:1-2" value={anchorScripture} onChange={(e) => setAnchorScripture(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" />
                </div>
              </div>
            </div>

            {/* Generated Content Body */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">2. Devotional Content</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" placeholder="Devotional Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Word Focus (Main Exhortation)</label>
                  <textarea rows={6} placeholder="The main teaching..." value={wordFocus} onChange={(e) => setWordFocus(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prayer</label>
                  <textarea rows={3} placeholder="Lord, I pray that..." value={prayer} onChange={(e) => setPrayer(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confession / Declaration</label>
                  <textarea rows={2} placeholder="I declare that I am stepping into divine settlement..." value={confession} onChange={(e) => setConfession(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" />
                </div>
              </div>
            </div>

            {/* Quizzes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">3. Quiz Section</h3>
              <div className="space-y-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question 1</label>
                  <input type="text" value={question1} onChange={(e) => setQuestion1(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question 2</label>
                  <input type="text" value={question2} onChange={(e) => setQuestion2(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question 3</label>
                  <input type="text" value={question3} onChange={(e) => setQuestion3(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 focus:ring-hbg-blue-500 focus:border-hbg-blue-500" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-4">
              <button 
                type="button" 
                onClick={() => handleSave('draft')}
                disabled={isSaving || isGenerating}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2 font-medium disabled:opacity-50">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <HardDriveDownload className="h-4 w-4" />} 
                Save Draft
              </button>
              <button 
                type="button" 
                onClick={handleAiAutoFill}
                disabled={isGenerating || isSaving}
                className="px-6 py-2 bg-hbg-blue-100 text-hbg-blue-900 rounded-md hover:bg-hbg-blue-200 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} 
                {isGenerating ? "Generating..." : "AI Auto-Fill"}
              </button>
              <button 
                type="button" 
                onClick={() => handleSave('published')}
                disabled={isSaving || isGenerating}
                className="px-6 py-2 bg-hbg-gold-500 text-hbg-blue-900 rounded-md hover:bg-hbg-gold-400 flex items-center justify-center gap-2 font-bold shadow-sm disabled:opacity-50">
                 {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                 Publish Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
