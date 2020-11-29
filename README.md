# oidc-client-adb2c-integration-ex

A sample angular project demonstrates how to authenticate against Azure AD or Azure ADB2C using oidc-client-js library.

The project has two branches:

- branch 'feature/implicit-adb2c' has codes to authenticate a user via OIDC implicit flow.
- branch 'feature/authorization-pkce-azuread' has the codes to connect to azure ad (_not azure adb2c_) via authorization code flow with PKCE. It appears it is possible to use authorization code flow to connect to azure adb2c; however, I just have not tried it.

The project currently connects to my adb2c tenant. To connect to your own b2c tenant, modify the oidc-settings.json under app/assets folder.

Check out the accompanying posts via the links below:

- [Authenticate user against Azure ADB2C using oidc-client-js](https://www.taithienbo.com/how-to-authenticate-user-against-azure-adb2c-from-angular-app-using-oidc-client-js/)
- [Integrate Azure ADB2C edit-profile user flow](https://www.taithienbo.com/integrate-azure-ad-b2c-profile-editing-user-flow-in-angular-using-oidc-client-js/)
- [Integrate Azure ADB2C reset password user flow](https://www.taithienbo.com/integrate-azure-ad-b2c-reset-password-user-flow-in-angular-using-oidc-client-js/)


