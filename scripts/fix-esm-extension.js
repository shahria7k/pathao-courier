#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function fixExtensions(dir) {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			fixExtensions(filePath);
		} else if (file.endsWith(".js")) {
			// Rename .js to .mjs
			const newPath = filePath.replace(/\.js$/, ".mjs");
			fs.renameSync(filePath, newPath);

			// Update import statements in the file
			let content = fs.readFileSync(newPath, "utf8");
			content = content.replace(/from\s+['"](\.\/[^'"]+)\.js['"]/g, "from '$1.mjs'");
			content = content.replace(/from\s+['"](\.\.\/[^'"]+)\.js['"]/g, "from '$1.mjs'");
			fs.writeFileSync(newPath, content, "utf8");
		}
	}
}

const distEsmPath = path.join(__dirname, "..", "dist-esm");
if (fs.existsSync(distEsmPath)) {
	fixExtensions(distEsmPath);
	// Move .mjs files to dist
	const distPath = path.join(__dirname, "..", "dist");
	if (fs.existsSync(distPath)) {
		const moveFiles = (src, dest) => {
			const files = fs.readdirSync(src);
			for (const file of files) {
				const srcPath = path.join(src, file);
				const destPath = path.join(dest, file);
				if (fs.statSync(srcPath).isDirectory()) {
					if (!fs.existsSync(destPath)) {
						fs.mkdirSync(destPath, { recursive: true });
					}
					moveFiles(srcPath, destPath);
				} else if (file.endsWith(".mjs")) {
					fs.copyFileSync(srcPath, destPath);
				}
			}
		};
		moveFiles(distEsmPath, distPath);
	}
}
