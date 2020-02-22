import { Component, OnInit } from '@angular/core';
import { User } from 'oidc-client';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  user: User; 

  userJson: string; 

  // callback method to execute when the user logs out. 
  private userUnloadedCallback: () => void; 
  // callback method to execute when the user logs in. 
  private userLoadedCallback: (user: User, router: Router, route: ActivatedRoute) => void; 
  
  constructor (private router: Router, private route: ActivatedRoute, 
    public authService: AuthService) {

    }

    private isTokenInURL(url: string) {
      return url.includes("id_token") || url.includes("access_token");
    }


     async ngOnInit(): Promise<void> {
      this.userUnloadedCallback = this.onUserUnLoadedCallback(this);
      this.userLoadedCallback = this.onUserLoadedCallback(this);
      this.authService.addUserUnloadedCallback(this.userUnloadedCallback);
      this.authService.addUserLoadedCallback(this.userLoadedCallback);
      this.user = await this.authService.getUser(); 

      if (this.isTokenInURL(this.router.url)) {
          this.authService.handleCallBack(); 
      }
    }


    private onUserLoadedCallback(instance: AppComponent) {
      return async function (user: User, router, route) {
        console.log("OnUserLoadedCallback(). Got user: ");
        console.log(user);
        instance.user = user; 
        instance.userJson = JSON.stringify(user);
      }
    }

    private onUserUnLoadedCallback(instance: AppComponent) {
      return async function() {
        console.log("OnUserUnloadedCallback().");
        instance.user = null;
      }
    }


    login() {
      this.authService.loginRedirect().then(user => {
        console.log("User logged in. Name: " + user.profile.name);
      }); 
    }

    logout() {
      this.authService.logoutRedirect().then(); 
    }
}
