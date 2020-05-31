// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  hmr: false,
  API_ENDPOINT: 'http://localhost:64274/api/',
  // API_ENDPOINT: 'https://www.dforty.com:8080/api/',
  LOGIN_URL: 'login',
  HOME_URL: 'view-profile',
  DEFUALT_LIMIT: 10,
};
