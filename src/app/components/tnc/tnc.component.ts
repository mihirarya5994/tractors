import { Component, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dealer from '../../../assets/config/dealers.json';


declare const atag: any;
declare var $: any;

import { AppService } from '../../core/services/app.service';
import { RestService } from '../../core/services/rest.service';
import { ExternalInterfaceService } from '../../core/services/external-interface.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TrackerService } from 'src/app/core/services/tracker.service.js';

@Component({
  selector: 'bb-tnc',
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.scss']
})
export class TncComponent implements OnInit {
  @ViewChild('optionselect', { static: false }) optionsel: ElementRef;
  @Output() close: EventEmitter<any> = new EventEmitter();

  OptionForm: FormGroup;
  SearchForm: FormGroup;
  languagesel;
  dealerspec;
  Error = false;
  Errormessage;
  digitalData;
  // Errormessgae: any[] = [
  //   { id: 1, name: 'Please enter number only' },
  //   { id: 2, name: 'No matches found' }
  // ];

  constructor(
    private router: Router,
    private appService: AppService,
    private restService: RestService,
    private profileService: ProfileService,
    private externalInterfaceService: ExternalInterfaceService,
    private trackerService : TrackerService,
    private fb: FormBuilder,
  ) {


    let customerId;
    var campaignData: any = this.appService.getAdobeData();
    if (this.appService.getUserInfo().info && this.appService.getUserInfo().info.customerId) {
      customerId = this.appService.getUserInfo().info.customerId;
    } else {
      customerId = '';
    }
    this.digitalData = {
      page: {
        pageName: 'MT20 Dealer Locator page',
        pageInfo:
        {
          appName: 'Mahindra Tractors 2020'
        }
      },
      user: {
        bpid: customerId,
      },
      campaign: campaignData
    };
    atag(this.digitalData);
    this.trackerService.trackGAPages("Mahindra Tractors | Dealer Locator Page");
  }

  ngOnInit() {
    // this.Error = false;
    this.OptionForm = this.fb.group({
      selected: ['All', [Validators.required]],
    });
    this.SearchForm = this.fb.group({
      search: ['', [Validators.required]],
    });
    this.OptionForm.valueChanges.subscribe((res => {
      
      this.SearchForm.reset();
      this.languagesel = res.selected;
      this.dealerspec = dealer[this.languagesel];
      this.digitalData = {
        link: {
          linkName: 'MT20_' + this.languagesel,
          linkPosition: 'Top',
          linkType: 'MT20_Dealer Locator'
        }
      }; atag(this.digitalData);
      this.trackerService.trackGALink('Mahindra Tractors' , 'Dealer Locator | State Selection', ' ' + this.languagesel + ' ', 'English');
    }));
    this.dealerspec = dealer[this.OptionForm.value.selected];
  }

  isInputNumber(evt) {
    this.Error = false;
    const ch = String.fromCharCode(evt.which);
    if (!(/[0-9]/.test(ch))) {
      this.Error = true;
      this.Errormessage = 'Please enter number only';
      evt.preventDefault();
    }
  }

  search() {
    this.Error = false;
    const allserach = [];
    for (const add of dealer[this.OptionForm.value.selected]) {
      if (add.Address.indexOf(this.SearchForm.value.search) !== -1) {
        allserach.push(add);
      }
    }
    if (allserach.length !== 0) {
      this.dealerspec = allserach;
      console.log(this.dealerspec);
    } else {
      this.dealerspec = [];
      this.Error = true;
      this.Errormessage = 'No matches found';
    }
    this.digitalData = {
      link: {
        linkName: 'MT20_Search',
        linkPosition: 'Top',
        linkType: 'MT20_Dealer Locator'
      }
    }; atag(this.digitalData);
    this.trackerService.trackGALink('Mahindra Tractors' , 'Pincode Selection', 'Pincode', 'English');
  }

}
