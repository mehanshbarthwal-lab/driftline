import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle, Trash2, Sliders, ChevronDown, ChevronUp } from "lucide-react";

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
    <div className="bg-[#121418] border border-[#232730] rounded-xl p-5 shadow-lg flex flex-col gap-4">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Attempt Input
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Supply current prompt and generated image
          </p>
        </div>

        {image && (
          <button
            onClick={() => setImage(null)}
            className="text-xs text-gray-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            title="Clear image"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Image Dropzone */}
      {!image ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all ${
            dragActive
              ? "border-cyan-400 bg-cyan-950/20"
              : "border-[#2d333e] hover:border-[#404856] bg-[#16191f]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-[#1e232c] flex items-center justify-center text-cyan-400 border border-[#2d3440]">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-gray-200">
              Click to browse or drop generated image
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Supports PNG, JPG, WebP up to 25MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-[#2d333f] bg-[#0a0b0d] group">
          <img
            src={image}
            alt="Current attempt preview"
            className="w-full max-h-56 object-contain mx-auto bg-black/50"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-md bg-[#1f242d] hover:bg-[#2a313d] text-white text-xs font-medium border border-[#3b4352]"
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

      {/* Prompt Editor */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="text-gray-300 font-medium">Generation Prompt</label>
          <span className="text-gray-400 font-mono text-[11px]">
            {prompt.length} characters
          </span>
        </div>
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste exact prompt used for this generation..."
          className="w-full bg-[#16191f] border border-[#282e38] focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 rounded-lg p-3 text-xs text-gray-200 placeholder-gray-400 focus:outline-none transition-all resize-none leading-relaxed"
        />
      </div>

      {/* Simulated Multi Node Pipeline Drawer (Phase 4) */}
      {showChainDrawer && (
        <div className="bg-[#161920] border border-[#282f3a] rounded-lg p-3.5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Node Chain Simulator
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-400 border border-cyan-800/40">
              Phase 4
            </span>
          </div>
          <p className="text-[11px] text-gray-400">
            Define sequential pipeline steps to detect contradictory instructions across connected generative nodes.
          </p>

          <div className="flex flex-col gap-2.5">
            {chainNodes.map((node, idx) => (
              <div key={node.id} className="bg-[#1a1d25] border border-[#2b323e] p-2.5 rounded-md flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-gray-300 font-medium">{node.name}</span>
                  <span className="text-gray-400 uppercase text-[9px] px-1.5 py-0.5 rounded bg-[#232832]">
                    {node.type}
                  </span>
                </div>
                <input
                  type="text"
                  value={node.prompt}
                  onChange={(e) => handleNodePromptChange(idx, e.target.value)}
                  placeholder="Node instruction or prompt..."
                  className="bg-[#121419] border border-[#272d37] rounded px-2.5 py-1 text-xs text-gray-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary Submit Button */}
      <button
        onClick={onSubmitCritique}
        disabled={isLoading || !prompt.trim() || !image}
        className={`w-full py-3 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
          isLoading
            ? "bg-[#252b36] text-gray-400 cursor-not-allowed"
            : !prompt.trim() || !image
            ? "bg-[#1e222a] text-gray-400 cursor-not-allowed border border-[#2a303b]"
            : councilMode
            ? "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-amber-950/40"
            : "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-cyan-950/40"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>
              {councilMode ? "Convening Review Council..." : "Analyzing Visual Artifacts..."}
            </span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>
              {councilMode ? "Convene 3 Advisor Council" : "Run Visual Diagnosis"}
            </span>
          </>
        )}
      </button>

      {!prompt.trim() || !image ? (
        <p className="text-[11px] text-center text-gray-400">
          Upload an image and specify the prompt, or select a sample preset above.
        </p>
      ) : null}

    </div>
  );
}
