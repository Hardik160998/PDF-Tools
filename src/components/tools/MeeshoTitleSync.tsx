"use client";

import { useEffect } from 'react';
import { updateMeeshoToolTitles } from '@/lib/supabase';

export default function MeeshoTitleSync() {
  useEffect(() => {
    updateMeeshoToolTitles().catch(err => {
      console.error("Failed to update Meesho tool titles:", err);
    });
  }, []);

  return null;
}
