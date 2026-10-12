import React, { useState } from "react";
import { AlertTriangle, Key, ExternalLink, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

export default function ConfigBanner() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const envTemplate = `VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-amber-950/80 border-b border-amber-500/40 text-amber-100 text-sm p-3.5 px-4 z-40 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-amber-200">Firebase Setup Required:</span>{" "}
            Please configure your Firebase credentials in <code className="bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-300 font-mono text-xs">.env</code> locally or in the Vercel Project Settings.
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-medium transition-colors"
          >
            <Key className="w-3.5 h-3.5" />
            {expanded ? "Hide Guide" : "Setup Instructions"}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-amber-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-200/90 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-100 uppercase tracking-wider text-[11px]">
              Step 1: Firebase Console Setup
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-amber-300/80">
              <li>
                Open the{" "}
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-amber-200 hover:text-white inline-flex items-center gap-0.5"
                >
                  Firebase Console <ExternalLink className="w-3 h-3 inline" />
                </a>{" "}
                and click <strong>Create a project</strong>.
              </li>
              <li>Go to <strong>Authentication</strong> &rarr; <strong>Sign-in method</strong> &rarr; enable <strong>Email/Password</strong> (and Google optionally).</li>
              <li>Go to <strong>Firestore Database</strong> &rarr; <strong>Create database</strong> (start in production or test mode).</li>
              <li>Under <strong>Project settings</strong> &rarr; <strong>General</strong>, add a <strong>Web App (&lt;/&gt;)</strong>.</li>
              <li>Copy the generated <code className="bg-amber-900/60 px-1 rounded">firebaseConfig</code> object.</li>
            </ol>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-amber-100 uppercase tracking-wider text-[11px]">
                Step 2: Environment Variables
              </h4>
              <button
                onClick={copyTemplate}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy Keys"}
              </button>
            </div>
            <pre className="p-2.5 bg-black/40 rounded-lg font-mono text-[11px] text-amber-200 overflow-x-auto border border-amber-500/20">
              {envTemplate}
            </pre>
            <p className="text-[11px] text-amber-300/70">
              For Vercel deployment: Add these exact keys under <strong>Project Settings &rarr; Environment Variables</strong> in your Vercel Dashboard.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
