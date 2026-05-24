module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'docs', 'style', 'test', 'build', 'ci', 'perf', 'chore'],
    ],
    'scope-case': [2, 'always', ['kebab-case', 'camel-case', 'lower-case']],
    'subject-case': [0],
  },
};
