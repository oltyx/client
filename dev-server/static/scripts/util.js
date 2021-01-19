 /**
  * Because the code in this file is not bundled by babel, it must be compatible
  * with all the supported browsers version (see `browserlist` in `package.json`)
  * without transpilation. Do not include latest EcmaScript features as these
  * will cause exceptions while working on dev (`localhost:3000`) on slightly
  * older, yet supported browser versions.  
  * /

/** @type {string|null} */
export let activeClientUrl;

/**
 * Load the Hypothesis client into the page.
 *
 * @param {string} clientUrl
 */
export function loadClient(clientUrl) {
  const embedScript = document.createElement('script');
  embedScript.src = clientUrl;
  document.body.appendChild(embedScript);
  activeClientUrl = clientUrl;
}

/**
 * Remove the Hypothesis client from the page.
 *
 * This uses the same method as the browser extension does to deactivate the client.
 */
export function unloadClient() {
  const annotatorLink = document.querySelector('link[type="application/annotator+html"]');

if (annotatorLink) {
  annotatorLink.dispatchEvent(new Event('destroy'));
}
  activeClientUrl = null;
}
