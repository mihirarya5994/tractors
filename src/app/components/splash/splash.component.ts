import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare const atag: any;

import { AppService } from '../../core/services/app.service';
import { RestService } from '../../core/services/rest.service';
import { ExternalInterfaceService } from '../../core/services/external-interface.service';
import { ProfileService } from '../../core/services/profile.service';
import { EventEmitterService } from 'src/app/core/services/event-emitter.service';
import { TrackerService } from 'src/app/core/services/tracker.service';

@Component({
  selector: 'bb-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
  initialProfile: any = {};
  profile;
  loading = true;
  digitalData;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private restService: RestService,
    private externalInterfaceService: ExternalInterfaceService,
    private profileService: ProfileService,
    private eventEmitterService: EventEmitterService,
    private trackerService : TrackerService
  ) {
    //  this.profile = this.profileService.getProfileSync();
    this.eventEmitterService.emit({type:"LANGUAGE_PASSED",data:{langSelected:'test'}});


    // let customerId;
    // var campaignData: any = this.appService.getAdobeData();
    // if (this.appService.getUserInfo().info && this.appService.getUserInfo().info.customerId) {
    //   customerId = this.appService.getUserInfo().info.customerId;
    // } else {
    //   customerId = '';
    // }
    // this.digitalData = {
    //   page: {
    //     pageName: 'MT20 splash page',
    //     pageInfo:
    //     {
    //       appName: 'Mahindra Tractors 2020'
    //     }
    //   },
    //   user: {
    //     bpid: customerId,
    //   },
    //   campaign: campaignData
    // };
    // atag(this.digitalData);
    this.trackerService.trackGAPages("Mahindra Tractors | Splash Page");
  }
  ngOnInit() {
    console.log('Event emitter reached');
    
    this.eventEmitterService.emit({type:"LANGUAGE_PASSED",data:{langSelected:'test'}});

    setTimeout(() => {
      console.log('in splash');
      this.router.navigate(['/bb']);
    }, 1500);
    this.loading = false;
    // this.activatedRoute.queryParams.subscribe((params) => {
    //   if (params.jwt) {
    //     this.appService.setUserInfo({ jwt: params.jwt });
    //   }
    //   if (params.directplay === 'true') {
    //     this.router.navigate(['/schedule']);
    //   }
    // });
    // this.profileService
    //   .getProfile()
    //   .subscribe(res => {
    //     console.log(res);

    //     this.profile = res;
    //     this.initialProfile = JSON.parse(JSON.stringify(res));
    // this.initialProfile.profileCompleted = [true, 'true'].indexOf(this.initialProfile.profileCompleted) > -1;
    // this.initialProfile.TnC = [true, 'true'].indexOf(this.initialProfile.TnC) > -1;
    // this.profile.TnC = [true, 'true'].indexOf(this.profile.TnC) > -1;
    // // this.profile.TnC = true;
    //   console.log(this.initialProfile);
    //   if (this.initialProfile.TnC) {
    //     setTimeout(() => {
    //       this.play();
    //     }, 1500);
    //   }
    //   if (this.profile.TnC){
    //     setTimeout(() => {
    //       // this.play()
    //     }, 1500);
    //   }
    //   this.loading = false;
    // });
  }

  acceptTnC() {
    if (!this.profile.TnC) {
      this.profileService
        .updateProfile({ firstLogin: false })
        .subscribe(() => {
          this.profile.TnC = true;
        });
    }
  }

  navigateToTnC() {
    this.externalInterfaceService.launchBrowser(this.appService.getConfigParam('TNC_URL'));
  }

  play() {
    // this.profileService.getProfile().subscribe(res=>{
    //   console.log(res);
    // })
    if (this.profile.TnC) {
      // gtag('event', 'Play_Now_New_User', {
      //   event_category: 'Andhadhun_Movie_Quiz',
      //   event_label: 'NA'
      // });
      if (this.profile.profileCompleted || this.profile.profileCompleted === 'true') {
        this.router.navigate(['/bb']);
      } else {
        this.router.navigate(['/bb']);
      }
    }
  }

  close() {
    this.externalInterfaceService.close();
  }
}

