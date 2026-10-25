// prod only ever gains commits from dev plus its own stable version commits, so when dev's beta version commit races a
// stable release the conflicts are limited to release files and prod's release state can always win.

function splitSections(changelog) {
  const [preamble, ...sections] = changelog.split(/^(?=## )/m);
  return { preamble, sections };
}

const headingOf = (section) => section.slice(0, section.indexOf("\n")).trim();

/** Prod's changelog with dev's unreleased sections (beta entries prod never saw) kept below the new stable ones. */
export function mergeChangelog(dev, prod) {
  const prodParts = splitSections(prod);
  const devSections = splitSections(dev).sections;
  const prodHeadings = new Set(prodParts.sections.map(headingOf));
  const devHeadings = new Set(devSections.map(headingOf));
  const devOnly = devSections.filter((section) => !prodHeadings.has(headingOf(section)));

  const firstShared = prodParts.sections.findIndex((section) => devHeadings.has(headingOf(section)));
  const splitAt = firstShared === -1 ? prodParts.sections.length : firstShared;

  return [
    prodParts.preamble,
    ...prodParts.sections.slice(0, splitAt),
    ...devOnly,
    ...prodParts.sections.slice(splitAt)
  ].join("");
}

/** Dev's package.json (it may have new dependencies) with prod's released version. */
export function mergePackageJson(dev, prod) {
  const { version } = JSON.parse(prod);
  return dev.replace(/^(\s*"version":\s*)"[^"]*"/m, `$1"${version}"`);
}
