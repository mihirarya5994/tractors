import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AppService } from '../../../core/services/app.service';
import { RestService } from '../../../core/services/rest.service';
import { EventEmitterService } from '../../../core/services/event-emitter.service';
import { ExternalInterfaceService } from '../../../core/services/external-interface.service';
import {
  DataService,
  IDataUpdate,
  VALUE_TYPES
} from '../../../core/services/data.service';

@Component({
  selector: 'bb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() showParticipantsCount = false;

  participantsCount = 0;
  myPoints = 0;
  backTo = false;
  languagesel;
  detailreq: string;
  range: string;
  showback = true;
  public homeBack = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private restService: RestService,
    private dataService: DataService,
    private eventEmitterService: EventEmitterService,
    private externalInterfaceService: ExternalInterfaceService,
    private location: Location
  ) {}

  ngOnInit() {
    console.log('ngonit of header ');
    this.router.events.subscribe(event => {
      if(this.router.url.includes('faq')){
        this.showback = false;
      } else {
        this.showback = true;
      }
      window.location.pathname.length === 8 ? this.homeBack = false : this.homeBack = true; 
      if (event instanceof NavigationEnd) {
        console.log(location);
        console.log("activateRoute", this.activatedRoute.snapshot);
        this.backTo = true;
        console.log("activateRoute backto", this.backTo);
        if (event.url.indexOf('/bb/') > -1) {
          this.showParticipantsCount = true;
        }
        this.updateParticipantsCount();
      }
    });

    this.eventEmitterService.subscribe(event => {
      if (event.type === 'PROFILE') {
        this.myPoints = event.data.points;
      }
    });

    this.dataService.getUpdatesSubject().subscribe((update: IDataUpdate) => {
      if (update.type === VALUE_TYPES.MY_POINTS) {
        this.myPoints = +this.myPoints;
        this.myPoints += +update.value;
      } else if (update.type === VALUE_TYPES.PARTICIPANTS_COUNT) {
        this.participantsCount += update.value;
      }
    });
  }

  updateParticipantsCount() {
    // this.restService
    //   .get(this.appService.getConfigParam('API_HOST') + '/participantcount')
    //   .subscribe(res => {
    //     this.participantsCount = res.user_count;
    //   });
  }

  showSettings() {
    this.router.navigate(['/bb/history']);
  }

  back() {
    
    // console.log(window.location.pathname.split(';')[3].split('=')[1]);
    // this.externalInterfaceService.close();
    if (this.backTo && this.homeBack) {
      console.log('inside router back')
      this.location.back()
      // this.externalInterfaceService.close();
      // this.router.navigate([this.backTo]);
    } else {
      if (this.showParticipantsCount) {
            this.range = window.location.pathname.split(';')[1].split('=')[1];
            this.languagesel = window.location.pathname.split(';')[2].split('=')[1];
          this.router.navigate(['/bb/']);
        
      } else {
        this.externalInterfaceService.close();
      }
    }
  }
}

