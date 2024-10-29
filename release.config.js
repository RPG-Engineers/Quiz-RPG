import { writeFileSync, readFileSync } from 'fs';

const generatePatchNotes = {
  generateNotes: async (pluginConfig, context) => {
    const { nextRelease } = context;

    // Lê o arquivo patch-notes.json existente ou cria um novo se não existir
    let patchNotes;
    try {
      patchNotes = JSON.parse(readFileSync('public/patch-notes.json', 'utf8'));
    } catch (error) {
      console.error(error)
      patchNotes = { versions: [] };
    }

    // Adiciona a nova versão no topo do array
    patchNotes.versions.unshift({
      version: nextRelease.version,
      date: new Date().toISOString().split('T')[0],
      notes: nextRelease.notes
    });

    // Atualiza a versão atual
    patchNotes.currentVersion = nextRelease.version;

    // Limita o histórico para as últimas 10 versões
    patchNotes.versions = patchNotes.versions.slice(0, 10);

    console.log('Gerando patch notes...');
    writeFileSync('public/patch-notes.json', JSON.stringify(patchNotes, null, 2));
    console.log('Patch notes gerados com sucesso em public/patch-notes.json');
  },
};

export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/npm', { npmPublish: false }],
    '@semantic-release/github',
    generatePatchNotes,
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'package.json', 'public/patch-notes.json'],
      message: 'chore(release): :bookmark: ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }],
  ],
};