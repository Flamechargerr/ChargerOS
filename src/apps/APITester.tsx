import { useState } from 'react';
import { Send, Globe } from 'lucide-react';

export default function APITester() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.github.com/users/github');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const send = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const options: RequestInit = { method };
      if (method !== 'GET' && body) {
        options.body = body;
        options.headers = { 'Content-Type': 'application/json' };
      }
      const res = await fetch(url, options);
      const data = await res.json();
      setResponse({ status: res.status, headers: Object.fromEntries(res.headers.entries()), data });
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex items-center gap-2 p-3 bg-[#252526] border-b border-[#333]">
        <select value={method} onChange={e => setMethod(e.target.value)} className="bg-white/10 text-white text-xs rounded px-2 py-1.5 outline-none">
          {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="flex-1 bg-white/10 text-white text-xs rounded px-2 py-1.5 outline-none" />
        <button onClick={send} disabled={loading} className="px-3 py-1.5 bg-[#4a9eff] text-white text-xs rounded hover:bg-[#3d8de6] disabled:opacity-50 flex items-center gap-1">
          <Send size={10} /> {loading ? '...' : 'Send'}
        </button>
      </div>

      {method !== 'GET' && (
        <div className="p-2 border-b border-[#333]">
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Request body (JSON)" className="w-full bg-[#1e1e1e] text-[#4af626] text-xs font-mono rounded p-2 outline-none resize-none h-16" />
        </div>
      )}

      <div className="flex-1 overflow-auto p-3">
        {error && <div className="text-red-400 text-xs mb-2">{error}</div>}
        {response && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded ${response.status < 300 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {response.status}
              </span>
              <span className="text-white/40 text-xs">{url}</span>
            </div>
            <pre className="bg-[#1e1e1e] rounded-lg p-3 text-[#4af626] text-xs font-mono overflow-auto">{JSON.stringify(response.data, null, 2)}</pre>
          </div>
        )}
        {!response && !error && (
          <div className="text-center text-white/20 text-sm mt-12">
            <Globe size={32} className="mx-auto mb-2 opacity-30" />
            <p>Enter a URL and click Send</p>
          </div>
        )}
      </div>
    </div>
  );
}
