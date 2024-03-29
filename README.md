# avdk

Opinionated alternative to `altv-pkg` (see [repository](https://github.com/altmp/altv-pkg)) which allows a developer to scaffold a project with ease.

![](/images/console.gif)

## Installation

1. Via `npm`: `npm i -g avdk`
2. Via `npx`: `npx avdk [command]`

## Getting Started

1. Create a new directory for your project: `mkdir my-new-project`;
2. Change into the new directory: `cd my-new-project`;
3. Run `avdk init` to scaffold the project;
4. Run `npm install` to install the dependencies;
5. Build the project with `npm run build`.
6. Ensure binaries and data files with `avdk ensure`;

You can then start the server with `npm run start:{windows, linux}` depending on your operating system.

## Commands

### `avdk init [resource-name]`

Scaffolds a new project in the current directory.

#### Options

-   `--{branch,b}`: the branch to use for the server binaries (default: `release`).
-   `--{voice,v}`: whether to load the Voice module or not (default: `false`).

### Example

```sh
avdk init # scaffolds a new project using the release branch for the server binaries
avdk init --branch=dev # scaffolds a new project using the dev branch for the server binaries
avdk init --branch=dev --voice # scaffolds a new project using the dev branch for the server binaries and with the voice module
```

### `avdk ensure`

Downloads the server binaries and data files. It will use the branch specified in the `avdk.json` file.

#### Example

```sh
avdk ensure
```

## License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
