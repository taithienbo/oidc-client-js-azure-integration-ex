import { Injectable, OnDestroy } from '@angular/core';
import { UserManager, User } from 'oidc-client';
import { BehaviorSubject, from, Observable, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { OidcSettings, SettingsService } from './settings.service';
import { Log } from 'oidc-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private isReadySubject: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private userManager: UserManager;
  private oidcSettings$: Subscription;
  private oidcSettings: OidcSettings;
  private userSubject: BehaviorSubject<User> = new BehaviorSubject(null);
  private userLoadedCallback = (user) => {
    console.log(
      'AuthService: on userLoadedCallback. Got user: ' + (user !== null)
    );
    this.userSubject.next(user);
  };

  private userUnloadedCallback = () => {
    console.log('AuthService: on UserUnloadedCallback.');
    this.userSubject.next(null);
  };

  constructor(private settingsSerivice: SettingsService) {
    this.instantiate();
  }

  get isReady(): Observable<boolean> {
    return this.isReadySubject.asObservable();
  }

  get user(): Observable<User> {
    return this.userSubject.asObservable();
  }

  get settings(): OidcSettings {
    return this.oidcSettings;
  }

  loadUser() {
    return this.userManager.getUser();
  }

  ngOnDestroy(): void {
    if (this.oidcSettings$) {
      this.oidcSettings$.unsubscribe();
    }
    if (this.userManager) {
      this.userManager.events.removeUserLoaded(this.userLoadedCallback);
      this.userManager.events.removeUserUnloaded(this.userUnloadedCallback);
    }
  }

  public async loginRedirect(): Promise<any> {
    return await this.userManager.signinRedirect();
  }

  public async loginSilent(): Promise<User> {
    return await this.userManager.signinSilent();
  }

  public async logoutRedirect(): Promise<any> {
    await this.userManager.signoutRedirect();
    await this.userManager.clearStaleState();
  }

  public loginRedirectCallback() {
    return this.userManager.signinRedirectCallback();
  }

  public instantiate() {
    Log.logger = console;
    Log.level = Log.DEBUG;
    this.oidcSettings$ = this.settingsSerivice.oidcSettings.subscribe(
      (settings) => {
        if (settings) {
          this.userManager = new UserManager(settings);
          this.userManager.events.addUserLoaded(this.userLoadedCallback);
          this.userManager.events.addUserUnloaded(this.userUnloadedCallback);
          this.oidcSettings = settings;
          this.isReadySubject.next(true);
        }
      }
    );
  }
}
