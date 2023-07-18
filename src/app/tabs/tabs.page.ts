import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../login-registro/userDataService';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  photo:string;

  constructor(private userDataService: UserDataService, private navCtrl: NavController) { 
    this.userDataService.photo$.subscribe(photo => {
      this.photo = photo;
    });
  }

  ngOnInit() {
  }

  goToProfile() {
    this.navCtrl.navigateForward(['/tabs/perfil'], {
      queryParams: { photo: this.photo }
    });
  }

}
