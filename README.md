# esuhail.github.io

My portfolio site: https://esuhail.github.io

## How it's built

Three files and some images. No framework, no build step, no dependencies.

```
index.html    all the content
style.css     layout and colors
main.js       the estimator demo, live GitHub dates, nav highlight
img/          project screenshots (WebP)
```

- **No build step.** GitHub Pages serves the files exactly as they are in the repo. Nothing to install, nothing that can break between deploys, and the page loads instantly.
- **Content lives in the HTML.** The page reads fine with JavaScript turned off. JavaScript only adds things on top.
- **The estimator is a port of `predict.py`** from [llm-bench](https://github.com/esuhail/llm-bench), using the default efficiency. Its numbers match the Python version for the same GPU and model.
- **"Last pushed" dates come from the GitHub API** in the visitor's browser. Unauthenticated calls are limited to 60 an hour per visitor, so responses are cached for the session. If the API fails, the dates just don't show.

## Run it locally

```
python -m http.server
```

Then open http://localhost:8000.

## Deploy

Push to `main`. GitHub Pages publishes the repo root (Settings → Pages → Deploy from a branch → `main` / root).
