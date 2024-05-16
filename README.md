# eslint-plugin-server-only

This plugin is designed to allow enforcing server-only imports through filenames.

Rules:

- Any file named with '.server' in its name (eg. `auth.server.ts`) must contain `import "server-only"`
  - Why do this? Next.js will throw build time error if this code is imported into client components (thus prevent leaking sensitive code / tokens)

Add to eslint config using "plugin:server-only/recommended"
