# Streetworks Consequences Explorer — Draft 5 (Smaller Files)

An interactive training website with nine clickable consequence points, nine short videos, and six layers of consequence propagation.

## Upload to GitHub

1. Extract this ZIP on your computer. **Upload the extracted contents, not the ZIP file itself.** GitHub does not extract the ZIP into a website.
2. Open your website repository on GitHub and choose **Add file → Upload files**.
3. Upload all the extracted files and the **assets** folder into the repository root. Keep the folder structure shown in this package.
4. Commit the changes to the branch used for your website.
5. For a repository publishing from its root, use **Settings → Pages → Deploy from a branch**, select your publishing branch (usually **main**) and **/(root)**, then save.

The package is ready for GitHub Pages. No build step or package installation is needed. Keep any existing custom-domain CNAME file in your repository.

GitHub instructions:
- [Upload files](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [Configure GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Files

- **index.html**: the page and its introductory note.
- **app.js**: numbered points, consequence selection and video playback.
- **scpf-data.js**: consequence explanations and SCPF pathways.
- **styles.css** and **propagation.css**: layout, colours and pathway styling.
- **assets/**: the main illustration and all nine videos.
- **.nojekyll**: enables direct static publication with GitHub Pages.

| Point | Consequence | Video |
| --- | --- | --- |
| 1 | Biodiversity | assets/biodiversity.mp4 |
| 2 | Commercial Unit | assets/commercial-unit.mp4 |
| 3 | Congestion | assets/congestion.mp4 |
| 4 | Direct Emissions | assets/direct-emissions.mp4 |
| 5 | Loading Bay/Delivery | assets/loading-bay.mp4 |
| 6 | Non-Motorised | assets/non-motorised.mp4 |
| 7 | Public Transport | assets/public-transport.mp4 |
| 8 | Resident | assets/resident.mp4 |
| 9 | Street Trees | assets/street-trees.mp4 |

The figures and media are for illustration and training purposes only.

Concept, Illustration and Course Design: Kelwalee Kenn Jutipanya and Bryony Bowman · 2026.

## Media Optimisation

All nine videos are compressed H.264 MP4 files at 1080 × 720 pixels. Clip length, frame rate and any existing audio are retained. The main illustration and website code are unchanged.

## Verification

JavaScript syntax, full video decoding, durations and local file references were checked. Browser playback and visual layout remain unverified.
