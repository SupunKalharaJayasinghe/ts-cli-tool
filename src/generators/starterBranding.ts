import path from 'node:path';
import { writeFileSafe } from '../utils/files.js';

export const starterBranding = {
  cliName: 'project-cli',
  version: 'v1.3.0',
  releaseName: 'Premium Blueprint Starters',
  githubUrl: 'https://github.com/SupunKalharaJayasinghe/ts-cli-tool',
  mediumUrl: 'https://medium.com/',
} as const;

export async function writeGlobalsCss(targetPath: string): Promise<void> {
  const content = `@import "tailwindcss";

:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 30rem),
    radial-gradient(circle at top right, rgba(99, 102, 241, 0.10), transparent 28rem),
    linear-gradient(180deg, #f8fafc 0%, #ffffff 42%, #eef2ff 100%);
  color: #0f172a;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font: inherit;
}
`;
  await writeFileSafe(path.join(targetPath, 'src/app/globals.css'), content);
}
