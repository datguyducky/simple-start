# Simple Start

I've created this extension as I always felt that other browsers had better new tab views than Firefox. I wanted to have a simple and minimalistic new tab view that would allow me to organize my bookmarks into categories.
This is something that I use daily across different devices so there's no reason to be worried that this extension will no longer be supported.

<a href="https://addons.mozilla.org/en-US/firefox/addon/simple-start/"><img src="./readme-img/get-addon-firefox.svg" width="148" /></a>
<a href="https://chromewebstore.google.com/detail/simple-start/efllhkadadnbifclloeinnlpneehbkfh"><img src="./readme-img/get-addon-chrome.png" width="172" /></a>

<table align="center">
	<tr>
		<td><img src="./readme-img/simplestartold.png" width="240" /></td>
		<td><img src="./readme-img/simplestart.png" width="240" /></td>
	</tr>
	<tr align="center">
		<td>first version</td>
		<td>first and latest redesign</td>
	</tr>
</table>

## 🔑 Key features:

- Organize bookmarks into categories
- Add any website as a bookmark
- Synchronization between devices
- Different built-in themes (light and dark) and with option to create custom ones
- Very customizable
- Minimalistic
- Open-source
- Completely free to use

## 🤝 Contribution:

I strongly encourage to contribute to development of Simple Start extension. Bugs reports and new features suggestions can be made by creating a new issue - with appropriate title and description please.

**To test it locally, you need to follow this steps:**

- This extension is built with the [WXT](https://wxt.dev/) framework.
- Make sure you have `npm` installed on your machine.
- Run `npm install` in the root of the extension.
- To start in development mode, run `npm run dev` in the root of the extension (`npm run dev:chrome` for Chrome).
    - In development mode, WXT launches a temporary/restricted browser profile with the extension loaded and handles reloads automatically when files change.
- If needed, you can still load the extension manually in Firefox via `about:debugging` → `This Firefox` by choosing `dist/manifest.json`.

- Run `npm run build` to create a Firefox production build or `npm run build:chrome` for Chrome. Keep in mind that it may be required to delete the `dist` folder before running the build command for a different browser.

## 📦 Favicon Service

Simple Start uses [Besticon](https://github.com/mat/besticon) to provide users with correct icons for each and every website. It's an open-source favicon service, written in Go.
It's hosted on [Fly.io](https://fly.io/) from docker image, and with both the Prometheus metrics and the HTML pages disabled via the environment variables so no metrics are collected.

## 📝 License:

Simple Start extension is open-source project licensed under the [GLP-3.0 license](LICENSE).
