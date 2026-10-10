import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles, Check, Copy, CornerDownLeft, RefreshCw, Trophy } from 'lucide-react';
import { TERMINAL_EASTER_EGG, CLUB_INFO, TRACKS, UPCOMING_EVENTS } from '../data/clubData';

interface TerminalChallengeProps {
  hasSolvedFlag: boolean;
  onSolveFlag: (flag: string) => void;
  onOpenJoin: () => void;
}

interface CommandLog {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  text: string | React.ReactNode;
}

export const TerminalChallenge: React.FC<TerminalChallengeProps> = ({
  hasSolvedFlag,
  onSolveFlag,
  onOpenJoin,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      type: 'output',
      text: 'Cyber Netics Terminal Shell v2.6.4 (x86_64-polytech-linux-gnu)',
    },
    {
      id: 'init-2',
      type: 'output',
      text: 'Type "help" to list available commands or "challenge" to attempt the recruit CTF puzzle.',
    },
  ]);

  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Prevent scrolling page on initial load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Only scroll within the terminal's internal log container, never scrolling the browser window
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommandSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawCmd = inputVal.trim();
    if (!rawCmd) return;

    const parts = rawCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Append the user's input line
    const userLog: CommandLog = {
      id: `cmd-${Date.now()}`,
      type: 'input',
      text: `$ ${rawCmd}`,
    };

    let responseLog: CommandLog;

    switch (cmd) {
      case 'help':
        responseLog = {
          id: `res-${Date.now()}`,
          type: 'output',
          text: (
            <div className="space-y-1.5 text-xs">
              <div className="text-cyan-300 font-bold">AVAILABLE COMMANDS:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
                <div><span className="text-emerald-400 font-bold">challenge</span> : View the recruit CTF puzzle</div>
                <div><span className="text-emerald-400 font-bold">decode &lt;str&gt;</span> : Decode Base64 ciphertext</div>
                <div><span className="text-emerald-400 font-bold">flag &lt;key&gt;</span> : Submit candidate CTF flag</div>
                <div><span className="text-emerald-400 font-bold">scan</span> : Run simulated port scan</div>
                <div><span className="text-emerald-400 font-bold">status</span> : Show club telemetry</div>
                <div><span className="text-emerald-400 font-bold">tracks</span> : Display 5 technical divisions</div>
                <div><span className="text-emerald-400 font-bold">events</span> : List upcoming labs & CTFs</div>
                <div><span className="text-emerald-400 font-bold">whoami</span> : Print current candidate identity</div>
                <div><span className="text-emerald-400 font-bold">matrix</span> : Execute digital rain stream</div>
                <div><span className="text-emerald-400 font-bold">clear</span> : Reset terminal output</div>
              </div>
            </div>
          ),
        };
        break;

      case 'challenge':
        responseLog = {
          id: `res-${Date.now()}`,
          type: 'output',
          text: (
            <div className="space-y-2 p-2.5 rounded bg-cyan-950/40 border border-cyan-800/40 text-xs">
              <div className="text-amber-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>[CHALLENGE #01: BASE64 CIPHER]</span>
              </div>
              <p className="text-slate-300">
                A rogue packet was intercepted leaving our lab router. Decompile the encoded payload to reveal your recruit flag:
              </p>
              <div className="p-2 bg-black/60 rounded border border-slate-700 font-mono text-cyan-300 select-all">
                Q1lCRVJORVRJQ1N7aDRjazNyXzIwMjZfbjN0aWNzfQ==
              </div>
              <p className="text-slate-400 text-[11px]">
                Tip: Type <code className="text-emerald-400">decode Q1lCRVJORVRJQ1N7aDRjazNyXzIwMjZfbjN0aWNzfQ==</code> or run CyberChef!
              </p>
            </div>
          ),
        };
        break;

      case 'decode':
        if (args.length === 0) {
          responseLog = {
            id: `res-${Date.now()}`,
            type: 'error',
            text: 'Usage: decode <base64_string>',
          };
        } else {
          try {
            const decoded = atob(args[0]);
            responseLog = {
              id: `res-${Date.now()}`,
              type: 'success',
              text: (
                <div className="space-y-1 text-xs">
                  <div className="text-emerald-400 font-bold">[+] Base64 Decoded Successfully:</div>
                  <div className="text-white bg-slate-900 px-2 py-1 rounded border border-emerald-500/40 font-mono">
                    {decoded}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Now run <code className="text-cyan-400">flag {decoded}</code> to claim your recruit verification!
                  </div>
                </div>
              ),
            };
          } catch {
            responseLog = {
              id: `res-${Date.now()}`,
              type: 'error',
              text: '[-] Error: Invalid Base64 string payload.',
            };
          }
        }
        break;

      case 'flag':
        if (args.length === 0) {
          responseLog = {
            id: `res-${Date.now()}`,
            type: 'error',
            text: 'Usage: flag <flag_value> (e.g., flag CYBERNETICS{...})',
          };
        } else {
          const submitted = args.join(' ');
          if (submitted === TERMINAL_EASTER_EGG.flag) {
            onSolveFlag(submitted);
            responseLog = {
              id: `res-${Date.now()}`,
              type: 'success',
              text: (
                <div className="space-y-2 p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/50 text-xs">
                  <div className="text-emerald-300 font-bold text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>[+] ACCESS GRANTED: RECRUIT FLAG ACCEPTED!</span>
                  </div>
                  <p className="text-slate-200">
                    Congratulations! You cracked the Cyber Netics entrance challenge. Your membership application now has the <strong className="text-amber-300">Verified Recruit Badge</strong> attached.
                  </p>
                  <button
                    onClick={onOpenJoin}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 text-xs mt-1"
                  >
                    Open Membership Application with Verified Badge
                  </button>
                </div>
              ),
            };
          } else {
            responseLog = {
              id: `res-${Date.now()}`,
              type: 'error',
              text: '[-] Invalid flag hash. Check for trailing characters or typos.',
            };
          }
        }
        break;

      case 'scan':
        responseLog = {
          id: `res-${Date.now()}`,
          type: 'output',
          text: (
            <div className="space-y-1 font-mono text-xs text-slate-300">
              <div className="text-cyan-400">Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-17 11:46 UTC</div>
              <div>Nmap scan report for range.cybernetics.poly.edu (10.14.3.42)</div>
              <div>Host is up (0.00042s latency).</div>
              <div className="text-slate-400">PORT     STATE SERVICE       VERSION</div>
              <div className="text-emerald-400">22/tcp   open  ssh           OpenSSH 9.2p1 Debian</div>
              <div className="text-emerald-400">80/tcp   open  http          CyberNetics-Portal/1.0</div>
              <div className="text-emerald-400">443/tcp  open  ssl/https     nginx/1.24.0</div>
              <div className="text-emerald-400">8000/tcp open  ctf-scoreboard CTFd 3.6.0</div>
              <div className="text-amber-400">31337/tcp open elite-pwn     CyberRange Stack Smasher</div>
              <div className="text-slate-400 text-[11px] pt-1">Nmap done: 1 IP address (1 host up) scanned in 0.48 seconds</div>
            </div>
          ),
        };
        break;

      case 'status':
        responseLog = {
          id: `res-${Date.now()}`,
          type: 'output',
          text: (
            <div className="space-y-1 text-xs">
              <div className="text-cyan-300 font-bold">[+] CYBER NETICS SYSTEM TELEMETRY:</div>
              <div>• University: {CLUB_INFO.university}</div>
              <div>• Active Student Members: {CLUB_INFO.activeMembersCount}</div>
              <div>• CTF Collegiate Ranking: {CLUB_INFO.ctfGlobalRank}</div>
              <div>• General Assembly: {CLUB_INFO.regularMeeting}</div>
              <div>• Flag Status: {hasSolvedFlag ? 'VERIFIED_CANDIDATE' : 'UNSOLVED (run "challenge")'}</div>
            </div>
          ),
        };
        break;

      case 'tracks':
        responseLog = {
          id: `res-${Date.now()}`,
          type: 'output',
          text: (
            <div className="space-y-1 text-xs">
              <div className="text-cyan-300 font-bold">CYBER NETICS DIVISIONS:</div>
              {TRACKS.map((t, idx) => (
                <div key={t.id}>
                  {idx + 1}. <span className="text-white font-bold">{t.title}</span> ({t.meetingDay})
                </div>
              ))}
            </div>
          ),
        };
        break;

      case 'events':
        responseLog = {
          id: `res-${Date.now()}`,
          type: 'output',
          text: (
            <div className="space-y-1 text-xs">
              <div className="text-cyan-300 font-bold">NEXT UPCOMING CLUB EVENTS:</div>
              {UPCOMING_EVENTS.slice(0, 3).map((e) => (
                <div key={e.id} className="text-slate-300">
                  • <span className="text-emerald-400 font-bold">{e.date}</span>: {e.title} ({e.room})
                </div>
              ))}
            </div>
          ),
        };
        break;

      case 'whoami':
        responseLog = {
          id: `res-${Date.now()}`,
          type: 'output',
          text: (
            <div className="text-xs text-slate-300">
              user: student_recruit | host: cybernetics-station-4 | uid=1337(recruit) gid=1337(cybernetics) groups=1337(cybernetics),1000(hackers)
            </div>
          ),
        };
        break;

      case 'matrix':
        responseLog = {
          id: `res-${Date.now()}`,
          type: 'output',
          text: (
            <div className="text-emerald-400 font-mono text-[11px] leading-tight select-none">
              <div>01000011 01111001 01100010 01100101 01110010 01001110 01100101 01110100 01101001 01100011 01110011</div>
              <div>[SYSTEM BREACH EMULATION] [DEFENSIVE SHIELDS RAISED] [PACKET INJECTION ACTIVE]</div>
              <div>10110001 11010010 00101101 11000101 11010101 01010100 11010001 10010101 10101010 01011010 11010101</div>
              <div className="text-cyan-300">[+] Welcome to the rabbit hole. Type &quot;challenge&quot; to begin.</div>
            </div>
          ),
        };
        break;

      case 'sudo':
        responseLog = {
          id: `res-${Date.now()}`,
          type: 'error',
          text: '[-] [SECURITY ALERT] User recruit is not in the sudoers file. This incident has been logged and sent to President 0xMaya.',
        };
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      default:
        responseLog = {
          id: `res-${Date.now()}`,
          type: 'error',
          text: `[-] Command not recognized: "${cmd}". Type "help" for a list of commands.`,
        };
        break;
    }

    setLogs((prev) => [...prev, userLog, responseLog]);
    setInputVal('');
  };

  const executeShortcut = (commandText: string) => {
    setInputVal(commandText);
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 50);
  };

  const copyFlag = () => {
    navigator.clipboard.writeText(TERMINAL_EASTER_EGG.flag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="terminal" className="py-20 bg-[#070b14] border-t border-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-400 text-xs font-mono">
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>// 03. INTERACTIVE RECRUIT CTF SHELL</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Crack The Entrance Challenge
          </h2>
          <p className="text-slate-400 text-sm">
            Interact with our simulated club server. Discover hidden commands, decompile the cipher, and submit the recruit flag to unlock VIP status on your application!
          </p>
        </div>

        {/* Terminal Window Box */}
        <div className="rounded-2xl bg-[#0a0f1d] border border-cyan-900/70 shadow-2xl overflow-hidden terminal-glow">
          {/* Terminal Titlebar */}
          <div className="px-4 py-3 bg-[#080d19] border-b border-slate-800/90 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80 cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80 cursor-pointer" />
              <span className="ml-3 text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <span>cybernetics@lab-shell:~$</span>
                <span className="text-slate-500">zsh</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              {hasSolvedFlag ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-xs font-mono font-bold">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>FLAG_CAPTURED</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[11px] font-mono">
                  <span>UNSOLVED</span>
                </div>
              )}
              <button
                onClick={() => {
                  setLogs([]);
                }}
                className="text-slate-500 hover:text-slate-300 text-xs p-1"
                title="Clear console"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Terminal Console Output */}
          <div
            ref={terminalBodyRef}
            onClick={() => inputRef.current?.focus({ preventScroll: true })}
            className="p-5 min-h-[320px] max-h-[460px] overflow-y-auto font-mono text-xs sm:text-sm space-y-3 terminal-scroll cursor-text bg-[#090d18]"
          >
            {logs.map((log) => (
              <div key={log.id}>
                {log.type === 'input' && (
                  <div className="text-cyan-400 font-bold flex items-center gap-2">
                    <span>{log.text}</span>
                  </div>
                )}
                {log.type === 'output' && (
                  <div className="text-slate-300 leading-relaxed">{log.text}</div>
                )}
                {log.type === 'error' && (
                  <div className="text-rose-400 bg-rose-950/20 p-2 rounded border border-rose-900/40">
                    {log.text}
                  </div>
                )}
                {log.type === 'success' && (
                  <div className="text-emerald-300">{log.text}</div>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Command Input Form */}
          <form
            onSubmit={handleCommandSubmit}
            className="border-t border-slate-800 bg-[#0b1222] px-4 py-3 flex items-center gap-3"
          >
            <span className="text-cyan-400 font-mono text-sm font-bold flex items-center gap-1 shrink-0">
              <span>$</span>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Try typing 'challenge', 'scan', 'help', or 'decode <b64>'..."
              className="w-full bg-transparent font-mono text-xs sm:text-sm text-white focus:outline-none placeholder:text-slate-500"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800/60 shrink-0 transition-colors"
              title="Run command"
            >
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Quick-Click Command Shortcuts Bar */}
          <div className="px-4 py-2.5 bg-[#080d19] border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 text-[11px] mr-1">Quick Run:</span>
            {[
              { label: 'challenge', cmd: 'challenge' },
              { label: 'decode', cmd: 'decode Q1lCRVJORVRJQ1N7aDRjazNyXzIwMjZfbjN0aWNzfQ==' },
              { label: 'flag', cmd: 'flag CYBERNETICS{h4ck3r_2026_n3tics}' },
              { label: 'scan', cmd: 'scan' },
              { label: 'status', cmd: 'status' },
              { label: 'matrix', cmd: 'matrix' },
              { label: 'help', cmd: 'help' },
            ].map((shortcut) => (
              <button
                key={shortcut.label}
                type="button"
                onClick={() => {
                  setInputVal(shortcut.cmd);
                  // Trigger immediately for smooth experience
                  setTimeout(() => {
                    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                    // set inputVal and run
                  }, 10);
                }}
                className="px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 hover:bg-cyan-950 hover:text-cyan-200 border border-slate-700/60 text-[11px] transition-all"
              >
                {shortcut.label}
              </button>
            ))}
          </div>
        </div>

        {/* Solved Banner Announcement */}
        {hasSolvedFlag && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-mono">
                  CHALLENGE FLAG DECRYPTED: <span className="text-emerald-400">{TERMINAL_EASTER_EGG.flag}</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Your VIP status is verified. Click below to fast-track your Cyber Netics membership registration!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyFlag}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700 text-xs"
                title="Copy flag"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={onOpenJoin}
                className="px-3.5 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-all shrink-0"
              >
                Apply with Verified Flag
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
