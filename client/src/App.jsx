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
    <div className="min-h-[100dvh] stage-canvas text-[#e5e7eb] flex flex-col">
      
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

      {/* Symmetrical Mission Control Stage Banner */}
      <section className="max-w-7xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col items-center text-center">
        
        {/* Eyebrow Micro Pill */}
        <div className="reveal-step-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] font-measurement tracking-[0.2em] uppercase shadow-[0_0_12px_rgba(245,158,11,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span>DIAGNOSTIC STUDIO / ANCHOR LINEAGE</span>
        </div>

        {/* Specular Gradient Title */}
        <h1 className="reveal-step-1 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent mt-3.5">
          Visual Diagnosis & Generative Lineage
        </h1>

        {/* Balanced Sub copy */}
        <p className="reveal-step-2 text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto mt-2.5 leading-relaxed font-sans">
          Eliminate blind regenerations. Pin your original anchor attempt, isolate structural bottlenecks across lighting and anatomy, and follow the dynamic drift spline keeping your trajectory on target.
        </p>

        {/* Symmetrical 4 Pod Telemetry Rail */}
        <div className="reveal-step-3 w-full grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          
          {/* Pod 1: Anchor Baseline */}
          <div className="bg-[#08090f] border border-white/10 rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1 shadow-sm">
            <span className="text-[10px] font-measurement text-gray-400 uppercase tracking-wider">
              ANCHOR BASELINE
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold font-measurement">
              {session?.attempts?.length > 0 ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  Attempt 1 (Locked)
                </span>
              ) : (
                <span className="text-gray-400 italic">Unpinned (Awaiting #1)</span>
              )}
            </div>
          </div>

          {/* Pod 2: Engine Mode */}
          <div className="bg-[#08090f] border border-white/10 rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1 shadow-sm">
            <span className="text-[10px] font-measurement text-gray-400 uppercase tracking-wider">
              DIAGNOSTIC ENGINE
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold font-measurement">
              {councilMode ? (
                <span className="text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  3 Advisor Council
                </span>
              ) : (
                <span className="text-gray-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-gray-400" />
                  Fast Single Critic
                </span>
              )}
            </div>
          </div>

          {/* Pod 3: Lineage Depth */}
          <div className="bg-[#08090f] border border-white/10 rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1 shadow-sm">
            <span className="text-[10px] font-measurement text-gray-400 uppercase tracking-wider">
              LINEAGE DEPTH
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200 font-measurement">
              <span>{session?.attempts?.length || 0}</span>
              <span className="text-gray-400 font-normal">COMMITTED</span>
            </div>
          </div>

          {/* Pod 4: Average Trajectory Drift */}
          <div className="bg-[#08090f] border border-white/10 rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1 shadow-sm">
            <span className="text-[10px] font-measurement text-gray-400 uppercase tracking-wider">
              TRAJECTORY DRIFT
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold font-measurement">
              {session?.attempts?.length > 1 ? (
                <span className="text-amber-400">
                  {Math.round(session.attempts.slice(1).reduce((acc, a) => acc + (a.drift_score || 0), 0) / (session.attempts.length - 1))}% DEFLECTION
                </span>
              ) : (
                <span className="text-emerald-400">Calibrated Baseline</span>
              )}
            </div>
          </div>

        </div>

      </section>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto w-full px-4 mb-4">
          <div className="bg-[#17090e] border border-rose-500/40 text-rose-200 text-xs px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Core Studio Symmetrical 3 Column Stage */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Wing: Attempt Input Console & Quick Presets (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
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

            {/* Quick Helper Scenarios Card with Double Bezel Architecture */}
            <div className="bezel-shell">
              <div className="bezel-core p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Preset Scenarios</span>
                  </span>
                  <span className="text-[10px] font-measurement text-gray-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    TEST SUITE
                  </span>
                </div>
                
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Test the diagnostic engine and dynamic drift line using preloaded creative attempts.
                </p>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  {SAMPLE_SCENARIOS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleLoadSample(sample)}
                      className="w-full text-left px-3.5 py-2 rounded-xl bg-[#07080c] hover:bg-white/5 border border-white/10 hover:border-amber-400/40 text-gray-300 text-xs flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <span className="font-medium group-hover:text-white transition-colors">{sample.title}</span>
                      <span className="text-amber-400/80 text-[10px] font-measurement px-2 py-0.5 rounded-full bg-white/5 border border-white/10">LOAD</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center Core: Diagnosis & Action Deck (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <CurrentCritique
              currentAttempt={currentAttempt}
              onUsePrompt={handleUsePrompt}
              onCommitNextAttempt={handleCommitNextAttempt}
              isAnchor={isAnchor}
              attemptIndex={currentAttempt?.order_index}
            />
          </div>

          {/* Right Wing: Lineage Trail & Dynamic Drift Spline (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <MemoryTrail
              attempts={session?.attempts || []}
              activeAttemptId={currentAttempt?.id}
              onSelectAttempt={(att) => setCurrentAttempt(att)}
            />
          </div>

        </div>
      </main>

      {/* Studio Telemetry Symmetrical Footer */}
      <footer className="border-t border-white/10 bg-[#050608] py-5 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2.5 font-measurement">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-gray-200 font-semibold tracking-wider">DRIFTLINE</span>
            <span className="text-gray-400">:</span>
            <span className="text-gray-400">NEVER REGENERATE BLIND</span>
          </div>
          
          <div className="flex items-center gap-5 text-[11px] font-measurement text-gray-400">
            <span>P1 CRITIQUE</span>
            <span>P2 MEMORY TRAIL</span>
            <span>P3 COUNCIL</span>
            <span>P4 CHAIN GUARD</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
