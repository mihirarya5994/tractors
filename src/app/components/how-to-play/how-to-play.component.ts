import { Component, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Flickity from 'flickity';
import * as jsPDF from 'jspdf';
import oreo from '../../../assets/config/oreo.json';
import sp from '../../../assets/config/sp2.json';


declare const atag: any;
declare var $: any;

import { AppService } from '../../core/services/app.service';
import { RestService } from '../../core/services/rest.service';
import { ExternalInterfaceService } from '../../core/services/external-interface.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/event-emitter.service.js';
import { TrackerService } from 'src/app/core/services/tracker.service.js';

@Component({
  selector: 'bb-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.scss']
})
export class HowToPlayComponent implements OnInit {
  @ViewChild('slider', { static: false }) sliderEle: ElementRef;
  @ViewChild('optionselect', { static: false }) optionsel: ElementRef;
  @Output() close: EventEmitter<any> = new EventEmitter();


  private slider;

  relatedVideos: any[] = [];
  showVideoPopup = false;
  showVideoPopup1 = false;
  selectedVideo = null;
  loading = true;
  videoflag: boolean;
  profile;
  // brand: any;
  // desc1: any;
  // desc2: any;
  // content: any;
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
  zone;
  zonalstate;
  modelimg1;
  // modelimg2 = 'assets/images/mahindra/475_HIN.jpg';
  // modelimg3 = 'assets/images/mahindra/575_HIN.jpg';
  OptionForm: FormGroup;
  defaultlanguage = 'English';
  dl = null;
  tamilCss = false;
  langpassed = null;
  lists = [];

  imgs2 = [
    {
      img: 'assets/images/mahindra/475DISPPLUS.svg',
      desc: '475 DI SP Plus',
      id: '475SP',
      linkName: ''
    },
    {
      img: 'assets/images/mahindra/575DISPPLUS.png',
      desc: '575 DI SP Plus',
      id: '575SP',
      linkName: ''
    },

  ]
  imgs = [
    {
      img: 'assets/images/mahindra/275XPPlus.png',
      desc: '275 XP Plus',
      id: '275XP',
      linkName: '275'
    },
    {
      img: 'assets/images/mahindra/475XPPlus.svg',
      desc: '475 XP Plus',
      id: '475XP',
      linkName: '475'
    },
    {
      img: 'assets/images/mahindra/575XPPlus.svg',
      desc: '575 XP Plus',
      id: '575XP',
      linkName: '575'
    }
  ];
  requestdetail: string;
  isXP: boolean;
  isSP: boolean;
  dum: any;
  type: string;

  constructor(
    private router: Router,
    private appService: AppService,
    private restService: RestService,
    private profileService: ProfileService,
    private externalInterfaceService: ExternalInterfaceService,
    private trackerService : TrackerService,
    private fb: FormBuilder,
    private eventEmitterService: EventEmitterService
  ) {
    // if (window.location.pathname.indexOf(';') > 1) {
    //   this.defaultlanguage = window.location.pathname.split(';')[1].split('=')[1];
    //   this.defaultlanguage = 'English';
    // }

    this.defaultlanguage = this.appService.languageSelected.charAt(0).toUpperCase() + this.appService.languageSelected.slice(1);
    console.log('defautlanguage', this.defaultlanguage);
    

    this.requestdetail = window.location.pathname.split(';')[1].split('=')[1].toUpperCase();
    console.log(this.requestdetail)

   
    if (this.requestdetail === "XP") {
      this.isXP = true;
      this.isSP = false;
      console.log(this.isXP);
      this.type = "XP";
      this.modelimg1 = oreo[this.defaultlanguage]['Img1'];
    }
    else {
      this.isSP = true;
      this.isXP = false;
      this.type = "SP";
      this.modelimg1 = sp[this.defaultlanguage]['Img1'];
    }
    this.profile = this.profileService.getProfileSync();
    // console.log(this.profile);

    let customerId;
    var campaignData: any = this.appService.getAdobeData();
    if (this.appService.getUserInfo().info && this.appService.getUserInfo().info.customerId) {
      customerId = this.appService.getUserInfo().info.customerId;
    } else {
      customerId = '';
    }
    // this.digitalData = {
    //   page: {
    //     pageName: 'MT20 Tractor ' + this.type + ' Plus page ' + this.defaultlanguage,
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
    this.trackerService.trackGAPages("Mahindra Tractors | " + this.type+" Plus Page");
    if (this.isXP) {
      this.optionvalue = oreo[this.defaultlanguage];
    } else {
      this.optionvalue = sp[this.defaultlanguage];
    }

  }

