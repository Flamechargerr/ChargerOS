import { useState } from 'react';

export default function NetworkTools() {
  const [tab, setTab] = useState<'ping' | 'traceroute' | 'whois' | 'ipconfig'>('ping');
  const [host, setHost] = useState('google.com');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  const runPing = () => {
    setRunning(true);
    setOutput(`PING ${host} (142.250.80.46): 56 data bytes\n`);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      const time = (Math.random() * 20 + 10).toFixed(2);
      setOutput(prev => prev + `64 bytes from 142.250.80.46: icmp_seq=${i} ttl=118 time=${time} ms\n`);
      if (i >= 4) {
        clearInterval(interval);
        setOutput(prev => prev + `\n--- ${host} ping statistics ---\n${i} packets transmitted, ${i} received, 0% packet loss\n`);
        setRunning(false);
      }
    }, 800);
  };

  const runTraceroute = () => {
    setRunning(true);
    setOutput(`traceroute to ${host} (142.250.80.46), 30 hops max\n\n`);
    const hops = [
      '192.168.1.1', '10.0.0.1', '172.16.0.1', 'isp-router.net',
      'core-backbone.com', 'peer-exchange.net', 'google-peering.net',
      '142.250.80.46',
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i >= hops.length) { clearInterval(interval); setRunning(false); return; }
      const t1 = (Math.random() * 5 + 1).toFixed(2);
      const t2 = (Math.random() * 5 + 1).toFixed(2);
      const t3 = (Math.random() * 5 + 1).toFixed(2);
      setOutput(prev => prev + ` ${i + 1}  ${hops[i]}  ${t1}ms  ${t2}ms  ${t3}ms\n`);
      i++;
    }, 600);
  };

  const runWhois = () => {
    setOutput(`Domain Name: ${host.toUpperCase()}\nRegistry Domain ID: 2138514_DOMAIN_COM-VRSN\nRegistrar WHOIS Server: whois.markmonitor.com\nRegistrar URL: http://www.markmonitor.com\nUpdated Date: 2019-09-09T15:39:04Z\nCreation Date: 1997-09-15T04:00:00Z\nRegistry Expiry Date: 2028-09-14T04:00:00Z\nRegistrar: MarkMonitor Inc.\nName Server: NS1.GOOGLE.COM\nName Server: NS2.GOOGLE.COM\nDNSSEC: signedDelegation`);
  };

  const ipConfig = () => {
    setOutput(`Connection-specific DNS Suffix: .local\nIPv4 Address: 192.168.1.${Math.floor(Math.random() * 200) + 10}\nSubnet Mask: 255.255.255.0\nDefault Gateway: 192.168.1.1\n\nDNS Servers:\n  8.8.8.8\n  8.8.4.4\n  1.1.1.1\n\nPhysical Address: ${Array(6).fill(0).map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('-').toUpperCase()}\nDHCP Enabled: Yes`);
  };

  const run = () => {
    if (tab === 'ping') runPing();
    else if (tab === 'traceroute') runTraceroute();
    else if (tab === 'whois') runWhois();
    else if (tab === 'ipconfig') ipConfig();
  };

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d]">
      <div className="flex border-b border-[#333]">
        {(['ping', 'traceroute', 'whois', 'ipconfig'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setOutput(''); }} className={`px-4 py-2.5 text-sm ${tab === t ? 'text-[#4a9eff] border-b-2 border-[#4a9eff]' : 'text-white/40 hover:text-white'}`}>{t}</button>
        ))}
      </div>

      {tab !== 'ipconfig' && (
        <div className="flex gap-2 p-3">
          <input type="text" value={host} onChange={e => setHost(e.target.value)} className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none" />
          <button onClick={run} disabled={running} className="px-4 py-1.5 bg-[#4a9eff] text-white text-xs rounded hover:bg-[#3d8de6] disabled:opacity-50">Run</button>
        </div>
      )}
      {tab === 'ipconfig' && (
        <div className="p-3">
          <button onClick={run} className="px-4 py-1.5 bg-[#4a9eff] text-white text-xs rounded hover:bg-[#3d8de6]">Show IP Config</button>
        </div>
      )}

      <div className="flex-1 overflow-auto p-3">
        <pre className="text-[#4af626] text-xs font-mono whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
}
