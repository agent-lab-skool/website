import fs from "fs";
import path from "path";

export interface GuideBlock {
  type: "text" | "code" | "heading3" | "bullet" | "link" | "image";
  content?: string;
  language?: string;
  items?: string[];
  text?: string;
  url?: string;
}

export interface GuideSection {
  emoji?: string;
  heading: string;
  blocks: GuideBlock[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  date: string;
  intro: string;
  sections: GuideSection[];
  example?: GuideSection;
  proTips?: { title: string; body: string }[];
}

const GUIDES_DIR = path.join(process.cwd(), "content/guides");

export function getAllGuides(): Guide[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".json"));
  return files
    .map((f) => {
      const raw = fs.readFileSync(path.join(GUIDES_DIR, f), "utf-8");
      return JSON.parse(raw) as Guide;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getGuide(slug: string): Guide | null {
  const filePath = path.join(GUIDES_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Guide;
}
