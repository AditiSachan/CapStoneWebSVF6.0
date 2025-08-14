# Downloading dotnet on Linux
Go to this website
```
https://dotnet.microsoft.com/en-us/download/dotnet/8.0
```

Download sdk for dotnet 8.0. Click on x64 for binaries if using x64 architecture. Click arm64 if running on M-series macbook. This should automatically download the binary as a tar file. 
```
cd Downloads
```
Go into downloads and run the following commands. (These commands were taken from the download page)

```
mkdir -p $HOME/dotnet && tar zxf dotnet-sdk-8.0.402-linux-x64.tar.gz -C $HOME/dotnet
export DOTNET_ROOT=$HOME/dotnet
export PATH=$PATH:$HOME/dotnet
```

Run the 2 export commands every time you open up a new terminal session. You could also edit the your shell profile to permanently add the commands. 

# Downloading node manager for frontend

Install Node Version Manager (nvm) by running the following command
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
```

Install Node version 20 by running following command
```
nvm install 20
```

You can check the node version by running following command. It should say v20.*.*
```
node -v
```


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

# How to run frontend
Go into frontend folder
```
cd frontend
```
Run npm run dev
```
npm run dev
```

# Contributors
Sanjana Dinesh <br />
Joshua Sy <br />
Samiksha Anirudh <br />
Joshua Wills <br />
Christian Tolentino <br />
