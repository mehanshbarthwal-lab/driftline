import React, { useState, useRef } from "react";
import { UploadCloud, Sparkles, Trash2, Users, Layers, ArrowUpRight, Check } from "lucide-react";

export default function CritiqueInput({
  prompt,
  setPrompt,
  image,
  setImage,
  onSubmitCritique,
  isLoading,
  councilMode,
  chainNodes,
  setChainNodes,
  showChainDrawer
}) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const processImageFile = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleNodePromptChange = (index, value) => {
    const updated = [...chainNodes];
    updated[index].prompt = value;
    setChainNodes(updated);
  };

  return (
    <div className="glow-card-wrapper group/card">
      <div className="glow-card-underlay glow-card-underlay-amber" />
      <div className="glow-border-card p-5 sm:p-6 flex flex-col gap-5">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-white/8 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sora text-xs font-bold uppercase tracking-wider text-white">
                Attempt Console
              </span>
              <span className="text-[10px] font-measurement glow-pill-amber px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                INPUT
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Upload generative output and corresponding prompt
            </p>
          </div>

          {image && (
            <button
              onClick={() => setImage(null)}
              className="text-xs text-gray-400 hover:text-rose-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
              title="Clear active image"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Image Dropzone with Cyber HUD Targeting */}
        {!image ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border border-dashed rounded-2xl p-7 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 overflow-hidden ${
              dragActive
                ? "border-amber-400 bg-amber-400/10 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                : "border-white/15 hover:border-amber-400/50 bg-[#06070c] hover:bg-[#090b12]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-400/15 to-transparent flex items-center justify-center text-amber-400 border border-amber-400/30 shadow-[0_0_16px_rgba(245,158,11,0.2)] group-hover/card:scale-105 transition-transform">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-200">
                Click or drag generative image here
              </p>
              <p className="text-[11px] text-gray-400 mt-1 font-measurement">
                PNG / JPG / WebP up to 25MB
              </p>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-amber-400/30 bg-[#040507] group shadow-[0_0_24px_rgba(245,158,11,0.12)]">
            <img
              src={image}
              alt="Attempt preview"
              className="w-full max-h-60 object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
            />
            
            {/* Cyber HUD Scanline and Reticle Frame */}
            <div className="absolute inset-0 pointer-events-none hud-inspection-overlay opacity-60" />
            <div className="absolute top-2 left-2 text-[9px] font-measurement uppercase tracking-wider text-amber-400/80 bg-black/70 px-2 py-0.5 rounded border border-amber-400/30 backdrop-blur-sm">
              OPTICAL_INPUT: LOCKED
            </div>
            <div className="absolute bottom-2 right-2 text-[9px] font-measurement uppercase tracking-wider text-emerald-400/80 bg-black/70 px-2 py-0.5 rounded border border-emerald-400/30 backdrop-blur-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              READY
            </div>

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium border border-white/30 cursor-pointer backdrop-blur-md transition-all shadow-[0_0_16px_rgba(255,255,255,0.1)]"
              >
                Replace Image
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* Generation Prompt Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <label className="text-gray-300 font-medium">Generation Prompt</label>
            <span className="text-gray-400 font-measurement text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              {prompt.length} CHARS
            </span>
          </div>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste exact prompt parameters used for this creative generation..."
            className="w-full bg-[#07080c] border border-white/10 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 rounded-xl p-3.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none transition-all resize-none leading-relaxed font-sans"
          />
        </div>

        {/* Node Chain Inspector Drawer */}
        {showChainDrawer && (
          <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-200">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Multi Node Pipeline Chain</span>
              </div>
              <span className="text-[10px] font-measurement text-gray-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                GUARD
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Define adjacent node prompts to detect contradictory guidance across generator and upscaler passes
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {chainNodes.map((node, index) => (
                <div key={node.id} className="bg-[#07080c] border border-white/10 rounded-xl p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-300">
                      Node {index + 1}: {node.name}
                    </span>
                    <span className="text-[10px] font-measurement text-amber-400/90 uppercase">
                      {node.type}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={node.prompt}
                    onChange={(e) => handleNodePromptChange(index, e.target.value)}
                    placeholder={`Parameters for ${node.name}...`}
                    className="bg-[#050608] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Execution Button with Button in Button Architecture */}
        <button
          onClick={onSubmitCritique}
          disabled={isLoading || !prompt.trim() || !image}
          className={`group btn-pill-primary w-full text-xs transition-all ${
            isLoading
              ? "bg-white/10 text-gray-400 cursor-not-allowed border border-white/10"
              : !prompt.trim() || !image
              ? "bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
              : councilMode
              ? "bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-200 border border-amber-500/50 shadow-[0_0_24px_rgba(245,158,11,0.2)] cursor-pointer"
              : "bg-gradient-to-r from-white/15 to-white/10 hover:from-white/20 hover:to-white/15 text-white border border-white/20 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.06)]"
          }`}
        >
          <span className="font-semibold tracking-wide">
            {isLoading
              ? "Running Deep Visual Diagnosis..."
              : councilMode
              ? "Run Council Deliberation (3 Advisors)"
              : "Run Visual Diagnosis"}
          </span>

          <div className="btn-icon-wrapper">
            {isLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : councilMode ? (
              <Users className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-200 group-hover:text-white" />
            )}
          </div>
        </button>

      </div>
    </div>
  );
}
