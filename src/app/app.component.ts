import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
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
  user: any;

  userJson: string;

  private routeFragments$: Subscription;
  private user$: Subscription;
  private authServiceIsReady$: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnDestroy(): void {
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
    console.log('AppComponent ngOnInit() called.');
    const idTokenKeyWord = 'id_token';
    const accessTokenKeyWord = 'access_token';
    const errorDescriptionKeyWord = 'error_description';
    const cancellationCode = 'AADB2C90091';
    const resetPasswordCode = 'AADB2C90118';
    this.authServiceIsReady$ = this.authService.isReady.subscribe((isReady) => {
      if (isReady) {
        this.route.fragment.subscribe((fragment) => {
          const params = new URLSearchParams(fragment);
          const idToken = params.get(idTokenKeyWord);
          const accessToken = params.get(accessTokenKeyWord);
          const errorDescription = params.get(errorDescriptionKeyWord);
          if (idToken && accessToken) {
            this.handleIdAndAccessToken();
          } else if (idToken) {
            this.handleIdToken();
          } else if (
            errorDescription &&
            errorDescription.includes(cancellationCode)
          ) {
            this.handleUserCancellation();
          } else if (
            errorDescription &&
            errorDescription.includes(resetPasswordCode)
          ) {
            this.handlePasswordReset();
          } else {
            //
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

  private handlePasswordReset() {
    // we simply redirect the user to the reset password page.
    window.location.href = this.authService.settings.resetPasswordRoute;
  }

  private handleUserCancellation() {
    // The user has clicked Cancel from an azure adb2c user flow page (e.g.
    // user has cancelled the reset password or edit profile process).
    // In a real app, you may want to navigate the user back to the home
    // page or do something else. However, here, I simply ignore the result.
  }

  private handleIdAndAccessToken() {
    // if both id and access tokens are in the URL, it means the user
    // has come back from a successful authentication. We call the
    // library to handle the result (e.g. store the user and state in storage)
    this.authService.loginRedirectCallback().then((user) => {
      this.user = user;
    });
  }

  private handleIdToken() {
    // If the user has come back from the edit profile page, the
    // user object is still present in the storage, and we can do a
    // silent login to pick up any changes to the profile if desired. However,
    // if the user has reset the password, the user object is no longer
    // available, and the user needs to login again.
    this.authService.loadUser().then((user) => {
      if (user) {
        // user has come back after edit profile.
        this.authService.loginSilent().then((u) => {
          this.user = u;
        });
      } else {
        // user has come back after reset password and need to login again.
        this.authService.loginRedirect();
      }
    });
  }
}
