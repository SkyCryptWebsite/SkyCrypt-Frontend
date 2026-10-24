import { describe, expect, it } from "vitest";
import { mergeChangelog, mergePackageJson } from "./sync-conflicts.js";

const entry = (heading, text) => `## ${heading}\n\n### Patch Changes\n\n- ${text}\n\n`;

describe("mergeChangelog", () => {
  it("puts prod's stable section first and keeps dev's beta section prod never saw", () => {
    const shared = entry("4.5.0", "Older release");
    const dev = `# Changelog\n\n${entry("4.5.1-beta.0", "Fix")}${shared}`;
    const prod = `# Changelog\n\n${entry("4.5.1", "Fix")}${shared}`;

    expect(mergeChangelog(dev, prod)).toBe(
      `# Changelog\n\n${entry("4.5.1", "Fix")}${entry("4.5.1-beta.0", "Fix")}${shared}`
    );
  });

  it("does not duplicate sections both branches already have", () => {
    const changelog = `# Changelog\n\n${entry("4.5.1", "Fix")}${entry("4.5.1-beta.0", "Fix")}`;

    expect(mergeChangelog(changelog, changelog)).toBe(changelog);
  });

  it("keeps several new dev sections in their order", () => {
    const shared = entry("4.5.0", "Older release");
    const dev = `# Changelog\n\n${entry("4.5.2-beta.0", "Second")}${entry("4.5.1-beta.0", "First")}${shared}`;
    const prod = `# Changelog\n\n${entry("4.5.1", "First")}${shared}`;

    expect(mergeChangelog(dev, prod)).toBe(
      `# Changelog\n\n${entry("4.5.1", "First")}${entry("4.5.2-beta.0", "Second")}${entry("4.5.1-beta.0", "First")}${shared}`
    );
  });
});

describe("mergePackageJson", () => {
  it("takes prod's version and keeps dev's other changes", () => {
    const dev = `{\n  "name": "skycrypt-frontend",\n  "version": "4.5.1-beta.0",\n  "dependencies": {\n    "new-dep": "^1.0.0"\n  }\n}\n`;
    const prod = `{\n  "name": "skycrypt-frontend",\n  "version": "4.5.1",\n  "dependencies": {}\n}\n`;

    expect(mergePackageJson(dev, prod)).toBe(dev.replace("4.5.1-beta.0", "4.5.1"));
  });

  it("only touches the top-level version, not engine versions", () => {
    const dev = `{\n  "version": "4.5.1-beta.0",\n  "devEngines": {\n    "runtime": { "name": "node", "version": "^24.22.1" }\n  }\n}\n`;
    const prod = `{\n  "version": "4.5.1"\n}\n`;

    expect(mergePackageJson(dev, prod)).toContain(`"version": "^24.22.1"`);
  });
});
