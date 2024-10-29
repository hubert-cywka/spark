// https://github.com/vercel/next.js/discussions/54152
// Inline scripts are created for RSC. This forces us to either use nonce (and drop support for static pages) or to modify CSP (which will be a security issue).
// This script is a workaround. TODO: Come back in few months and check if we still need this script.

import { createHash } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";
import { resolve } from "path";

import config from "../next.config.mjs";
const { basePath, distDir } = config;

// pretend we are in a production build
process.env.NODE_ENV = "production";

const MAGIC_STRING = "__this_is_a_placeholder_for_the_inline_scripts__";

const baseDir = resolve(distDir.replace(/^\//, ""));
const htmlFiles = globSync(`${baseDir}/**/*.html`);

htmlFiles.forEach((file) => {
    // grab inline scripts from each html file
    const contents = readFileSync(file).toString();
    const scripts = [];
    const newFile = contents.replace(/<script>(.+?)<\/script>/g, (_, data) => {
        const addMagicString = scripts.length === 0;
        scripts.push(`${data}${data.endsWith(";") ? "" : ";"}`);
        return addMagicString ? MAGIC_STRING : "";
    });

    // early exit if we have no inline scripts
    if (!scripts.length) {
        return;
    }

    // combine all the inline scripts, add a hash, and reference the new file
    const chunk = scripts.join("");
    const hash = createHash("md5").update(chunk).digest("hex");

    writeFileSync(`${baseDir}/static/chunks/chunk.${hash}.js`, chunk);
    writeFileSync(
        file,
        newFile.replace(
            MAGIC_STRING,
            `<script src="${basePath}${basePath.endsWith("/") ? "" : "/"}_next/static/chunks/chunk.${hash}.js" crossorigin=""></script>`
        )
    );
});
