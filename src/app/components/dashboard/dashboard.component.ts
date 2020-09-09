import { Component, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output, OnInit , Input} from '@angular/core';
import { Router } from '@angular/router';
import * as Flickity from 'flickity';
import * as jsPDF from 'jspdf';
import oreo from '../../../assets/config/oreo.json';
import call from '../../../assets/config/call.json';

declare const atag: any;
declare var $: any;


import { AppService } from '../../core/services/app.service';
import { RestService } from '../../core/services/rest.service';
import { ExternalInterfaceService } from '../../core/services/external-interface.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/event-emitter.service.js';
import { TrackerService } from 'src/app/core/services/tracker.service.js';
// import { $ } from 'protractor';

@Component({
  selector: 'bb-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // @ViewChild('slider') sliderEle: ElementRef;
  @ViewChild('slider', { static: false }) sliderEle: ElementRef;
  @ViewChild('optionselect', { static: false }) optionsel: ElementRef;
  @Output() close: EventEmitter<any> = new EventEmitter();


  private slider;

  lang_select =[];

  imgs =[
    {
      img: 'assets/images/mahindra/XPHomeThumb.svg',
      desc: 'XP',
      linkName: ''
    },
    {
      img: 'assets/images/mahindra/SPHomeThumb.svg',
      desc: 'SP',
      linkName: ''
    },
  ]

  zonalStateEng = [  "Andhra Pradesh",
  "Madhya Pradesh",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "UP East",
  "UP West"];

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
  // modelimg1 = 'assets/images/mahindra/575_HIN.jpg';
  // modelimg2 = 'assets/images/mahindra/SP.png';
  // modelimg3 = 'assets/images/mahindra/575_HIN.jpg';
  OptionForm: FormGroup;
  private defaultLanguage: string;
  dl = null;
  langpassed = null;

  ATzoneSelect: any;
  range: string;


  constructor(
    private router: Router,
    private appService: AppService,
    private restService: RestService,
    private profileService: ProfileService,
    private externalInterfaceService: ExternalInterfaceService,
    private trackerService: TrackerService,
    private fb: FormBuilder,
    private eventEmitterService: EventEmitterService
  ) {
    // this.dl = JSON.parse(localStorage.getItem('language')).languageValue;
    // console.log(this.dl);
    // this.eventEmitterService.subscribe(event=>{
    //   console.log(event.type);
      
    //   if(event.type === "LANGUAGE_PASSED"){
    //     this.langpassed=event.data
    //   }
    // })

    // if( this.dl != null && this.langpassed == null)
    // {
    //   this.defaultLanguage = this.dl;
    // }
    // else if( this.dl == null && this.langpassed != null) {
    //   this.defaultLanguage = this.langpassed;
    // }
    // else if( this.dl != null && this.langpassed != null) {
    //   this.defaultLanguage = this.dl;
    // }
    // else if( this.dl == null && this.langpassed == null) {
    //   this.defaultLanguage = this.langpassed;
    // }

   
    // console.log(window.location.pathname.split('&')[1].split('=')[1]);

    // console.log(this.digitalData.campaign.utmTerm);


    if (window.location.pathname.indexOf(';') > 1) {
      // this.defaultLanguage = 'English';

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
    //     pageName: 'MT20 Tractor home page English',
    //     pageInfo:
    //     {
    //       appName: 'Mahindra Tractors 2020'
    //     }
    //   },
    //   user: {
    //     bpid: customerId,
    //   },
      campaign: campaignData
    // };
    // atag(this.digitalData);
    this.trackerService.trackGAPages("Mahindra Tractors | Home Page");
    // this.optionvalue = oreo[this.defaultLanguage];
    // console.log(this.optionvalue);
    // console.log(JSON.parse(localStorage.getItem('language')).languageValue);
  }

  ngOnInit() {


    this.zone = call.Missedcall;
    this.zonalstate = this.zone['English'];

    if(this.digitalData.campaign.utmTerm !== null ) {
      console.log('this is campaign');

      console.log(localStorage.getItem('digitalData'));
      this.gotomain(this.digitalData.campaign.utmTerm, this.digitalData.campaign.utmContent);
    } else {

    console.log(this.digitalData);

    this.appService.setDefaultLanguage('English')

    this.OptionForm = this.fb.group({
      selected: [this.defaultLanguage, [Validators.required]],
    });
    this.OptionForm.valueChanges.subscribe((res => {
      // this.modelimg1 = oreo[res.selected]['Img1'];
      // this.modelimg2 = oreo[res.selected]['Img2'];
      // this.modelimg3 = oreo[res.selected]['Img3'];
      this.optionvalue = oreo[res.selected];
      this.defaultLanguage = res.selected;
      this.zone = call.Missedcall;
      this.zonalstate = this.zone['English'];
      console.log(this.zonalstate);
    }));

    this.zone = call.Missedcall;
    console.log(this.zone);
    this.zonalstate = this.zone['English'];
    console.log(this.zonalstate);
    }

  }


  ngAfterViewInit() {
    // if (this.data) {
    //   setTimeout(() => {
    //     this.initSlider();
    //     this.loading = false;
    //   }, 100);
    // }
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

  modalclose(){
    $('#exampleModal2').hide();
  }

  gotolang(img){
    
    console.log(img.desc);
    if(img.desc==="XP"){
      this.range ==="XP";
      this.lang_select = [
        {
        lang: 'English',
        value:'English',
        range: 'XP'
        },
        {
          lang: 'हिन्दी',
          value:'Hindi',
          range: 'XP'
        },
        {
          lang: 'తెలుగు',
          value: 'Telugu',
          range: 'XP'
        },
        {
          lang: 'தமிழ்',
          value: 'Tamil',
          range: 'XP'
        },
    ];
    } else {
      this.range ==="SP";
      this.lang_select = [
        {
          lang: 'English',
          value:'English',
          range: 'SP'
          },
          {
            lang: 'हिन्दी',
            value:'Hindi',
            range: 'SP'
          },
        {
          lang: 'मराठी',
          value: 'Marathi',
          range: 'SP'
        }
      ];
    }

    $('#exampleModal2').show();
    this.trackerService.trackGALink('Mahindra Tractors', 'Explore | ' + img.desc + ' Plus' , 'Mahindra Tractors | Home Page', 'English');
  }

  selectlang(lang , range){
    // this.appService.language.subscribe(res => {
      console.log(this.defaultLanguage);
    
    console.log('select language');
    $('#exampleModal2').hide();
    this.gotomain(lang , range)
    // })
    this.trackerService.trackGALink('Mahindra Tractors', 'Language Selection' , ' ' +lang+' ', ' ' + lang + ' ');
  }
  initSlider() {
    this.slider = new Flickity(this.sliderEle.nativeElement, {
      prevNextButtons: false,
      autoPlay: true,
      contain: false,
      pageDots: true,
      wrapAround: true,
      lazyload: 2
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
  getJwtForTransfer() {
    return this.appService.getUserInfo().jwt;
  }

  missedcall() {
    // console.log("Pressed On Missed Call Button");
    // $('#exampleModal').show();
    this.externalInterfaceService.makeCall('18004256576');
    this.trackerService.trackGALink('Mahindra Tractors', 'Give a Missed Call', 'Mahindra Tractors | Home Page', 'English');
  }
  ATZoneTrack(i, value){
    console.log(value);
    this.externalInterfaceService.makeCall(value);
    console.log(this.zonalStateEng[i]);
    this.ATzoneSelect=this.zonalStateEng[i];
    // console.log(this.zonalstate[i]);
    this.ATzoneSelect=this.zonalstate[i]
    this.trackerService.trackGALink('Mahindra Tractors', 'Give a Missed Call | State Selection', ' ' + this.ATzoneSelect + ' ', 'English');
  }
  missedcallclose() {
    $('#exampleModal').hide();
  }

  call() {
  }

  gotoshare() {
    this.externalInterfaceService.share(
      this.appService.getConfigParam('SHARE_MESSAGE')
    );

    this.trackerService.trackGALink('Mahindra Tractors', 'Share with friends', 'Mahindra Tractore | Home Page', 'English');
  }

  gotodealer(){
    console.log('inside dealer');
    this.router.navigate(['/bb/tnc']);

    this.trackerService.trackGALink('Mahindra Tractors', 'Dealer Locator', 'Mahindra Tractors | Home Page', 'English');
  }

  gotomain(lang , range) {
    console.log(lang, range);
    this.appService.setDefaultLanguage(lang);
    this.router.navigate(['/bb/dashboard-2', {
      detailreq: range,
      language: lang
    }]);

  }

  // showQuiz() {
  //   console.log('im in quiz');
  //   this.router.navigate(['/bb/recurring-quiz']);
  // }




}
