# oidc-client-adb2c-integration-ex
A sample angular project demonstrates how to authenticate against Azure AD or Azure ADB2C  using oidc-client-js library.


The project currently connects to my adb2c tenant. To connect to your own b2c tenant, modify the oidc-settings.json under app/assets folder. 

For an example of connecting to azure adb2c via implicit flow, checkout the branch feature/implicit-adb2c. For more info, checkout the accompanying blog [authenticate user against AD B2C](https://www.taithienbo.com/how-to-authenticate-user-against-azure-adb2c-from-angular-app-using-oidc-client-js/) and [integrate profile editing user flow](https://www.taithienbo.com/integrate-azure-ad-b2c-profile-editing-user-flow-in-angular-using-oidc-client-js/).

The other branch: feature/authorization-pkce-azuread has updates to connect to azure ad via authorization code with PKCE. For more info, checkout the blog [post](https://www.taithienbo.com/obtain-access-token-via-authorization-code-grant-with-pkce-in-angular-using-oidc-client-js-and-microsoft-identity-platform/)
