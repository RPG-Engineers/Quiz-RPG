import { writeFileSync } from 'fs';

const generatePatchNotes = {
  generateNotes: async (pluginConfig, context) => {
    const { nextRelease } = context;
    const patchNotes = {
      version: nextRelease.version,
      notes: nextRelease.notes,
      date: new Date().toISOString(),
    };

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
      message: 'chore(release): :bookmark: Update changelog and patch notes [skip ci]',
    }],
  ],
};
