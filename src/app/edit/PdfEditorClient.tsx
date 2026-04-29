"use client";

import dynamic from "next/dynamic";

const PdfEditor = dynamic(() => import("./PdfEditor"), { ssr: false });

export default function PdfEditorClient() {
  return <PdfEditor />;
}
