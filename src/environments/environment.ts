// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  oidcSettings: {
    client_id : '{replace with client id of app registration for this angular app}',
    authority: 'https://login.microsoftonline.com/{replace with tenant id}/v2.0/',
    response_type: 'code',
    post_logout_redirect_uri: 'http://localhost:4200/',
    loadUserInfo: false,
    redirect_uri: 'http://localhost:4200/',
    silent_redirect_uri: 'http://localhost:4200/',
    scope: '{replace with scope you defined in Expose an API section of app registration for your API}/user_impersonation openid profile'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
