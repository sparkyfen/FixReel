declare global {
  interface String {
    format(options: { [find: string]: string }): string;
  }
}

/* Useful little function to format strings for us */
String.prototype.format = function (options: { [find: string]: string }) {
  return this.replace(/{([^{}]+)}/g, (match: string, name: string) => {
    if (options[name] !== undefined) {
      return options[name];
    }
    return match;
  });
};

/* Lots of strings! These are strings used in HTML or are shown to end users in embeds. */
export const Strings = {
  BASE_HTML: `<!DOCTYPE html><html {lang}><!--
    ______ _      _____           _ 
 |  ____(_)    |  __ \         | |
 | |__   ___  _| |__) |___  ___| |
 |  __| | \ \/ /  _  // _ \/ _ \ |
 | |    | |>  <| | \ \  __/  __/ |
 | |    |_/_/\_\_|  \_\___|\___|_|
 | |    A better Meta embedding service
 |_|    by @sparkyfen, et al. Inspired by FixTweet
--><head>{headers}</head>
<!-- Worker build ${RELEASE_NAME} -->`,
  ERROR_HTML: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta content="${BRANDING_NAME}" property="og:title"/>
      <meta content="Owie, you crashed ${BRANDING_NAME} :(
This is caused by Meta API downtime or a new bug. Try again in a little while." property="og:description"/></head>
      <title>:(</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          padding: 0 20px;
        }
        h1 {
          font-size: 4em;
          font-weight: 900;
          margin-bottom: 0;
        }
        p {
          font-size: 10px;
          opacity: 0.3;
        }
      </style>
    </head>
    <body>
      <h1>Owie :(</h1>
      <h2>You hit a snag that broke ${BRANDING_NAME}. It's not your fault though&mdash;This is usually caused by a Meta outage or a new bug.</h2>
      <p>${RELEASE_NAME}</p>
    </body>
  </html>`.replace(/( {2})/g, '').replace(/>[\s|\n]+</g, '><'),
  VERSION_HTML: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta content="${BRANDING_NAME}" property="og:title"/>
      <meta content="${BRANDING_NAME}" property="og:site_name"/>
      <meta content="https://cdn.discordapp.com/icons/958942151817977906/7a220767640cbedbf780767585eaa10d.png?size=96" property="og:image"/>
      <meta content="https://cdn.discordapp.com/icons/958942151817977906/7a220767640cbedbf780767585eaa10d.png?size=96" property="twitter:image"/>
      <meta content="#1E98F0" name="theme-color"/>
      <meta content="Worker release: ${RELEASE_NAME}
      
      Stats for nerds: 
      🕵️‍♂️ {ua}
      🌐 {ip}
      🌎 {city}, {region}, {country}
      🛴 {asn}
      Edge Connection:
      {rtt} 📶 {httpversion} 🔒 {tlsversion} ➡ ⛅ {colo}
      " property="og:description"/></head>
      <title>${BRANDING_NAME}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          padding: 0 20px;
        }
        h1 {
          font-size: 4em;
          font-weight: 900;
          margin-bottom: 0;
        }
        h2 {
          white-space: pre-wrap;
        }
        p {
          font-size: 10px;
          opacity: 0.3;
        }
        .cf {
          display: inline-block;
          vertical-align: middle;
          height: 48px;
          width: 48px;
        }
      </style>
    </head>
    <body>
      <h1>${BRANDING_NAME}</h1>
      <h3>A better Meta embedding service, by <a href="https://twitter.com/sparkyfen">@sparkyfen</a>, et al.</h2>
      <h2>Worker release: ${RELEASE_NAME}</h2>
      <br>
      <h3>Stats for nerds:</h3>
      <h2>Edge Connection:
      {rtt} 📶 {httpversion} 🔒 {tlsversion} ➡ <img class="cf" referrerpolicy="no-referrer" src="https://cdn.discordapp.com/emojis/988895299693080616.webp?size=96&quality=lossless"> {colo}</h2>
      <h2>User Agent:
      {ua}</h2>
    </body>
  </html>`.replace(/( {2})/g, '').replace(/>[\s|\n]+</g, '><'),
};