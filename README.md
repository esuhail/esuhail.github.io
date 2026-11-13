# esuhail.github.io

My portfolio site: https://esuhail.github.io

## Stack

Vite, React and TypeScript, with icons from Lucide React. One plain CSS file holds all the styling.

```
src/content.ts            everything the page says (projects, skills, education)
src/components/           one component per section
src/lib/predict.ts        TypeScript port of llm-bench's speed estimator
src/lib/predict.test.ts   checks the port against the Python version's output
src/lib/github.ts         "last pushed" dates from the GitHub API
src/styles.css            design tokens, layout and breakpoints
public/img/               project screenshots (WebP)
```

## Design choices

- **Content is data.** Components only decide layout. Changing a project means editing `content.ts`.
- **One palette.** Stone neutrals plus one deep spruce accent, defined once as CSS variables.
- **A 4px spacing scale.** Every gap and padding comes from the `--s1` to `--s10` tokens.
- **Two breakpoints.** At 960px the 12-column layout becomes one column. At 600px the header and buttons switch to their phone forms.
- **GitHub data is optional.** Responses are cached for the session (the public API allows 60 calls an hour per visitor). If a call fails, the date is hidden.

## Run it

```
npm install
npm run dev      # http://localhost:5173
npm test         # estimator tests
npm run build    # type check + production build in dist/
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: install, test, build, publish to GitHub Pages.
One-time setup: Settings → Pages → Source: **GitHub Actions**.
