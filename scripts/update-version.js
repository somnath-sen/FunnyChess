const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const pkgPath = path.join(rootDir, 'package.json');
const metaPath = path.join(rootDir, 'src', 'lib', 'version-meta.json');
const versionTsPath = path.join(rootDir, 'src', 'lib', 'version.ts');

// 1. Read package.json
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
let version = pkg.version || '0.1.1';

// Handle optional --bump flag to increment patch version in package.json
const shouldBumpPatch = process.argv.includes('--bump');
if (shouldBumpPatch) {
  const parts = version.split('.').map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    parts[2] += 1;
    version = parts.join('.');
    pkg.version = version;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    console.log(`[Version] Bumped package.json version to ${version}`);
  }
}

// 2. Read existing meta if available
let meta = { build: 22, commit: '6603c4c', updatedAt: new Date().toISOString() };
if (fs.existsSync(metaPath)) {
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch (e) {
    // fallback to defaults
  }
}

// 3. Query git information if available
let gitCommitCount = null;
let gitCommitHash = null;
let isDirty = false;

try {
  const countStr = execSync('git rev-list --count HEAD', { cwd: rootDir, stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
  const parsed = parseInt(countStr, 10);
  if (!isNaN(parsed)) {
    gitCommitCount = parsed;
  }
} catch (e) {
  // git not installed or shallow clone
}

try {
  const hashStr = execSync('git rev-parse --short HEAD', { cwd: rootDir, stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
  if (hashStr) {
    gitCommitHash = hashStr;
  }
} catch (e) {
  // fallback
}

try {
  const statusStr = execSync('git status --porcelain', { cwd: rootDir, stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
  isDirty = statusStr.length > 0;
} catch (e) {}

// Determine current build number (handling shallow clones on CI/Vercel)
let currentBuild = meta.build || 23;
if (gitCommitCount !== null) {
  currentBuild = Math.max(currentBuild, gitCommitCount + (isDirty ? 1 : 0));
} else {
  currentBuild += 1;
}

const commitHash = gitCommitHash || meta.commit || 'dev';
const nowIso = new Date().toISOString().split('T')[0];

const updatedMeta = {
  version,
  build: currentBuild,
  commit: commitHash,
  updatedAt: nowIso,
};

fs.writeFileSync(metaPath, JSON.stringify(updatedMeta, null, 2) + '\n', 'utf8');

// 4. Generate src/lib/version.ts
const versionLabel = `v${version}-b${currentBuild}`;
const stage = 'Beta';

const content = `/**
 * Application version configuration for FunnyChess.
 * Automatically generated and updated on every build/update via scripts/update-version.js.
 */
export const APP_VERSION = '${version}';
export const APP_BUILD = '${currentBuild}';
export const APP_COMMIT = '${commitHash}';
export const APP_VERSION_LABEL = '${versionLabel}';
export const APP_STAGE = '${stage}';
export const APP_UPDATED_AT = '${nowIso}';
`;

fs.writeFileSync(versionTsPath, content, 'utf8');
console.log(`[Version] Successfully updated to ${versionLabel} (${stage}) [Commit: ${commitHash}]`);
