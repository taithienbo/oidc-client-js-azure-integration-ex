import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { User } from 'oidc-client';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { OidcSettings, SettingsService } from './services/settings.service';
import {
  HashLocationStrategy,
  LocationStrategy,
  Location,
} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    Location,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  user: User;

  userJson: string;

  private routeFragments$: Subscription;
  private user$: Subscription;
  private authServiceIsReady$: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {
    console.log('AppComponent constructor() called.');
  }

  ngOnDestroy(): void {
    console.log('AppComponent ngOnDestroy() called.');
    if (this.routeFragments$) {
      this.routeFragments$.unsubscribe();
    }
    if (this.user$) {
      this.user$.unsubscribe();
    }
    if (this.authServiceIsReady$) {
      this.authServiceIsReady$.unsubscribe();
    }
  }

  ngOnInit() {
    const idTokenKeyWord = 'id_token';
    const accessTokenKeyWord = 'access_token';
    const errorDescriptionKeyWord = 'error_description';
    const cancellationCode = 'AADB2C90091';
    console.log('AppComponent: ngOnInit called');
    this.authServiceIsReady$ = this.authService.isReady.subscribe((isReady) => {
      console.log('AppComponent: authService isReady: ' + isReady);
      if (isReady) {
        console.log('AppComponent: subscring to user object');
        this.user$ = this.authService.user.subscribe((user) => {
          console.log('AppComponent: user emitted: ' + (user !== null));
          if (user) {
            this.user = user;
            this.userJson = JSON.stringify(user);
          }
        });
        this.route.fragment.subscribe((fragment) => {
          const params = new URLSearchParams(fragment);
          const idToken = params.get(idTokenKeyWord);
          const accessToken = params.get(accessTokenKeyWord);
          const errorDescription = params.get(errorDescriptionKeyWord);
          console.log('AppComponent: Id token: ' + idToken);
          console.log('AppComponent errorCode: ' + errorDescription);
          if (idToken && accessToken) {
            // if both id and access tokens are in the URL, it means the user
            // has come back from a successful authentication.
            this.authService.loginRedirectCallback();
            // remove the tokens from the URL
            window.history.replaceState(null, document.title, window.origin);
          } else if (idToken) {
            // if only the id token is in the URL, it means the user has come
            // back on a successful edit profile or password reset user flow.
            // In either case, we pick up the changes by doing a silent login.
            this.authService.loginSilent().then(() => {
              window.history.replaceState(null, document.title, window.origin);
            });
          } else if (
            errorDescription &&
            errorDescription.includes(cancellationCode)
          ) {
            this.authService.loadUser();
            window.history.replaceState(null, document.title, window.origin);
          }
        });
      }
    });
  }

  login() {
    console.log('AppComponent: login() called.');
    this.authService
      .loginRedirect()
      .then(() => console.log('Login redirect finished.'));
  }

  logout() {
    console.log('AppComponent: logout() called.');
    this.authService.logoutRedirect().then();
  }

  editProfile() {
    const url = new URL(this.authService.settings.editProfileRoute);
    window.location.href = url.href;
  }

  keyWordInURLFound(searchWord: string, url: string): boolean {
    const index = url.indexOf(searchWord);
    if (index > -1) {
      return true;
    }
    return false;
  }
}
