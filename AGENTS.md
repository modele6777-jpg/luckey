# AGENTS.md

## Persistent Project Rules

### 1. Mandatory Version & Upgrade Changelog Tracking
Every time a user request is completed or changes are made to the codebase:
1. **Increment Version Number**: Increment the patch version number in `package.json` (e.g. `1.2.459` -> `1.2.460`).
2. **Update `public/version.json`**: Update with the new version string, current ISO timestamp, concise summary, and list of changes in `items`.
3. **Prepend `public/changelog.json`**: Add a new changelog object at the top of the array in `public/changelog.json` matching the new version, summary, builtAt, and bulleted items.
4. **Compile & Lint Verification**: Always run `npm run lint` and `npm run build` to ensure successful compilation after version bump and edits.
5. **Mandatory Git Commit & Push**: Always stage all changes (`git add .`), create a descriptive commit message with the version number, and push to remote repository (`git push`).
