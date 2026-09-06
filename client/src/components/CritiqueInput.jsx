import React, { useState, useRef } from "react";
import { UploadCloud, Sparkles, Trash2, Sliders, Users, Layers, AlertCircle } from "lucide-react";

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
    <div className="instrument-card rounded-xl p-5 flex flex-col gap-4">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <span>Attempt Console</span>
            <span className="text-[10px] font-measurement text-gray-400 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
              STAGE INPUT
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Supply active prompt and generated visual output
          </p>
        </div>

        {image && (
          <button
            onClick={() => setImage(null)}
            className="text-xs text-gray-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
            title="Clear image"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
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
          className={`border border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all ${
            dragActive
              ? "border-amber-400/80 bg-amber-950/10"
              : "border-white/15 hover:border-white/30 bg-[#090b0f]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-10 h-10 rounded-lg bg-[#141720] flex items-center justify-center text-gray-400 border border-white/10">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-gray-200">
              Click to select or drop visual generation
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5 font-measurement">
              PNG / JPG / WebP up to 25MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-white/10 bg-[#050608] group">
          <img
            src={image}
            alt="Attempt preview"
            className="w-full max-h-52 object-contain mx-auto"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-md bg-[#161922] hover:bg-[#202532] text-white text-xs font-medium border border-white/20 cursor-pointer"
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
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="text-gray-300 font-medium">Generation Prompt</label>
          <span className="text-gray-400 font-measurement text-[11px]">
            {prompt.length} CHARS
          </span>
        </div>
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste exact prompt used for this generation..."
          className="w-full bg-[#080a0e] border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 rounded-lg p-3 text-xs text-gray-200 placeholder-gray-500 focus:outline-none transition-all resize-none leading-relaxed font-sans"
        />
      </div>

      {/* Node Chain Inspector Drawer */}
      {showChainDrawer && (
        <div className="border-t border-white/10 pt-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
              <Layers className="w-3.5 h-3.5 text-gray-400" />
              <span>Multi Node Pipeline Chain</span>
            </div>
            <span className="text-[10px] font-measurement text-gray-400">
              CONTRADICTION DETECTOR
            </span>
          </div>
          <p className="text-[11px] text-gray-400">
            Define adjacent node prompts to detect contradictory guidance across generator and upscaler passes
          </p>

          <div className="grid grid-cols-1 gap-2">
            {chainNodes.map((node, index) => (
              <div key={node.id} className="bg-[#090b0f] border border-white/10 rounded-lg p-2.5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-300">
                    Node {index + 1}: {node.name}
                  </span>
                  <span className="text-[10px] font-measurement text-gray-400 uppercase">
                    {node.type}
                  </span>
                </div>
                <input
                  type="text"
                  value={node.prompt}
                  onChange={(e) => handleNodePromptChange(index, e.target.value)}
                  placeholder={`Parameters for ${node.name}...`}
                  className="bg-[#060709] border border-white/10 rounded px-2.5 py-1 text-xs text-gray-200 focus:outline-none focus:border-white/30"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Execution Button */}
      <button
        onClick={onSubmitCritique}
        disabled={isLoading || !prompt.trim() || !image}
        className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
          isLoading
            ? "bg-white/10 text-gray-400 cursor-not-allowed"
            : !prompt.trim() || !image
            ? "bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
            : councilMode
            ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 cursor-pointer shadow-amber-950/40"
            : "bg-white/10 hover:bg-white/20 text-white border border-white/20 cursor-pointer"
        }`}
      >
        {isLoading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            <span>Running Deep Visual Diagnosis...</span>
          </>
        ) : councilMode ? (
          <>
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Run Council Deliberation (3 Advisors)</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 text-gray-300" />
            <span>Run Visual Diagnosis</span>
          </>
        )}
      </button>

    </div>
  );
}