  ngOnInit() {

    console.log(this.defaultlanguage);

    console.log(this.appService.languageSelected);
    if(this.defaultlanguage === 'Tamil') {
      this.tamilCss = true;
    } else if(this.defaultlanguage === 'Hindi') {
      this.tamilCss = true;
    } else {
      this.tamilCss = false;
    }
  
    console.log(this.defaultlanguage);
    this.OptionForm = this.fb.group({
      selected: [this.defaultlanguage, [Validators.required]],
    });
    this.OptionForm.valueChanges.subscribe((res => {
      console.log(this.defaultlanguage);
      if(this.defaultlanguage === 'Hindi') {
        this.tamilCss = true;
        console.log(this.tamilCss);
      } else if(this.defaultlanguage === 'Tamil'){
        this.tamilCss = true;
      } else {
        this.tamilCss = false;
      }
      if (this.isXP) {
        this.modelimg1 = oreo[res.selected]['Img1'];
        this.optionvalue = oreo[res.selected];

        this.defaultlanguage = res.selected;
        this.appService.setDefaultLanguage(this.defaultlanguage);
        this.zone = oreo.Missedcall;
      } else {
        this.modelimg1 = sp[res.selected]['Img1'];
        this.optionvalue = sp[res.selected];
        this.defaultlanguage = res.selected;
        this.zone = sp.Missedcall;
        this.appService.setDefaultLanguage(this.defaultlanguage);
      }
      this.zonalstate = this.zone[this.defaultlanguage];
      console.log(this.zonalstate);
      this.trackerService.trackGALink('Mahindra Tractors','Language Selection',' '+this.defaultlanguage+' ',' '+this.defaultlanguage+' ');
    }));
    if (this.isXP) {
      this.zone = oreo.Missedcall;
    } else {
      this.zone = sp.Missedcall;
    }
    this.zonalstate = this.zone[this.defaultlanguage];
    console.log(this.zonalstate);

  }

  ngAfterViewInit() {
    //     this.appService.language.subscribe(res => {
    //   console.log(res);
    // });
    this.restService.get('assets/config/related-videos.json').subscribe(res => {
      this.relatedVideos = res.videos;
      this.loading = false;
      setTimeout(() => {

      }, 1000);
    });

    // setTimeout(() => {
    //   this.initSlider();
    // }, 500);

  }

  initSlider() {
    this.slider = new Flickity(this.sliderEle.nativeElement, {
      prevNextButtons: false,
      autoPlay: false,
      contain: false,
      pageDots: true,
      // adaptiveHeight: true,
      // lazyLoad: 2
    });
    this.slider.on('select', (index) => {
      this.slider.playPlayer();
    });
    this.slider.on('pointerDown', (index) => {
      this.slider.playPlayer();
    });
    this.slider.on('pointerUp', (index) => {
      this.slider.playPlayer();
    });
    this.slider.on('pointerMove', (index) => {
      this.slider.playPlayer();
    });
  }

  getlist() {
    $('#exampleModal2').show();
    console.log(this.requestdetail, this.defaultlanguage);
    if (this.requestdetail === "SP") {
      this.lists = [
        {
          name: '475 SP Plus',
          value: '475SP'
        },
        {
          name: '575 SP Plus',
          value: '575SP'
        }
      ]
    } else {
      this.lists = [
        {
          name: '275 XP Plus',
          value: '275XP'
        },
        {
          name: '475 XP Plus',
          value: '475XP'
        },
        {
          name: '575 XP Plus',
          value: '575XP'
        }
      ]
    }
  }


  selectractor(name) {
    if (name = "275XP" && this.defaultlanguage === "English") {

    }
  }

  getJwtForTransfer() {
    return this.appService.getUserInfo().jwt;
  }

