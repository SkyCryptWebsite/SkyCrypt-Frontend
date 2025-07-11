# Contributing to SkyCrypt

Before contributing to SkyCrypt, make sure you install the development environment first. If you have trouble building SkyCrypt or have any development questions, please don't hesitate to contact us on [Discord](https://discord.gg/cNgADv2kEQ)!

## Prerequisite Software

- [Node.js](https://nodejs.org) (at least v22, as some of the features we use require it)
- [pnpm](https://pnpm.io/) (Package manager)
- [MongoDB](https://docs.mongodb.com/manual/administration/install-community/), alternatively you can use the free online version (more instructions below)
- [Redis](https://redis.io/docs/getting-started/installation/)
- A [Hypixel API key](https://api.hypixel.net/)
- [Nginx](https://www.nginx.com/) (Optional but an ideal choice for full deployment)

## Getting Started

1. Clone the repository. You can do this on the command line by running

   ```
   git clone --recurse-submodules https://github.com/SkyCryptWebsite/SkyCryptv2.git
   ```

   Alternatively, you can use a git GUI like GitHub Desktop or VS Code to clone it.

2. Run `pnpm i` in the project directory to install the necessary dependencies.
3. Duplicate the `.env.example` file and rename it to `.env`. This file contains environment variables that are used by the application.
4. Go to [developer.hypixel.net](https://developer.hypixel.net/dashboard). Click `Create API Key` and copy the result.
5. Open the just created `.env` file and input your Hypixel API key in the `HYPIXEL_API_KEY` field.
6. The `MONGO_HOST`, `MONGO_PORT`, `MONGO_DATABASE`, `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD` fields don't need to be changed if you are using the default local MongoDB and Redis instances. If you are using a remote MongoDB or Redis instance, you can change these fields accordingly.
7. The `DISCORD_WEBHOOK` field is optional, it's used to send errors remotely, useful in production to detect bugs.
8. Make sure your Mongo and Redis instances are running.
9. Start the server:

- For development, run `pnpm dev` in the project directory
- For production, run the following commands in order:
  1. `pnpm build` to build the project.
  2. `node build` to start the production server, or `pnpm preview` to use Vite's preview server (not recommended for production deployment).

10. You can now open your browser and go to the address listen in the terminal

- For development, by default, the address is `http://localhost:5173`.
- For preview, by default, the address is `http://localhost:4173`
- For production, by default, the address is `http://localhost:3000`.

### VS Code

If you're not sure what code editor to use VS Code ([Visual Studio Code](https://code.visualstudio.com/)) is a great option. Here are some recommendations for using VS-Code to work on SkyCrypt.

#### Recommended Extensions

VS Code will automatically suggest the extentions we set in the `.vscode/extensions.json` file. Just go to the Extensions tab, click on the `Filter Extensions...` button, and select the `Recommended` filter. Install all the extensions that are listed there.

#### Recommended Settings

VS Code will automatically use our recommended settings in the `.vscode/settings.json` file. Overriding your global settings. If you want to change any of the settings, which we don't recommend, you can do so by changing the settings in the `.vscode/settings.json` file or deleting the file altogether to use your global settings.

Please ensure that you don't accidentally commit the changes you made to the `.vscode/settings.json` file if that's not intended for your contribution. You can do this by adding the file to your `.gitignore` file.

## Pull Requests

When you are ready to submit your changes, please create a pull request (PR) on GitHub. Make sure to check the following:

- Your code is well formatted and follows the project's coding style. Run `pnpm lint` to check for linting errors. If there are any `prettier` errors, run `pnpm format` to fix them. If there are any `eslint` or `svelte-check` errors, fix them manually.
- Your code builds successfully. Run `pnpm build` to check for build errors.
- Your PR has a clear title and description explaining the changes you made.

## Issues

If you find a bug or have a feature request, please open an issue on GitHub or on our [Discord server](https://discord.gg/cNgADv2kEQ). When opening an issue, please provide as much information as possible, follow the issue template, and include any relevant screenshots or error messages. This will help us understand the problem and address it more quickly.

## License

By contributing to SkyCrypt, you agree that your contributions will be licensed under the [MIT License](https://github.com/SkyCryptWebsite/SkyCryptv2/blob/prod/LICENSE). This means that your contributions will be open source and available for anyone to use, modify, and distribute.
