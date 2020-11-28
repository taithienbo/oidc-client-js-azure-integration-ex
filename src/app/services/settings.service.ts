import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
// tslint:disable: variable-name
export class SettingsService {
  constructor(private httpClient: HttpClient) {
    this.loadOidcConfigs();
  }

  private oidcSettingsSubject: BehaviorSubject<OidcSettings> = new BehaviorSubject(
    null
  );

  get oidcSettings(): Observable<OidcSettings> {
    return this.oidcSettingsSubject.asObservable();
  }

  private loadOidcConfigs() {
    return this.httpClient
      .get('assets/oidc-settings.json')
      .subscribe((settings) => {
        this.oidcSettingsSubject.next(new OidcSettings(settings));
      });
  }
}

export interface RouteBuilderOptions {
  policyName: string;
  scope?: string;
  responseType?: string;
  redirectUri?: string;
  promptLogin?: boolean;
}

export class OidcSettings {
  client_id: string;
  response_type: string;
  response_mode: string;
  scope: string;
  loadUserInfo: boolean;
  signupSigninPolicy: string;
  tenantName: string;
  editProfilePolicy: string;
  resetPasswordPolicy: string;

  constructor(init?: Partial<OidcSettings>) {
    Object.assign(this, init);
  }

  get baseUrl() {
    return window.location.origin;
  }

  get post_logout_redirect_uri() {
    return this.baseUrl;
  }

  get silent_redirect_uri() {
    return `${this.baseUrl}/assets/signin_silent_callback.html`;
  }

  get redirect_uri() {
    return `${this.baseUrl}`;
  }

  get editProfileRoute() {
    return this.buildRoute({ policyName: this.editProfilePolicy });
  }

  get resetPasswordRoute() {
    return this.buildRoute({ policyName: this.resetPasswordPolicy });
  }

  get authority() {
    const url = new URL(
      `https://${this.tenantName}.b2clogin.com/tfp/${this.tenantName}.onmicrosoft.com/${this.signupSigninPolicy}/v2.0/`
    );
    return url.href;
  }

  private buildRoute(options: RouteBuilderOptions): string {
    const url = new URL(
      `https://${this.tenantName}.b2clogin.com/${this.tenantName}.onmicrosoft.com/oauth2/v2.0/authorize`
    );
    url.searchParams.append('p', options.policyName);
    url.searchParams.append('client_id', this.client_id);
    url.searchParams.append('nonce', 'defaultNonce');
    url.searchParams.append(
      'redirect_uri',
      options.redirectUri ? options.redirectUri : this.redirect_uri
    );
    url.searchParams.append('scope', options.scope ? options.scope : 'openid');
    url.searchParams.append(
      'response_type',
      options.responseType ? options.responseType : 'id_token'
    );
    if (options.promptLogin) {
      url.searchParams.append('prompt', 'login');
    }
    return url.href;
  }
}
