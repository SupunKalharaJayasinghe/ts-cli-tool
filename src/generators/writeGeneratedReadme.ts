import path from 'node:path';
import type { CreatePlan } from '../types.js';
import { writeFileSafe } from '../utils/files.js';
import { toTitle } from '../utils/strings.js';
import { starterBranding } from './starterBranding.js';

export async function writeGeneratedReadme(plan: CreatePlan): Promise<void> {
  const modules =
    plan.modules.length > 0
      ? plan.modules.map((module) => `- ${module}`).join('\n')
      : '- none';

  const envInstructions = plan.modules.includes('env-example')
    ? `

## Environment

Create your local environment file:

\`\`\`bash
cp .env.example .env
\`\`\`

On Windows PowerShell:

\`\`\`powershell
Copy-Item .env.example .env
\`\`\`
`
    : '';

  const databaseInstructions = plan.modules.includes('prisma')
    ? `

## Database

After configuring your \`.env\` file, push the Prisma schema:

\`\`\`bash
npm run db:push
\`\`\`

Open Prisma Studio:

\`\`\`bash
npm run db
\`\`\`
`
    : '';

  const dockerInstructions = plan.modules.includes('docker')
    ? `

## Docker

Build and run the project with Docker when needed.

If \`docker-compose.yml\` was generated, start services with:

\`\`\`bash
docker compose up -d
\`\`\`
`
    : '';

  await writeFileSafe(
    path.join(plan.targetPath, 'README.md'),
    `# ${toTitle(plan.projectName)}

This project was bootstrapped with [${starterBranding.cliName}](https://github.com/SupunKalharaJayasinghe/ts-cli-tool) (${starterBranding.version} - ${starterBranding.releaseName}).

## Documentation Links
- **CLI Repository**: [GitHub](${starterBranding.githubUrl})
- **Release Documentation**: [Medium Docs](${starterBranding.mediumUrl})

## Blueprint & Shape
- **Blueprint Type**: \`${plan.blueprint}\`
- **Project Structure**: \`${plan.shape}\`

## Enabled Modules
${modules}

## Getting started

Install dependencies:

\`\`\`bash
npm install
\`\`\`

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Customizing the Starter UI

You can easily modify pages, layouts, and components:
- **Pages**: Edit code in \`src/app/\` (e.g., \`src/app/page.tsx\`).
- **Styles**: Global theme properties are managed in \`src/app/globals.css\`.
- **Components**: Shared layout items are located in \`src/components/\` using premium \`lucide-react\` icons.
${envInstructions}${databaseInstructions}${dockerInstructions}
`
  );
}
