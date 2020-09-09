import { Component, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Flickity from 'flickity';
import * as jsPDF from 'jspdf';
import oreo from '../../../assets/config/oreo2.json';
import sp from '../../../assets/config/sp.json';
import sp2 from '../../../assets/config/sp2.json';

declare const atag: any;
declare var $: any;


import { AppService } from '../../core/services/app.service';
import { RestService } from '../../core/services/rest.service';
import { ExternalInterfaceService } from '../../core/services/external-interface.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TrackerService } from 'src/app/core/services/tracker.service.js';
// import { EventEmitterService } from 'src/app/core/services/event-emitter.service.js';
// import { $ } from 'protractor';
@Component({
  selector: 'bb-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit, AfterViewInit {
  @ViewChild('slider', { static: false }) sliderEle: ElementRef;
  @ViewChild('optionselect', { static: false }) optionsel: ElementRef;
  @Output() close: EventEmitter<any> = new EventEmitter();

  private slider;

  changeTamilFont=false;
  relatedVideos: any[] = [];
  zone;
  zonalstate;
  showVideoPopup = false;
  showVideoPopup1 = false;
  selectedVideo = null;
  loading = true;
  videoflag: boolean;
  profile;
  optionvalue: any;
  digitalData;
  vid: any;
  likes: any;
  shares: any;
  onstart = true;
  share_messgae: any;
  img_src: string;
  userLiked: any;
  totalLikes: any;
  totalShares: any;
  OptionForm: FormGroup;
  requestdetail;
  // modeldetails;
  modelimg;
  modelspecs;
  languagesel;
  tnc1;
  tnc2;
  missedcallpopup = false;
  dum: any;
  ATzoneSelect: any;
  isSP: boolean;
  isXP: boolean;
  isfeat = false;
  isapp = true;
  isspec = true;

  constructor(
    private router: Router,
    private appService: AppService,
    private restService: RestService,
    private profileService: ProfileService,
    private externalInterfaceService: ExternalInterfaceService,
    private trackerService: TrackerService,
    private fb: FormBuilder,
    // private eventEmitterService :EventEmitterService
  ) {
    
    this.requestdetail = window.location.pathname.split(';')[1].split('=')[1];
    console.log(this.requestdetail);
    if(this.requestdetail==='475SP' || this.requestdetail==='575SP'){
      this.isSP=true;
      this.isXP=false;
    } else {
      this.isSP=false;
      this.isXP=true;
    }
    console.log(this.isXP);
    console.log(this.isSP);
    this.languagesel = window.location.pathname.split(';')[2].split('=')[1];
    if (this.languagesel=="Tamil")
      {
        this.changeTamilFont=true;
        console.log(this.changeTamilFont);
      }
      else{
        this.changeTamilFont=false;
      }
    this.profile = this.profileService.getProfileSync();
    let customerId;
    var campaignData: any = this.appService.getAdobeData();
    if (this.appService.getUserInfo().info && this.appService.getUserInfo().info.customerId) {
      customerId = this.appService.getUserInfo().info.customerId;
    } else {
      customerId = '';
    }
    // this.digitalData = {
    //   page: {
    //     pageName: 'MT20 Tractor ' + this.requestdetail +  ' Plus page ' +this.languagesel,
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
    this.trackerService.trackGAPages("Mahindra Tractors | Product View | " + this.requestdetail+" plus");
    // this.optionvalue = oreo[this.languagesel];
  }
  ngOnInit() {
    this.OptionForm = this.fb.group({
      selected: [this.languagesel, [Validators.required]],
    });
    this.OptionForm.valueChanges.subscribe((res => {
      this.languagesel = res.selected;
      this.appService.setDefaultLanguage(this.languagesel);
      this.digitalData = {
        link: {
          linkName: 'MT20_Language ' + this.languagesel ,
          linkPosition: 'Homepage Body',
          linkType: 'MT20_'+this.requestdetail+'_Plus'
        }
      }; atag(this.digitalData);
      this.trackerService.trackGALink('Mahindra Tractors', 'Language Selection' , ' ' +this.languagesel+' ', ' ' + this.languagesel + ' ');
      let customerId;
    var campaignData: any = this.appService.getAdobeData();
    if (this.appService.getUserInfo().info && this.appService.getUserInfo().info.customerId) {
      customerId = this.appService.getUserInfo().info.customerId;
    } else {
      customerId = '';
    }
      this.router.navigate(['/bb/vote', {
        detailreq: this.requestdetail,
        lang: this.languagesel
      }]);
      console.log(this.languagesel)
      if (this.languagesel=="Tamil")
      {
        this.changeTamilFont=true;
        console.log(this.changeTamilFont);
      }
      else{
        this.changeTamilFont=false;
      }
      if(this.isXP){
        this.modelimg = oreo[this.requestdetail][this.languagesel]['Img'];
        this.modelspecs = oreo[this.requestdetail][this.languagesel];
        this.zone = oreo.Missedcall;
        this.zonalstate = this.zone[this.languagesel];
        console.log(this.zonalstate);
      } else if(this.isSP){
      // this.modelimg = 'images/mahindra/SP.png';
      this.modelimg = sp[this.requestdetail][this.languagesel]['Img'];
      // this.modelspecs = oreo[this.requestdetail][this.languagesel];
      this.modelspecs = sp[this.requestdetail][this.languagesel];
      this.zone = sp2.Missedcall;
      this.zonalstate = this.zone[this.languagesel];
      console.log(this.zonalstate);
      }
    }));
    if(this.isXP){
        this.modelimg = oreo[this.requestdetail][this.languagesel]['Img'];
        this.modelspecs = oreo[this.requestdetail][this.languagesel];
        this.zone = oreo.Missedcall;
        this.zonalstate = this.zone[this.languagesel];
        console.log(this.zonalstate);
    } else if(this.isSP){
      this.modelimg = sp[this.requestdetail][this.languagesel]['Img'];
      this.modelspecs = sp[this.requestdetail][this.languagesel];
      this.zone = sp2.Missedcall;
      this.zonalstate = this.zone[this.languagesel];
      console.log(this.zonalstate);
    }
    console.log(this.modelspecs);

    // $('#collapseOne').hide();
  }

  ngAfterViewInit() {
    this.restService.get('assets/config/related-videos.json').subscribe(res => {
      this.relatedVideos = res.videos;
      this.loading = false;
      setTimeout(() => {

        // this.digitalData = {
        //   link: {
        //     linkName: 'Video',
        //     linkPosition: 'Top',
        //     linkType: 'VideoPlay'
        //   }
        // }; atag(this.digitalData);

      }, 200);
    });

  }

  dwld() {
    console.log(this.languagesel);
    if (this.languagesel === 'Hindi') {
      window.location.href = 'assets/images/mahindra/Hindi.pdf';
    } else if (this.languagesel === 'Telugu') {
      window.location.href = 'assets/images/mahindra/Telugu.pdf';
    } else if (this.languagesel === 'English') {
      window.location.href = 'assets/images/mahindra/Hindi.pdf';
    } else if (this.languagesel === 'Tamil') {
      window.location.href = 'assets/images/mahindra/Tamil.pdf';
    }

  }

  // gotoquiz() {
  //   this.router.navigate(['/bb/recurring-quiz', {
  //     // detailreq: img.desc.split(' ')[0],
  //     dum:this.dum,
  //     lang: this.OptionForm.value.selected
  //   }]);
  //   this.digitalData = {
  //     link: {
  //       linkName: 'MT Play Quiz ' + this.languagesel,
  //       linkPosition: 'Bottom',
  //       linkType: 'Button'
  //     }
  //   }; atag(this.digitalData);
  // }

  missedcall() {
    //  this.digitalData = {
    //   link: {
    //     linkName: 'MT Give a Missed call ' + this.languagesel,
    //     linkPosition: 'Body',
    //     linkType: 'Interaction'
    //   }
    // }; atag(this.digitalData);
    // console.log("Pressed On Missed Call Button");
    // $('#exampleModal').show();
    this.externalInterfaceService.makeCall('18004256576');
    this.trackerService.trackGALink('Mahindra Tractors', 'Give a Missed Call', this.requestdetail + ' Plus', ' ' + this.languagesel + ' ');
  }

  ATZoneTrack(i, value){
    this.externalInterfaceService.makeCall(value);
    this.ATzoneSelect=this.zonalstate[i]
    this.trackerService.trackGALink('Mahindra Tractors', 'Give a Missed Call | State Selection', ' ' + this.ATzoneSelect + ' ', ' ' +this.languagesel + ' ');
    // console.log(this.zonalstate[i]);
  }
  missedcallclose() {
    $('#exampleModal').hide();
  }

  // gotohome() {
  //   // this.eventEmitterService.emit({type:"LANGUAGE_PASSED",data:{langSelected:this.languagesel}})
  //   this.router.navigate(['/bb/tnc', {
  //     dum:this.dum,
  //     lang: this.OptionForm.value.selected,
  //     detailreq: this.requestdetail
  //   }]);
  //   this.digitalData = {
  //     link: {
  //       linkName: 'MT Home ' + this.languagesel,
  //       linkPosition: 'Bottom',
  //       linkType: 'Button'
  //     }
  //   }; atag(this.digitalData);
  // }

  gotospecs() {
    if(!this.isspec){
      this.isspec=true
    } else if(this.isspec){
      this.isspec =false;
    }
    $('#collapseThree').toggle();
  }

  gotoapps() {
    if(!this.isapp){
      this.isapp=true
    } else if(this.isapp){
      this.isapp =false;
    }
    $('#collapseTwo').toggle();
  }

  navigateToTnC() {
    this.externalInterfaceService.launchBrowser(this.appService.getConfigParam('TNC_URL'));
    // this.digitalData = {
    //   link: {
    //     linkName: 'MT TnC ' + this.languagesel,
    //     linkPosition: 'Bottom',
    //     linkType: 'Button'
    //   }
    // }; atag(this.digitalData);
  }

  gotofeat() {
    if(!this.isfeat){
      this.isfeat=true
    } else if(this.isfeat){
      this.isfeat =false;
    }

    $('#collapseOne').toggle();
  }
}
