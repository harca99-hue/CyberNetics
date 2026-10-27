import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  ExternalLink, 
  X, 
  Globe, 
  Printer, 
  Sparkles,
  ShieldAlert,
  Smartphone,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useClubData } from '../context/ClubDataContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { clubSettings } = useClubData();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'qr' | 'flyer'>('qr');
  const [qrTheme, setQrTheme] = useState<'contrast' | 'cyber'>('contrast');
  const flyerRef = useRef<HTMLDivElement>(null);

  // Official live website link
  const OFFICIAL_LIVE_URL = 'https://cybernetics-club.vercel.app';

  // Normalize website URL to ensure it points to the official live website
  const resolveWebsiteUrl = (url?: string): string => {
    if (!url) return OFFICIAL_LIVE_URL;
    let clean = url.trim();
    if (clean.startsWith('https;//')) clean = clean.replace('https;//', 'https://');
    if (clean.startsWith('http;//')) clean = clean.replace('http;//', 'http://');
    if (clean.startsWith('https//')) clean = clean.replace('https//', 'https://');
    if (clean.startsWith('http//')) clean = clean.replace('http//', 'http://');
    if (
      clean.includes('cybernetics.com') || 
      clean.includes('cybernetics.net') || 
      clean.includes('cybernetics.vercel.app') || 
      clean.includes('cybernetics-club.vercel.app')
    ) {
      return OFFICIAL_LIVE_URL;
    }
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    return clean;
  };

  const publicUrl = resolveWebsiteUrl(clubSettings.websiteUrl);

  // Generate QR Code with high error correction and reliable contrast
  useEffect(() => {
    if (isOpen) {
      const isContrast = qrTheme === 'contrast';
      QRCode.toDataURL(publicUrl, {
        width: 480,
        margin: 3,
        color: {
          dark: isContrast ? '#050a14' : '#22d3ee',
          light: isContrast ? '#ffffff' : '#080d1a'
        },
        errorCorrectionLevel: 'H'
      })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });
    }
  }, [isOpen, publicUrl, qrTheme]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement('input');
      input.value = publicUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'cybernetics-club-official-qr.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: clubSettings.name || 'Cyber Netics Cybersecurity Club',
          text: `Join Cyber Netics — ${clubSettings.tagline}`,
          url: publicUrl,
        });
      } catch {
        // User dismissed share dialog
      }
    } else {
      handleCopyLink();
    }
  };

  const handlePrintFlyer = () => {
    window.print();
  };

  return (
    <div 
      id="share-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="share-modal-container"
        className="relative w-full max-w-xl bg-[#0c1220] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden my-8"
      >
        {/* Header decoration bar */}
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090e1a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">Official Website QR Code</h3>
              <p className="text-xs text-slate-400 font-mono">Verified Live Vercel Link Distribution</p>
            </div>
          </div>
          <button
            id="close-share-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800/80 px-6 pt-3 gap-2 bg-[#0a0f1d]">
          <button
            id="tab-qr-code-btn"
            onClick={() => setActiveTab('qr')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'qr'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Digital QR &amp; Link
          </button>
          <button
            id="tab-flyer-btn"
            onClick={() => setActiveTab('flyer')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'flyer'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Printer className="w-4 h-4" />
            Printable Campus Flyer
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'qr' ? (
            <div className="space-y-6">
              {/* QR Code Presentation Box */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-xl bg-[#080d18] border border-cyan-500/20">
                
                {/* QR Code Canvas */}
                <div className="relative p-3.5 bg-white rounded-2xl shadow-xl flex flex-col items-center shrink-0 border-2 border-cyan-400/50">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt={`QR Code for ${publicUrl}`} 
                      className="w-44 h-44 rounded"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-slate-700 font-mono text-xs">
                      Generating QR...
                    </div>
                  )}
                  <div className="mt-2 text-[10px] uppercase font-mono tracking-wider text-slate-900 font-bold flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-cyan-600" />
                    <span>SCAN WITH PHONE CAMERA</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    ENCODED TO OFFICIAL VERCEL LIVE URL
                  </div>
                  <h4 className="text-white font-bold text-base leading-snug">
                    Share directly with students, recruits &amp; visitors
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Point any smartphone camera at this code to open our official live website, browse workshops, submit recruit applications, or practice in the Cyber War Room.
                  </p>

                  {/* QR Style Options */}
                  <div className="flex items-center gap-2 pt-1 text-xs font-mono">
                    <span className="text-slate-400 text-[11px]">QR Style:</span>
                    <button
                      onClick={() => setQrTheme('contrast')}
                      className={`px-2 py-1 rounded text-[11px] cursor-pointer ${
                        qrTheme === 'contrast'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-semibold'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      High-Contrast (Camera Optimal)
                    </button>
                    <button
                      onClick={() => setQrTheme('cyber')}
                      className={`px-2 py-1 rounded text-[11px] cursor-pointer ${
                        qrTheme === 'cyber'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-semibold'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      Cyber Neon
                    </button>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      id="download-qr-btn"
                      onClick={handleDownloadQr}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium font-mono transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Save PNG Image
                    </button>
                    {typeof navigator !== 'undefined' && 'share' in navigator && (
                      <button
                        id="native-share-btn"
                        onClick={handleNativeShare}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Share...
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Public Link Copy Bar */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Encoded Official Website Address
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-[#070b14] border border-cyan-500/30 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-bold">{publicUrl}</span>
                  </div>
                  <button
                    id="copy-public-url-btn"
                    onClick={handleCopyLink}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold font-mono uppercase tracking-wide transition-all cursor-pointer ${
                      copied
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-950/50'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Link
                      </>
                    )}
                  </button>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold font-mono uppercase tracking-wide bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all cursor-pointer"
                    title="Open website URL in new tab"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Notice & Cloud sync info */}
              <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Live Official Production Synchronization
                </div>
                <p>
                  This QR code encodes <span className="text-cyan-300 font-semibold">https://cybernetics-club.vercel.app</span>, directing all scans straight to our production cyber hub.
                </p>
              </div>
            </div>
          ) : (
            /* Printable Campus Flyer View */
            <div className="space-y-4">
              <div 
                ref={flyerRef}
                className="p-6 rounded-xl bg-gradient-to-b from-[#091122] to-[#050912] border-2 border-cyan-500/40 text-center space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  OFFICIAL COLLEGIATE CYBERSECURITY CLUB
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white tracking-wider uppercase">
                    {clubSettings.name}
                  </h2>
                  <p className="text-xs text-cyan-300 font-mono mt-1">
                    {clubSettings.tagline}
                  </p>
                </div>

                <div className="flex justify-center my-2">
                  <div className="p-3.5 bg-white rounded-2xl shadow-xl border-2 border-cyan-400">
                    {qrDataUrl && (
                      <img 
                        src={qrDataUrl} 
                        alt="QR Code" 
                        className="w-44 h-44 rounded"
                      />
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <p className="font-bold text-white">🗓️ {clubSettings.regularMeeting}</p>
                  <p className="text-slate-400">All majors and experience levels welcome!</p>
                  <p className="text-cyan-400 font-semibold break-all pt-1 font-bold">{publicUrl}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                  <div className="p-1.5 bg-slate-900/60 rounded border border-slate-800">
                    <div className="text-white font-bold">🔴 Red Team</div>
                    <div>Ethical Hacking</div>
                  </div>
                  <div className="p-1.5 bg-slate-900/60 rounded border border-slate-800">
                    <div className="text-white font-bold">🔵 Blue Team</div>
                    <div>SOC &amp; Defense</div>
                  </div>
                  <div className="p-1.5 bg-slate-900/60 rounded border border-slate-800">
                    <div className="text-white font-bold">⚡ CTFs &amp; Labs</div>
                    <div>Wargames</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  id="print-flyer-btn"
                  onClick={handlePrintFlyer}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs font-mono transition-colors shadow-lg shadow-cyan-950/50 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print Campus Poster
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#080d18] border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px] text-slate-500">
            TARGET: <span className="text-cyan-400">{publicUrl}</span>
          </span>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Open Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