  missedcall() {
    // $('#exampleModal').show();
    this.externalInterfaceService.makeCall('18004256576');
    this.trackerService.trackGALink('Mahindra Tractors', 'Give a Missed Call' , 'Mahindra Tractors | ' + this.type + ' Plus', ' ' + this.defaultlanguage + ' ');
  }
  // ATZoneTrack(i){
  //   console.log(this.zonalStateEng[i]);
  //   this.ATzoneSelect=this.zonalStateEng[i];
  //   this.digitalData = {
  //     link: {
  //       linkName: 'MT20_Share_with_friends',
  //       linkPosition: 'Homepage Body',
  //       linkType: 'MT20_Interaction'
  //     }
  //   }; atag(this.digitalData);
  //   // console.log(this.zonalstate[i]);
  // }

  ATZoneTrack(i, value){
    this.externalInterfaceService.makeCall(value);
    console.log(this.zonalstate[i]);
    console.log(this.defaultlanguage);
    this.trackerService.trackGALink('Mahindra Tractors' , 'Give a Missed Call | State Selection', ' ' + this.zonalstate[i] + ' ', ' ' + this.defaultlanguage);
    // console.log(this.zonalStateEng[i]);
    // this.ATzoneSelect=this.zonalStateEng[i];
    // // console.log(this.zonalstate[i]);
    // this.ATzoneSelect=this.zonalstate[i]
    // this.digitalData = {
    //   link: {
    //     linkName: 'MT20_Give_a_Missed_Call '+this.ATzoneSelect,
    //     linkPosition: 'Homepage Body',
    //     linkType: 'MT20_Interaction'
    //   }
    // }; atag(this.digitalData);
  }

  missedcallclose() {
    $('#exampleModal').hide();
  }

  gotoquiz() {
    this.router.navigate(['/bb/recurring-quiz', {
      // detailreq: img.desc.split(' ')[0],
      dum: this.dum,
      lang: this.OptionForm.value.selected,
      detailreq: this.type

    }]);
    this.trackerService.trackGALink('Mahindra Tractors', 'Play Now for Quiz' , 'Mahindra Tractors | ' + this.type + ' Plus', ' ' + this.defaultlanguage + ' ');

  }

  gototnc() {
    this.externalInterfaceService.launchBrowser(this.appService.getConfigParam('TNC_URL'));
  }

  gotodealer() {
    this.router.navigate(['/bb/tnc', {
      det: '',
      lang: this.OptionForm.value.selected
    }]);
    this.trackerService.trackGALink('Mahindra Tractors', 'Dealer Locator' , 'Mahindra Tractors | ' + this.type + ' Plus', ' ' + this.defaultlanguage + ' ');
  }

  dwld() {
    console.log(this.defaultlanguage, this.requestdetail);
    if (this.defaultlanguage === 'Hindi' && this.requestdetail === "XP") {
      window.location.href = 'assets/images/mahindra/Hindi.pdf';
    } else if (this.defaultlanguage === 'Telugu') {
      window.location.href = 'assets/images/mahindra/Telugu.pdf';
    } else if (this.defaultlanguage === 'English' && this.requestdetail === "XP") {
      window.location.href = 'assets/images/mahindra/Hindi.pdf';
    } else if (this.defaultlanguage === 'Tamil') {
      window.location.href = 'assets/images/mahindra/Tamil.pdf';
    } else if (this.defaultlanguage === 'English' && this.requestdetail === "SP") {
      window.location.href = 'assets/images/mahindra/docs/MT_SP_Plus_ENG.pdf';
    } else if (this.defaultlanguage === 'Hindi' && this.requestdetail === "SP") {
      window.location.href = 'assets/images/mahindra/docs/MT_SP_Plus_HIN.pdf';
    } else if (this.defaultlanguage === 'Marathi') {
      window.location.href = 'assets/images/mahindra/docs/MT_SP_Plus_MAR.pdf';
    }
    this.trackerService.trackGALink('Mahindra Tractors', 'Brochure Download' , 'Mahindra Tractors | ' + this.requestdetail + ' Plus', ' ' + this.defaultlanguage + ' ');
  }

  gotodetails(img) {

    this.router.navigate(['/bb/vote', {
      detailreq: img.id.split(' ')[0],
      
      lang: this.OptionForm.value.selected
    }]);
    this.trackerService.trackGALink('Mahindra Tractors','Explore | ' +img.id.split(' ')[0] + ' Plus', 'Mahindra Tractors | ' + this.type + ' Plus', this.defaultlanguage );
    console.log('hum yaha hai')
   
  }



}
