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
  ShieldAlert
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
  const flyerRef = useRef<HTMLDivElement>(null);

  // Normalize official website URL requested by administrator (resolving https://cybernetics.vercel.app)
  const resolveWebsiteUrl = (url?: string): string => {
    if (!url) return 'https://cybernetics.vercel.app';
    let clean = url.trim();
    if (clean.startsWith('https;//')) {
      clean = clean.replace('https;//', 'https://');
    } else if (clean.startsWith('http;//')) {
      clean = clean.replace('http;//', 'http://');
    }
    if (clean.startsWith('https//')) {
      clean = clean.replace('https//', 'https://');
    } else if (clean.startsWith('http//')) {
      clean = clean.replace('http//', 'http://');
    }
    if (clean.includes('cybernetics.com') || clean.includes('cybernetics.net') || clean.includes('cybernetics.vercel.app')) {
      return 'https://cybernetics.vercel.app';
    }
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    return clean;
  };

  const publicUrl = resolveWebsiteUrl(clubSettings.websiteUrl);

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(publicUrl, {
        width: 380,
        margin: 2,
        color: {
          dark: '#080d1a',
          light: '#38bdf8'
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
  }, [isOpen, publicUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
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
    a.download = 'cyber-netics-club-qr.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: clubSettings.name || 'Cyber Netics Cybersecurity Club',
          text: `Join Cyber Netics — ${clubSettings.tagline}`,
          url: publicUrl,
        });
      } catch {
        // Ignored if cancelled
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
              <h3 className="text-lg font-bold text-white tracking-wide">Share Website & QR Code</h3>
              <p className="text-xs text-slate-400 font-mono">Public Google Cloud Endpoint Distribution</p>
            </div>
          </div>
          <button
            id="close-share-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800/80 px-6 pt-3 gap-2 bg-[#0a0f1d]">
          <button
            id="tab-qr-code-btn"
            onClick={() => setActiveTab('qr')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'qr'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Digital QR & Link
          </button>
          <button
            id="tab-flyer-btn"
            onClick={() => setActiveTab('flyer')}
            className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
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
                <div className="relative p-3 bg-gradient-to-br from-cyan-950/40 to-slate-900 rounded-xl border border-cyan-400/40 shadow-inner flex flex-col items-center shrink-0">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="Cyber Netics Public Website QR Code" 
                      className="w-44 h-44 rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-slate-500 font-mono text-xs">
                      Generating QR...
                    </div>
                  )}
                  <span className="mt-2 text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-semibold">
                    SCAN WITH MOBILE CAMERA
                  </span>
                </div>

                <div className="flex-1 space-y-3 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <Globe className="w-3 h-3" />
                    LIVE ON GOOGLE CLOUD
                  </div>
                  <h4 className="text-white font-bold text-base leading-snug">
                    Share directly with students, recruits & executive board
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Anyone can scan this QR code or click the public link on mobile or desktop to browse workshops, submit cadet applications, or solve CTF challenges.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      id="download-qr-btn"
                      onClick={handleDownloadQr}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-medium transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Save PNG Image
                    </button>
                    {typeof navigator !== 'undefined' && 'share' in navigator && (
                      <button
                        id="native-share-btn"
                        onClick={handleNativeShare}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
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
                  Official Website Address
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-[#070b14] border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{publicUrl}</span>
                  </div>
                  <button
                    id="copy-public-url-btn"
                    onClick={handleCopyLink}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold font-mono uppercase tracking-wide transition-all ${
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
                    className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold font-mono uppercase tracking-wide bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all"
                    title="Open website URL in new tab"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Notice & Cloud sync info */}
              <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Continuous Google Cloud Synchronization
                </div>
                <p>
                  Any updates made through the Admin Portal save to Firebase Firestore in Google Cloud and immediately update for anyone visiting this public URL.
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
                  <div className="p-3 bg-cyan-400/90 rounded-xl shadow-lg shadow-cyan-900/40">
                    {qrDataUrl && (
                      <img 
                        src={qrDataUrl} 
                        alt="QR Code" 
                        className="w-40 h-40 rounded"
                      />
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <p className="font-bold text-white">🗓️ {clubSettings.regularMeeting}</p>
                  <p className="text-slate-400">All majors and experience levels welcome!</p>
                  <p className="text-cyan-400 font-semibold break-all pt-1">{publicUrl}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                  <div className="p-1.5 bg-slate-900/60 rounded border border-slate-800">
                    <div className="text-white font-bold">🔴 Red Team</div>
                    <div>Ethical Hacking</div>
                  </div>
                  <div className="p-1.5 bg-slate-900/60 rounded border border-slate-800">
                    <div className="text-white font-bold">🔵 Blue Team</div>
                    <div>SOC & Defense</div>
                  </div>
                  <div className="p-1.5 bg-slate-900/60 rounded border border-slate-800">
                    <div className="text-white font-bold">⚡ CTFs & Labs</div>
                    <div>Wargames</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  id="print-flyer-btn"
                  onClick={handlePrintFlyer}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors shadow-lg shadow-cyan-950/50"
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
          <span className="font-mono text-[11px]">PROJECT ID: sonic-keyword-xggh3</span>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Open Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
