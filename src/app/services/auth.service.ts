import { Injectable } from '@angular/core';
import { UserManager, User } from 'oidc-client';
import { environment } from '../../environments/environment'; 
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  _userManager: UserManager; 

  constructor() { 
      this.instantiate(); 
  }

  public async loginRedirect(): Promise<any> {
      return await this._userManager.signinRedirect(); 
  }

  public async loginSilent(): Promise<User> {
    var user = await this._userManager.signinSilent(); 
    return user; 
  }


  public async logoutRedirect(): Promise<any> {
      await this._userManager.signoutRedirect();
      await this._userManager.clearStaleState(); 
  }

  public addUserUnloadedCallback(callback): void {
      this._userManager.events.addUserUnloaded(callback);
  }

  public removeUserUnloadedCallback(callback): void {
      this._userManager.events.removeUserLoaded(callback);
  }

  public addUserLoadedCallback(callback): void {
      this._userManager.events.addUserLoaded(callback);
  }

  public removeUserLoadedCallback(callback): void {
      this._userManager.events.removeUserLoaded(callback);
  }

  public async accessToken(): Promise<string> {
      var user = await this._userManager.getUser();
      if (user == null) {
          throw new Error("User is not logged in");
      }
      return user.access_token;
  }


  public async getUser(): Promise<User> {
      return this._userManager.getUser();
  }

  public async handleCallBack() {
      var user = await this._userManager.signinRedirectCallback(); 
      console.log("Callback after sigin handled.", user);
  }

  public instantiate() {
      var settings = environment.oidcSettings;
      this._userManager = new UserManager(settings);
  }
}