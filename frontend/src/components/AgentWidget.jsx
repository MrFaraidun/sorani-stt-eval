import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X, Send, Terminal, Bot, Loader2, Image, FileText, ChevronDown, Key } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api/v1';

export default function AgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [inputMode, setInputMode] = useState('mic'); // 'mic' or 'keyboard'
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [nvKeyInput, setNvKeyInput] = useState('');
  const [keySaveStatus, setKeySaveStatus] = useState('');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const handleSaveKeys = async () => {
    if (!nvKeyInput.trim()) return;
    setKeySaveStatus('Saving...');
    try {
      const res = await fetch(`${API_BASE}/agent/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nvidia_api_key: nvKeyInput.trim() }),
      });
      if (res.ok) {
        setKeySaveStatus('✅ Key Saved!');
        setTimeout(() => {
          setShowKeyModal(false);
          setKeySaveStatus('');
        }, 1200);
      } else {
        setKeySaveStatus('❌ Error saving key.');
      }
    } catch (err) {
      setKeySaveStatus('❌ Network error.');
    }
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Focus input when switching to keyboard mode
  useEffect(() => {
    if (inputMode === 'keyboard' && isOpen) {
      inputRef.current?.focus();
    }
  }, [inputMode, isOpen]);

  // ─── Global Space Key Push-to-Talk ──────────────────────────────────
  useEffect(() => {
    if (!isOpen || inputMode !== 'mic') return;

    const handleKeyDown = (e) => {
      // Space to talk — but not when typing in an input/textarea
      if (e.code === 'Space' && !e.repeat && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        if (!isRecording && !isProcessing) startRecording();
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        if (isRecording) stopRecording();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, inputMode, isRecording, isProcessing]);

  // ─── Microphone Recording ─────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await sendAudioToAgent(blob);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch {
      setConversation((prev) => [
        ...prev,
        { role: 'system', type: 'error', content: 'ڕێگە بە مایکرۆفۆنەکەت بدە!' },
      ]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // ─── Send Audio to Agent API ──────────────────────────────────────────
  const sendAudioToAgent = async (audioBlob) => {
    if (!audioBlob || audioBlob.size < 100) return;

    setIsProcessing(true);
    setConversation((prev) => [
      ...prev,
      { role: 'user', type: 'audio', content: 'گوێدارییکردن...' },
    ]);

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('model', 'hybrid-custom-gemini');
      formData.append('language', 'ckb');

      const res = await fetch(`${API_BASE}/agent`, { method: 'POST', body: formData });
      const data = await res.json();

      // Update the user message with actual transcription
      setConversation((prev) => {
        const updated = [...prev];
        const lastUserIdx = updated.findLastIndex((m) => m.role === 'user');
        if (lastUserIdx >= 0) {
          updated[lastUserIdx] = {
            role: 'user',
            type: 'message',
            content: data.transcription ? data.transcription : 'هیچ دەنگێکم نەبیست',
          };
        }
        return updated;
      });

      // Add agent responses
      if (data.responses) {
        const agentMessages = data.responses
          .filter((r) => r.content)
          .map((r) => ({
            role: r.role || 'assistant',
            type: r.type || 'message',
            content: r.content,
            format: r.format || '',
          }));
        setConversation((prev) => [...prev, ...agentMessages]);
      }
    } catch (err) {
      setConversation((prev) => [
        ...prev,
        { role: 'system', type: 'error', content: `هەڵە: ${err.message}` },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Send Text to Agent API ───────────────────────────────────────────
  const sendTextToAgent = async () => {
    const text = textInput.trim();
    if (!text) return;

    setTextInput('');
    setIsProcessing(true);
    setConversation((prev) => [...prev, { role: 'user', type: 'message', content: text }]);

    try {
      const formData = new FormData();
      formData.append('text', text);

      const res = await fetch(`${API_BASE}/agent/text`, { method: 'POST', body: formData });
      const data = await res.json();

      if (data.responses) {
        const agentMessages = data.responses
          .filter((r) => r.content)
          .map((r) => ({
            role: r.role || 'assistant',
            type: r.type || 'message',
            content: r.content,
            format: r.format || '',
          }));
        setConversation((prev) => [...prev, ...agentMessages]);
      }
    } catch (err) {
      setConversation((prev) => [
        ...prev,
        { role: 'system', type: 'error', content: `هەڵە: ${err.message}` },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Render Message Content ───────────────────────────────────────────
  const renderContent = (msg) => {
    // Audio recording state (listening/processing)
    if (msg.type === 'audio') {
      return (
        <div className="flex items-center gap-2 text-emerald-300">
          <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-sm font-medium">{msg.content}</span>
        </div>
      );
    }

    // Image content (base64 or URL)
    if (msg.type === 'image' || msg.format === 'base64') {
      return (
        <div className="mt-2">
          <img
            src={msg.content}
            alt="Agent output"
            className="max-w-full rounded-xl border border-emerald-400/30 shadow-lg"
            style={{ maxHeight: '240px' }}
          />
        </div>
      );
    }

    // Code/console output
    if (msg.type === 'console' || msg.type === 'code') {
      return (
        <pre className="mt-1 p-3 rounded-xl bg-black/60 text-emerald-300 text-xs font-mono overflow-x-auto border border-emerald-500/20 whitespace-pre-wrap break-all">
          {msg.content}
        </pre>
      );
    }

    // Regular text
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>;
  };

  // ─── Floating Button (Collapsed State) ────────────────────────────────
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-2xl shadow-emerald-500/40 flex items-center justify-center transition-all hover:scale-110 cursor-pointer group"
        title="ASO Voice Commander"
      >
        <Bot className="w-7 h-7 group-hover:scale-110 transition-transform" />
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
      </button>
    );
  }

  // ─── Expanded Widget Panel ────────────────────────────────────────────
  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-[380px] max-h-[560px] rounded-3xl overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(145deg, rgba(8, 20, 14, 0.97) 0%, rgba(3, 10, 6, 0.99) 100%)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(0, 230, 118, 0.3)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 230, 118, 0.15)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">ASO Voice Commander</h3>
            <p className="text-[10px] text-emerald-400/70 font-mono">Kurdish AI Agent</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* API Key Modal Toggle */}
          <button
            onClick={() => setShowKeyModal(!showKeyModal)}
            className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all cursor-pointer"
            title="Configure API Keys"
          >
            <Key className="w-4 h-4 text-emerald-400" />
          </button>
          {/* Input mode toggle */}
          <button
            onClick={() => setInputMode(inputMode === 'mic' ? 'keyboard' : 'mic')}
            className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all cursor-pointer"
            title={inputMode === 'mic' ? 'Switch to keyboard' : 'Switch to microphone'}
          >
            {inputMode === 'mic' ? <Terminal className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* API Key Settings Drawer Modal */}
      {showKeyModal && (
        <div className="p-4 bg-emerald-950/90 border-b border-emerald-500/30 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
              <Key className="w-3.5 h-3.5" /> Configure API Key
            </h4>
            <span className="text-[10px] text-emerald-400/60 font-mono">{keySaveStatus}</span>
          </div>
          <input
            type="password"
            placeholder="Paste NVIDIA API Key (nvapi-...)"
            value={nvKeyInput}
            onChange={(e) => setNvKeyInput(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/60 border border-emerald-500/30 text-xs text-emerald-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
          <button
            onClick={handleSaveKeys}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            Save API Key
          </button>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[280px] max-h-[380px]">
        {conversation.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-6 space-y-3">
            <Bot className="w-10 h-10 text-emerald-400/50" />
            <p className="text-xs text-slate-300 font-medium">
              {inputMode === 'mic'
                ? 'دەستبنێ بۆ قسەکردن بە کوردی...'
                : 'فرمانێک بنووسە بە کوردی...'}
            </p>
            <button
              onClick={() => setShowKeyModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
            >
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>کلیلەی API تێبکە (Add API Key)</span>
            </button>
            <p className="text-[10px] text-slate-500 font-mono">
              "کرۆم بکەرەوە" • "کرۆم دابخە" • "نۆتباد بکەرەوە"
            </p>
          </div>
        )}

        {conversation.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${msg.role === 'user'
                  ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-100'
                  : msg.type === 'error'
                    ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                    : 'bg-slate-800/60 border border-slate-700/50 text-slate-200'
                }`}
            >
              {/* Role indicator */}
              <div className="flex items-center gap-1.5 mb-1">
                {msg.role === 'user' ? (
                  <div className="flex items-center gap-1">
                    <Mic className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400/80">تۆ</span>
                  </div>
                ) : msg.type === 'console' || msg.type === 'code' ? (
                  <Terminal className="w-3 h-3 text-emerald-400/60" />
                ) : msg.type === 'image' ? (
                  <Image className="w-3 h-3 text-emerald-400/60" />
                ) : (
                  <Bot className="w-3 h-3 text-emerald-400/60" />
                )}
              </div>
              {renderContent(msg)}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-slate-800/60 border border-emerald-500/20 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              <span className="text-xs text-emerald-400/80">جێبەجێکردن...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-emerald-500/20">
        {inputMode === 'mic' ? (
          /* Microphone Mode */
          <div className="flex items-center justify-center">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={isRecording ? stopRecording : undefined}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={isProcessing}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer ${isRecording
                  ? 'bg-red-500 shadow-2xl shadow-red-500/50 scale-110'
                  : isProcessing
                    ? 'bg-slate-700 opacity-50 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/30 hover:scale-105'
                }`}
            >
              {isRecording ? (
                <MicOff className="w-7 h-7 text-white animate-pulse" />
              ) : (
                <Mic className="w-7 h-7 text-black" />
              )}
            </button>
            {isRecording && (
              <div className="absolute bottom-24 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className={`w-1 bg-red-400 rounded-full animate-mic-wave-${n}`}
                    style={{ height: '8px' }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Keyboard Mode */
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendTextToAgent()}
              placeholder="فرمانێک بنووسە بە کوردی..."
              disabled={isProcessing}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/50 transition-colors"
              dir="rtl"
            />
            <button
              onClick={sendTextToAgent}
              disabled={isProcessing || !textInput.trim()}
              className="w-11 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}

        <p className="text-center text-[10px] text-slate-500 mt-2 font-mono">
          {inputMode === 'mic' ? 'پەنجەت دابگرە بۆ قسەکردن' : 'Enter بۆ ناردن'}
        </p>
      </div>
    </div>
  );
}
