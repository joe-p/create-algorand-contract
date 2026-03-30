#!/usr/bin/env node

import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function toPascalCase(str) {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function copyRecursive(src, dest, projectName) {
  const stats = statSync(src);

  if (stats.isDirectory()) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }

    for (const item of readdirSync(src)) {
      copyRecursive(join(src, item), join(dest, item), projectName);
    }
  } else {
    let content = readFileSync(src, "utf-8");
    const className = toPascalCase(projectName);
    content = content.replace(/\{\{name\}\}/g, projectName);
    content = content.replace(/\{\{className\}\}/g, className);
    
    // Handle file renaming for contract files
    const srcFileName = basename(src);
    let destFileName = srcFileName;
    if (srcFileName === 'hello.algo.ts') {
      destFileName = `${className}.algo.ts`;
    } else if (srcFileName === 'hello.test.ts') {
      destFileName = `${className}.test.ts`;
    }
    
    // dest already includes the original filename, so we need to replace it
    const destDir = dirname(dest);
    writeFileSync(join(destDir, destFileName), content);
  }
}

function main() {
  const projectName = process.argv[2];

  if (!projectName || projectName.startsWith("-")) {
    console.log("Usage: npm create algorand-contract <project-name>");
    console.log("\nExample:");
    console.log("  npm create algorand-contract my-algorand-project");
    process.exit(0);
  }

  if (existsSync(projectName)) {
    console.error(`Error: Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  const templateDir = join(__dirname, "..", "template");
  const targetDir = join(process.cwd(), projectName);

  console.log(`\nCreating ${projectName}...\n`);

  copyRecursive(templateDir, targetDir, projectName);

  console.log(`✓ Created project ${projectName}\n`);
  console.log("To get started:");
  console.log(`  cd ${projectName}`);
  console.log("  npm install");
  console.log("  npm run build");
  console.log("  npm run test");
}

main();
