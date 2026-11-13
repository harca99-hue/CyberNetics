import { CtfWriteup } from '../types';

function stripQuotes(val: string): string {
  const trimmed = val.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseListValue(raw: string): string[] {
  const trimmed = raw.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => stripQuotes(item))
      .filter(Boolean);
  }
  return trimmed
    .split(',')
    .map((item) => stripQuotes(item))
    .filter(Boolean);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Lightweight zero-dependency YAML-style frontmatter + Markdown parser
 * for CTF writeups authored in `.md` files under `/public/data/writeups/`.
 */
export function parseWriteupMarkdown(
  rawMarkdown: string,
  overrides: Partial<CtfWriteup> = {}
): CtfWriteup {
  const normalized = rawMarkdown.replace(/\r\n/g, '\n');
  const frontmatterMatch = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  const meta: Record<string, string | string[]> = {};
  let body = normalized.trim();

  if (frontmatterMatch) {
    const rawFm = frontmatterMatch[1];
    body = frontmatterMatch[2].trim();

    const lines = rawFm.split('\n');
    let activeArrayKey: string | null = null;

    for (const line of lines) {
      const listItemMatch = line.match(/^\s*-\s+(.*)$/);
      if (listItemMatch && activeArrayKey) {
        const current = meta[activeArrayKey];
        const nextArr = Array.isArray(current) ? current : [];
        nextArr.push(stripQuotes(listItemMatch[1]));
        meta[activeArrayKey] = nextArr;
        continue;
      }

      const kvMatch = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
      if (kvMatch) {
        const key = kvMatch[1];
        const rawVal = kvMatch[2].trim();
        if (rawVal === '') {
          // Subsequent `- item` lines will populate this key
          meta[key] = [];
          activeArrayKey = key;
        } else if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
          meta[key] = parseListValue(rawVal);
          activeArrayKey = null;
        } else {
          meta[key] = stripQuotes(rawVal);
          activeArrayKey = null;
        }
      }
    }
  }

  const getString = (key: string, fallback = ''): string => {
    const val = meta[key];
    if (Array.isArray(val)) return val.join(', ');
    return val ?? fallback;
  };

  const getArray = (key: string, fallback: string[] = []): string[] => {
    const val = meta[key];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.length > 0) return parseListValue(val);
    return fallback;
  };

  const title = overrides.title || getString('title', 'Untitled CTF Writeup');
  const pointsRaw = overrides.points ?? Number(getString('points', '100'));
  const points = Number.isFinite(pointsRaw) ? pointsRaw : 100;

  // Derive a clean fallback summary if frontmatter omitted it
  const firstParagraph =
    body
      .split('\n')
      .find((line) => line.trim() && !line.trim().startsWith('#') && !line.trim().startsWith('```'))
      ?.trim() ?? '';

  return {
    id: overrides.id || getString('id', slugify(title) || `wup-${Date.now()}`),
    title,
    slug: overrides.slug || getString('slug', slugify(title)),
    event: overrides.event || getString('event', 'Collegiate CTF Lab'),
    platform: overrides.platform || getString('platform', 'Collegiate CTF'),
    category: overrides.category || getString('category', 'Reverse Engineering'),
    difficulty: overrides.difficulty || getString('difficulty', 'Intermediate'),
    author: overrides.author || getString('author', 'Cyber Netics Member'),
    authorHandle: overrides.authorHandle || getString('authorHandle', '@cybernetics'),
    authorRole: overrides.authorRole || getString('authorRole', 'CTF Team Contributor'),
    date: overrides.date || getString('date', 'NOV 2026'),
    readTime: overrides.readTime || getString('readTime', '5 min read'),
    points,
    flag: overrides.flag || getString('flag', 'CYBERNETICS{redacted}'),
    summary: overrides.summary || getString('summary', firstParagraph),
    tags: overrides.tags?.length ? overrides.tags : getArray('tags', ['CTF', 'Writeup']),
    vulnerability:
      overrides.vulnerability || getString('vulnerability', 'Security misconfiguration / logic flaw'),
    toolsUsed: overrides.toolsUsed?.length ? overrides.toolsUsed : getArray('toolsUsed', ['Terminal']),
    lessonsLearned: overrides.lessonsLearned?.length
      ? overrides.lessonsLearned
      : getArray('lessonsLearned', []),
    exploitScript: overrides.exploitScript || getString('exploitScript') || undefined,
    markdownUrl: overrides.markdownUrl,
    markdownBody: body,
    sourceFormat: 'markdown',
  };
}
