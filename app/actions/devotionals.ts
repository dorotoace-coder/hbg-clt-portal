"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveDevotionalForm(formData: any, status: 'draft' | 'published') {
  try {
    const supabase = await createClient();
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Map the form data to DB columns
    const insertPayload = {
      date: formData.targetDate || new Date().toISOString().split('T')[0],
      title: formData.title || "Untitled Devotional",
      theme: formData.doctrinePack, 
      scripture: formData.anchorScripture,
      key_word: formData.keyWord,
      word_focus: formData.wordFocus,
      bible_story: formData.bibleInsight,
      prayer: formData.prayer,
      confession: formData.confession,
      action_point: formData.actionPoint,
      quiz_1: formData.question1,
      quiz_2: formData.question2,
      quiz_3: formData.question3,
      status: status,
    };

    const { data, error } = await supabase
      .from("devotionals")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return { success: false, error: error.message };
    }

    // Tell NextJS to recalculate the archive cache so the new row appears
    revalidatePath("/archive");

    return { success: true, data };
  } catch (err: any) {
    console.error("Action Error:", err);
    return { success: false, error: err.message || "Failed to save devotional." };
  }
}
