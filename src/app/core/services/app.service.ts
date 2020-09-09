import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AppService {
  private config: any = {};
  private userInfo: any = {};
  private marketingData: any = {};
  private UserData: any = {};
  public languageSelected: string;

  // public language : Subject<string> = new Subject<string>()


  questions: any[] = [];
  timeOffset = 0;
  currentEvent: any = {};
  userProfile = {};
  hostApp = 'myjio';
  prizesAndBanners: any = null;

  setUserInfo(info) {
    this.userInfo = info;
    localStorage['userInfo'] = JSON.stringify(info);
  }

  setDefaultLanguage(lang: string): void {
    console.log('setlang',lang);
    this.languageSelected = lang;
  }

  getUserInfo() {
    const userInfo = localStorage['userInfo'];
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return this.userInfo;
  }
  setUserData(data) {
    this.UserData = data;

    localStorage["userData"] = JSON.stringify(data);
  }

  setAllPrizesAndBanners(p) {
    this.prizesAndBanners = p;
  }

  getAllPrizesAndBanners() {
    return this.prizesAndBanners;
  }

  setConfig(config) {
    this.config = config;
  }

  getConfigParam(param) {
    return this.config[param];
  }

  setUserProfile(profile) {
    Object.assign(this.userProfile, profile);
  }

  getUserProfile() {
    return this.userProfile;
  }

  setCurrentEvent(event) {
    this.currentEvent = event;
  }

  getCurrentEvent() {
    return this.currentEvent;
  }
  getAdobeData() {
    this.marketingData = localStorage["digitalData"];
    if (this.marketingData) {
      return JSON.parse(this.marketingData);
    }
  }

  setCurrentTimeOffset(offset) {
    this.timeOffset = offset;
  }

  getCurrentTimeOffset() {
    return this.timeOffset;
  }

  setQuestions(questions) {
    this.questions = questions;
  }

  getQuestions() {
    return this.questions;
  }

  setHostApp(app) {
    this.hostApp = app;
  }

  getHostApp() {
    return (this.hostApp || 'myjio').toLowerCase();
  }

  getOS() {
    if (navigator.userAgent.match(/Android/i)) {
      return 'android';
    }
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      return 'ios';
    }
    return 'others';
  }

  logout() {
    this.setUserInfo({});
  }
}
