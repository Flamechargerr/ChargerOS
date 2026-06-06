import { useState, useEffect } from 'react';
import { Cpu, Monitor, HardDrive, Wifi, Globe } from 'lucide-react';

export default function SystemInfo() {
  const [memory, setMemory] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setMemory(Math.round(Math.random() * 30 + 40));
    }, 3000);
    setMemory(Math.round(Math.random() * 30 + 40));
    return () => clearInterval(timer);
  }, []);

  const sections = [
    {
      title: 'Operating System',
      icon: Globe,
      color: '#4a9eff',
      items: [
        { label: 'OS Name', value: 'ChargerOS' },
        { label: 'Version', value: '1.0.0' },
        { label: 'Kernel', value: 'simulated-browser' },
        { label: 'Architecture', value: navigator.platform },
        { label: 'Hostname', value: 'chargeros' },
      ],
    },
    {
      title: 'Hardware',
      icon: Cpu,
      color: '#ff9800',
      items: [
        { label: 'Processor', value: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} cores` : 'Unknown' },
        { label: 'Memory Usage', value: `${memory}%` },
        { label: 'Screen Resolution', value: `${window.screen.width}x${window.screen.height}` },
        { label: 'Color Depth', value: `${window.screen.colorDepth}-bit` },
        { label: 'Device Pixel Ratio', value: `${window.devicePixelRatio}x` },
      ],
    },
    {
      title: 'Browser',
      icon: Monitor,
      color: '#4ecdc4',
      items: [
        { label: 'Browser', value: navigator.userAgent.split(' ').slice(-1)[0]?.split('/')[0] || 'Unknown' },
        { label: 'Language', value: navigator.language },
        { label: 'Online', value: navigator.onLine ? 'Yes' : 'No' },
        { label: 'Cookies', value: navigator.cookieEnabled ? 'Enabled' : 'Disabled' },
        { label: 'Touch Support', value: 'ontouchstart' in window ? 'Yes' : 'No' },
      ],
    },
    {
      title: 'Storage',
      icon: HardDrive,
      color: '#9c27b0',
      items: [
        { label: 'LocalStorage', value: `${(JSON.stringify(localStorage).length / 1024).toFixed(1)} KB used` },
        { label: 'SessionStorage', value: `${(JSON.stringify(sessionStorage).length / 1024).toFixed(1)} KB used` },
        { label: 'IndexedDB', value: 'Available' },
      ],
    },
    {
      title: 'Network',
      icon: Wifi,
      color: '#4caf50',
      items: [
        { label: 'Connection', value: navigator.onLine ? 'Online' : 'Offline' },
        { label: 'Effective Type', value: (navigator as any).connection?.effectiveType || 'Unknown' },
        { label: 'Downlink', value: (navigator as any).connection?.downlink ? `${(navigator as any).connection.downlink} Mbps` : 'Unknown' },
        { label: 'User Agent', value: navigator.userAgent.slice(0, 50) + '...' },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] overflow-auto p-4">
      <div className="text-center mb-6">
        <Cpu size={32} className="text-[#4a9eff] mx-auto mb-2" />
        <h2 className="text-white text-lg font-medium">System Information</h2>
        <p className="text-white/40 text-xs">{time.toLocaleString()}</p>
      </div>

      <div className="space-y-3">
        {sections.map(section => (
          <div key={section.title} className="bg-[#252526] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <section.icon size={14} style={{ color: section.color }} />
              <h3 className="text-white text-sm font-medium">{section.title}</h3>
            </div>
            <div className="space-y-1.5">
              {section.items.map(item => (
                <div key={item.label} className="flex justify-between text-xs">
                  <span className="text-white/40">{item.label}</span>
                  <span className="text-white/80 max-w-[200px] truncate">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
