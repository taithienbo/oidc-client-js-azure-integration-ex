// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  oidcSettings: { 
    client_id : "47ea6724-b21f-46de-9d17-7425920f77e4", 
    authority: "https://taithienbo.b2clogin.com/tfp/taithienbo.onmicrosoft.com/b2c_1_signupandsignin/v2.0/", 
    response_type: "id_token token", 
    post_logout_redirect_uri: "http://localhost:4200/", 
    loadUserInfo: false,
    redirect_uri: "http://localhost:4200/", 
    silent_redirect_uri: "http://localhost:4200/", 
    response_mode: "fragment", 
    scope: "https://taithienbo.onmicrosoft.com/mywebapi/user_impersonation openid profile" }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
