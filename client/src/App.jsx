import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import CritiqueInput from "./components/CritiqueInput.jsx";
import CurrentCritique from "./components/CurrentCritique.jsx";
import MemoryTrail from "./components/MemoryTrail.jsx";
import { SAMPLE_SCENARIOS } from "./data/samples.js";
import { Compass, Sparkles, AlertCircle } from "lucide-react";

export default function App() {
  const [sessionId, setSessionId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("session");
    if (fromUrl) return fromUrl;
    const fromStorage = localStorage.getItem("driftline_session_id");
    if (fromStorage) return fromStorage;
    const newId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    localStorage.setItem("driftline_session_id", newId);
    return newId;
  });

  const [session, setSession] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [councilMode, setCouncilMode] = useState(false);
  const [showChainDrawer, setShowChainDrawer] = useState(false);
  const [chainNodes, setChainNodes] = useState([
    { id: "node1", name: "Base Generator", type: "generation", prompt: "" },
    { id: "node2", name: "Upscaler Pass", type: "enhancement", prompt: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync session ID with URL search param
  useEffect(() => {
    if (sessionId) {
      const url = new URL(window.location);
      url.searchParams.set("session", sessionId);
      window.history.replaceState({}, "", url);
      localStorage.setItem("driftline_session_id", sessionId);
      fetchSessionData(sessionId);
    }
  }, [sessionId]);

  const fetchSessionData = async (id) => {
    try {
      const res = await fetch(`/api/sessions/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          setSession(data.session);
          if (data.session.attempts.length > 0 && !currentAttempt) {
            // Focus latest attempt by default
            setCurrentAttempt(data.session.attempts[data.session.attempts.length - 1]);
          }
        }
      }
    } catch (err) {
      console.warn("Session retrieval note:", err.message);
    }
  };

  const handleResetSession = () => {
    const newId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    setSessionId(newId);
    setSession({ id: newId, attempts: [], first_attempt_id: null });
    setCurrentAttempt(null);
    setPrompt("");
    setImage(null);
    setErrorMessage(null);
  };

  const handleLoadSample = (sample) => {
    setPrompt(sample.prompt);
    setImage(sample.image);
    if (sample.chainNodes) {
      setChainNodes(sample.chainNodes);
    }
    setErrorMessage(null);
  };

  const handleSubmitCritique = async () => {
    if (!prompt.trim() || !image) {
      setErrorMessage("Please specify both a prompt and an image before running diagnosis.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        prompt: prompt.trim(),
        image: image,
        mode: councilMode ? "council" : "single",
        chain_nodes: showChainDrawer ? chainNodes : []
      };

      const res = await fetch(`/api/critique/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Diagnosis failed");
      }

      const data = await res.json();
      setCurrentAttempt(data.attempt);
      setSession(data.session);

    } catch (err) {
      console.error("Critique submission error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during diagnosis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsePrompt = (rewrittenPrompt) => {
    if (rewrittenPrompt) {
      setPrompt(rewrittenPrompt);
    }
  };

  const handleCommitNextAttempt = () => {
    if (currentAttempt?.suggested_prompt) {
      setPrompt(currentAttempt.suggested_prompt);
    }
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isAnchor = session?.attempts?.length > 0 && currentAttempt?.id === session.attempts[0]?.id;

  return (
    <div className="min-h-screen bg-[#060709] text-[#e5e7eb] flex flex-col stage-grid">
      
      {/* Studio Header */}
      <Header
        sessionId={sessionId}
        councilMode={councilMode}
        setCouncilMode={setCouncilMode}
        onResetSession={handleResetSession}
        onLoadSample={handleLoadSample}
        showChainDrawer={showChainDrawer}
        setShowChainDrawer={setShowChainDrawer}
        attemptCount={session?.attempts?.length || 0}
      />

      {/* Stage Readout Subheader */}
      <div className="border-b border-white/10 bg-[#090b0f]/80 backdrop-blur-sm px-4 lg:px-8 py-[min(3vh,1.25rem)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <h1 className="text-base font-semibold tracking-tight text-white">
                Driftline Studio Console
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
              Never regenerate blind. Pin your original anchor attempt, diagnose visual bottlenecks across lighting, anatomy, and style, and monitor the dynamic drift spline keeping your lineage on target.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <div className="bg-[#0e1117] border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
              <span className="text-gray-400 font-measurement">ANCHOR STATUS:</span>
              {session?.attempts?.length > 0 ? (
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  Locked on Attempt 1
                </span>
              ) : (
                <span className="text-gray-400 italic">Unpinned (Awaiting Attempt 1)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 pt-4">
          <div className="bg-[#190a0e] border border-rose-500/40 text-rose-200 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Core Studio 3 Column Stage */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Attempt Input & Presets (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <CritiqueInput
              prompt={prompt}
              setPrompt={setPrompt}
              image={image}
              setImage={setImage}
              onSubmitCritique={handleSubmitCritique}
              isLoading={isLoading}
              councilMode={councilMode}
              chainNodes={chainNodes}
              setChainNodes={setChainNodes}
              showChainDrawer={showChainDrawer}
            />

            {/* Quick Helper Scenarios Card */}
            <div className="instrument-card rounded-xl p-4 flex flex-col gap-2 text-xs">
              <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gray-400" />
                <span>Preset Scenarios</span>
              </span>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Test the diagnostic loop and dynamic drift line using preloaded creative attempts.
              </p>
              <div className="grid grid-cols-1 gap-1.5 mt-1">
                {SAMPLE_SCENARIOS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleLoadSample(sample)}
                    className="w-full text-left px-2.5 py-1.5 rounded-md bg-[#080a0e] hover:bg-white/5 border border-white/10 text-gray-300 text-[11px] flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>{sample.title}</span>
                    <span className="text-gray-400 text-[10px] font-measurement">LOAD</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column: Diagnosis & Action Deck (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <CurrentCritique
              currentAttempt={currentAttempt}
              onUsePrompt={handleUsePrompt}
              onCommitNextAttempt={handleCommitNextAttempt}
              isAnchor={isAnchor}
              attemptIndex={currentAttempt?.order_index}
            />
          </div>

          {/* Right Column: Memory Trail & Dynamic Drift Line (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <MemoryTrail
              attempts={session?.attempts || []}
              activeAttemptId={currentAttempt?.id}
              onSelectAttempt={(att) => setCurrentAttempt(att)}
            />
          </div>

        </div>
      </main>

      {/* Studio Telemetry Footer */}
      <footer className="border-t border-white/10 bg-[#060709] py-4 px-4 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-2 font-measurement">
            <span className="text-gray-200 font-semibold">DRIFTLINE</span>
            <span>:</span>
            <span>NEVER REGENERATE BLIND</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-measurement text-gray-400">
            <span>P1: CRITIQUE</span>
            <span>P2: MEMORY TRAIL</span>
            <span>P3: COUNCIL</span>
            <span>P4: CHAIN GUARD</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
