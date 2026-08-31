# Deploying SatQuery

Everything below is ready to run. The build is verified locally — `npm run build`
passes and all four routes render on the production server.

---

## 1. Push to GitHub

The repository is initialised with two commits on `main`. It has no remote yet,
because this machine has no GitHub credentials (`gh` is not installed and there
is no token or credential helper configured).

**Option A — with the GitHub CLI**

```bash
gh repo create satquery-ai --public --source=. --remote=origin --push
```

**Option B — create the repo in the browser, then**

```bash
git remote add origin https://github.com/<your-username>/satquery-ai.git
git push -u origin main
```

Set your identity first if git prompts for it:

```bash
git config user.name "Your Name"
git config user.email "you@example.com"
```

---

## 2. Deploy to Vercel

> **Note:** the Vercel CLI on this machine is currently logged out. Run
> `vercel login` once to restore it.

```bash
vercel login
```

Then, from the project directory:

```bash
vercel --prod
```

Accept the defaults — Vercel auto-detects Next.js. `.vercelignore` already keeps
`docs/`, `scripts/` and local tooling out of the upload.

**Preferred, once the repo is on GitHub:** import it from the Vercel dashboard
instead. Every push to `main` then redeploys automatically, which is what you
want during a hackathon.

Project settings that matter:

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (auto-detected) |
| Build command | `npm run build` (default) |
| Node version | 20.x or 22.x |
| Root directory | repository root |

---

## 3. Enable Google sign-in (optional)

The site deploys and runs fine without this. Until credentials are set,
`/workspace` shows a setup panel rather than a sign-in button — it never errors.

### Create the OAuth client

1. Open <https://console.cloud.google.com/apis/credentials>
2. **Create Credentials → OAuth client ID → Web application**
3. **Authorised JavaScript origins**
   ```
   http://localhost:3000
   https://<your-vercel-domain>
   ```
4. **Authorised redirect URIs**
   ```
   http://localhost:3000/api/auth/callback/google
   https://<your-vercel-domain>/api/auth/callback/google
   ```
5. Copy the client ID and client secret.

### Generate a session secret

```bash
npx auth secret
```

### Set the variables

Locally, create `.env.local` (gitignored):

```
AUTH_GOOGLE_ID=<client id>
AUTH_GOOGLE_SECRET=<client secret>
AUTH_SECRET=<generated secret>
```

On Vercel: **Project → Settings → Environment Variables**, add the same three to
Production and Preview, then redeploy.

> Add the preview domain to the redirect URIs too, or sign-in will fail on
> preview deployments while working in production.

---

## 4. After deploying

- Open `/` and let the hero video load once; the poster frame covers the gap.
- Open `/business` and confirm the market figures read correctly.
- Open `/workspace` — it should show either the setup panel or a Google button.
- Run the demo on `/#demo` end to end at least once before showing a judge.

---

## Verifying locally

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start   # production build, same as Vercel runs
```

Regenerate the satellite imagery (needs `numpy`, `opencv-python`, `Pillow`):

```bash
python scripts/build_imagery.py
```

Capture section screenshots for design review (dev server must be running):

```bash
npx playwright install chromium
node scripts/screenshot.mjs ./shots 1440 900
```
