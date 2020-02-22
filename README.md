# oidc-client-adb2c-integration-ex
A sample angular project demonstrates how to authenticate against Azure ADB2C using oidc-client-js library.


The project currently connects to my adb2c tenant. To connect to your own b2c tenant, modify the environment.ts file. 

```json
oidcSettings: { 
    client_id : "Replace with client id you register in your b2c tenant for this angular application", 
    authority: "https://{yourb2ctenantname}.b2clogin.com/tfp/{yourb2ctenantname}.onmicrosoft.com/{yourb2cpolicy}/v2.0/", 
    response_type: "id_token token", 
    post_logout_redirect_uri: "http://localhost:4200/", 
    loadUserInfo: false,
    redirect_uri: "http://localhost:4200/", 
    silent_redirect_uri: "http://localhost:4200/", 
    response_mode: "fragment", 
    scope: "https://{your b2c tenant name}.onmicrosoft.com/{name of app you registered in b2c for your web api}/user_impersonation openid profile" }
};
```

For more info, checkout the accompanying blog [post](https://www.taithienbo.com/how-to-authenticate-user-against-azure-adb2c-from-angular-app-using-oidc-client-js/).
