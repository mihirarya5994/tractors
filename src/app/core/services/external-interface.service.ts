import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

import { AppService } from './app.service';
import { LoggerService } from './logger.service';

declare const window: any;
declare const webkit: any;

@Injectable({
  providedIn: 'root'
})
export class ExternalInterfaceService {
  public subject$: Subject<any> = new Subject();

  constructor(
    private zone: NgZone,
    private router: Router,
    private appService: AppService,
    private logger: LoggerService
  ) {
    this.setupCallbacksFromNative();
  }

  share(data) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'share',
          desc: data
        })
      )
    );
  }

  playSound(audioObj) {
    this.stopSound();
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'playinternalsound',
          path: audioObj.path || null,
          loop: audioObj.loop || false,
          name: audioObj.name || null
        })
      )
    );
  }

  stopSound() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'stopsound'
        })
      )
    );
  }

  makeCall(value) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'makeCall',
          value: value
        })
      ),
    );
  }

  launchBrowser(url) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'launchbrowser',
          value: url
        })
      )
    );
  }

  playJioCinemaVideo(url) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'playJioCinemaVideo',
          value: url
        })
      )
    );
  }

  sendLoadComplete() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'loadingCompleted'
        })
      )
    );
  }

  close() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'close'
        })
      )
    );
  }

  requestJWT() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'jwt'
        })
      )
    );
  }

  requestVideoCapture() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'video'
        })
      )
    );
  }

  private externalCall(data) {
    try {
      if (window.android && window.android.__externalCall) {
        window.android.__externalCall(data);
      }
      if (window.__externalCall) {
        window.__externalCall(data);
      }
      webkit.messageHandlers.callback.postMessage(data);
    } catch (e) {
      this.logger.error('external call failed');
    }
  }

  public setupCallbacksFromNative() {
    window.sendJwt = jwt => {
      this.zone.run(() => {
        this.appService.setUserInfo({ jwt: jwt });
        this.router.navigate(['/']);
      });
    };
    window.sendCapturedVideoFromCamera = config => {
      alert('sendCapturedVideoFromCamera called with ' + JSON.stringify(config));
    };
  }
}
