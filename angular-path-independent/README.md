These are the code examples for our blog article ["Secret Tricks for Path-Independent Angular Apps"](https://symflower.com/en/company/blog/2021/path-independent-angular/). Each subfolder contains a real, usable Angular app that reproduces a scenario from the article.

## Setup

The following software is required to run the examples:

  - NPM
  - [Caddy](https://caddyserver.com/) webserver binary on your `$PATH`

Every example contains a `run` script which rebuilds the app (takes a while) and starts a browser. The scripts are written for Linux but it should be possible to run them on Windows with WSL2 and maybe some tweaks.

It is also required to run `npm install` in an example folder before using its `run` script for the first time. To speed things up for the next example, the `node_modules` folder can be copied. Alternatively, PNPM can be used to avoid downloading dependencies multiple times.

## Examples

| Folder | Demonstrates what? | Chapter in blog post |
|-|-|-|
| `1-not-path-independent-by-default` | Angular apps do not work regardless of what path they are hosted at by default | [Introduction](https://symflower.com/en/company/blog/2021/path-independent-angular/) |
| `2-quick-solution` | A quick solution to make Angular apps work from any path without recompilation | [The Solution (most likely)](https://symflower.com/en/company/blog/2021/path-independent-angular/#the-solution-most-likely) |
| `3-no-server-side-redirect` | The quick solution breaks when the hosting server does not have a certain feature | [About That Trailing Slash...](https://symflower.com/en/company/blog/2021/path-independent-angular/#about-that-trailing-slash) |
| `4-inline-script-hack` | A workaround to compensate for that missing feature | [The Inline-Script Hack](https://symflower.com/en/company/blog/2021/path-independent-angular/#the-inline-script-hack) |
| `5-history-api-override` | How to get rid of the trailing slash at the end of the path in URLs (very hacky) | [After Hours: Slash the Slash](https://symflower.com/en/company/blog/2021/path-independent-angular/#after-hours-slash-the-slash) |
