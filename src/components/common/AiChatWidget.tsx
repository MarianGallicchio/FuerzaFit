import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Msg { role: 'user' | 'assistant'; text: string; }

export const AiChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', text: '¡Hola! Soy tu asistente FuerzaFit 🤖\nPreguntame sobre rutinas, alimentación, pagos o cómo usar el sistema. Gratis y al instante.' }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q })
      });
      const data = await res.json();
      setMsgs(m => [...m, { role: 'assistant', text: data.reply || data.suggestion || 'No pude responder, probá de nuevo.' }]);
    } catch {
      setMsgs(m => [...m, { role: 'assistant', text: '⚠️ Sin conexión al asistente. Probá de nuevo en unos segundos.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 hover:from-violet-500 text-white shadow-xl shadow-violet-600/25 flex items-center justify-center"
        aria-label="Abrir chat IA"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-5 z-50 w-[92vw] max-w-sm h-[420px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="h-12 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center"><Bot className="w-4 h-4" /></div>
                <div>
                  <p className="text-xs font-black">Asistente FuerzaFit</p>
                  <p className="text-[11px] opacity-80">Gratis · Responde al instante</p>
                </div>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3"/> IA</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/50">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs whitespace-pre-wrap ${m.role==='user'?'bg-violet-600 text-white rounded-br-sm':'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs text-slate-400">Escribiendo...</div>}
              <div ref={bottomRef} />
            </div>

            <div className="p-2 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
              <input
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter') send(); }}
                placeholder="Escribí tu consulta..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
              <button onClick={send} disabled={loading || !input.trim()} className="w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white flex items-center justify-center">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-500 pb-2">Gratis · Sin tarjeta · Datos no salen de tu gym</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
