import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

declare const atag: any;
declare var $: any;

import { AppService } from './../../core/services/app.service';
import { RestService } from './../../core/services/rest.service';
import { ContestantService } from './../../core/services/contestant.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { LoggerService } from './../../core/services/logger.service';
import { EventEmitterService } from './../../core/services/event-emitter.service';
import { ExternalInterfaceService } from './../../core/services/external-interface.service';

import { util } from './../../util';
import oreo from '../../../assets/config/oreo.json';
import { TrackerService } from 'src/app/core/services/tracker.service';

@Component({
  selector: 'bb-recurring-quiz',
  templateUrl: './recurring-quiz.component.html',
  styleUrls: ['./recurring-quiz.component.scss']
})
export class RecurringQuizComponent implements OnInit, OnDestroy {
  quiz: any = { questions: [] };
  currentQuestion: any = null;
  showQuizResults = false;
  loading = true;
  quizType;
  currentQuestionIndex = 0;
  pointsWon = 0;
  myProfile: any = {};
  sms: any;
  profile: any;
  qcount;
  count;
  level;
  answers = [];
  level_response;
  level_text;
  user_score;
  max_score;
  user_text1;
  user_text2;
  btn_text;
  enableSubmit = false;
  levels_complete = false;
  selectedOption;
  Image;
  won = false;
  languagesel;
  English = false;
  Hindi = false;
  Telugu = false;
  Tamil = false;
  Marathi = false;
  submit;
  digitalData;

  private intervalId = null;
  quizImageURL: any;
  quizImageIndex: number;
  dum: any;
  requestdetail: string;
  type: any;

  constructor(
    private router: Router,
    private appService: AppService,
    private restService: RestService,
    private contestantService: ContestantService,
    private profileService: ProfileService,
    private logger: LoggerService,
    private eventEmitterService: EventEmitterService,
    private externalInterfaceService: ExternalInterfaceService,
    private trackerService : TrackerService ,
    private route: ActivatedRoute
  ) {
    this.requestdetail = window.location.pathname.split(';')[3].split('=')[1];
    console.log(this.requestdetail);
    this.languagesel = window.location.pathname.split(';')[2].split('=')[1];
    this.route.params.subscribe(params => this.sms = params);

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
    //     pageName: 'MT20 Quiz page ' +this.requestdetail+ ' ' + this.languagesel,
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
    this.trackerService.trackGAPages("Mahindra Tractors | Quiz | " + this.requestdetail+" plus");
  }

  ngOnInit() {

    if (this.languagesel === 'English') {
      this.English = true;
      this.submit = 'Submit';
    } else if (this.languagesel === 'Hindi') {
      this.Hindi = true;
      this.submit = 'सबमिट';
    } else if (this.languagesel === 'Telugu') {
      this.Telugu = true;
      this.submit = 'సబ్మిట్';
    } else if (this.languagesel === 'Tamil') {
      this.Tamil = true;
      this.submit = 'சமர்ப்பிக்க';
    } else if (this.languagesel === 'Marathi') {
      this.Marathi = true;
      this.submit = 'सबमिट';
    }
    // console.log(this.sms, 'SMS');
    this.profileService.getProfile()
      .subscribe(profile => {
        this.logger.log('done');
        this.myProfile = profile;
      });
    this.eventEmitterService
      .emit({
        type: 'QUIZ_SCREEN_INIT',
        data: null
      });
    this.getQuiz();
    // this.quizImageIndex = 0;
    // this.quizImageURL = oreo.quizImages[this.quizImageIndex];
  }

  // getQuizImages() {
  //   this.quizImageURL = oreo.quizImages[this.quizImageIndex];
  //   this.quizImageIndex++;
  // }
  getQuiz() {
    if(this.requestdetail === 'XP') {
      this.type = 'mahindra';
    } else {
      this.type = 'mahindrasp';
    }
    this.restService
      .get(this.appService.getConfigParam('API_HOST') + '/'+this.type+'/weekquiz')
      // /home/tejesh_more/Desktop/jio-stree-client/sxrc/assets/config/
      // .get('../../../assets/config/20191107_Mahindra updated json.json')
      .subscribe(res => {
        this.answers = [];
        this.selectedOption = '';
        this.quiz = res;
        console.log(this.quiz);
        if (this.quiz.level === 2) {
          console.log('going');
          this.router.navigate(['bb/faq', { 
            dum: this.dum,
            lang: this.languagesel }]);

        }
        // let level = 2;
        // console.log(this.qcount);
        // // (this.quiz ()  => {
        if (!this.quiz.answered && this.quiz.level === '1') {
          (this.quiz.questions || []).forEach(q => {
            this.currentQuestion = this.quiz.questions;
            console.log(this.currentQuestion);
            if (q.playerId) {
              q.contestant = this.contestantService.resolveContestantByValue('id', q.playerId);

            }
          });
        }

        if (this.quiz.answered) {
          console.log('inside this');
          (this.quiz.questions || []).forEach(q => {
            q.isCorrectAnswer = !!_.intersection(
              q.answer,
              q.userAnswer
            ).length;

            if (q.isCorrectAnswer) {
              this.pointsWon += q.points;
            }

            (q.opt_eng || [])
              .filter(o => (q.userAnswer || []).indexOf(o.id) > -1)
              .forEach(o => {
                o[q.answer.indexOf(o.id) > -1 ? 'correct' : 'incorrect'] = true;
              });

            q.opt_eng.forEach(o => {
              if (q.answer.indexOf(o.id) > -1) {
                o.correct = true;
              }
            });
          });
          this.showQuizResults = true;

          // console.log(this.quiz,this.quiz.questions[0]._id, 'completQ');
          //
          // gtag('config', 'UA-56816637-76', {
          //   'page_title' : 'Andhadhund Thank You Page',
          //   'page_path': '/AndhadhundThankYouPage'
          //   });
        } else if (!(this.quiz.questions && this.quiz.questions.length)) {
          // quiz not available
        } else {
          this.showNextQuestion();

        }
        this.loading = false;
      });
  }

  gotoQuiz() {
    if (this.levels_complete === true) {
      this.router.navigate(['/bb', {
        lang: this.languagesel
      }]);
    } else {
      this.enableSubmit = false;
      this.getQuiz();

    }


    // this.router.navigate(['/bb/recurring-quiz']);
    // this.currentQuestion = [];
    // this.getQuiz();

    // this.showNextQuestion();
    this.close();

  }

  open() {
    $('#exampleModal').show();
  }

  close() {
    this.currentQuestionIndex = 0;
    $('#exampleModal').hide();
  }

  showNextQuestion() {
    // this.selectedOption = false;
    // this.getQuizImages();
    this.currentQuestion = this.quiz.questions[this.currentQuestionIndex++];

    if (this.currentQuestion) {
      this.startTimer();
      // this.getQuizImages();
    }
    if (this.currentQuestionIndex > 5) {
      return;
    }
  }

  startTimer() {
    this.stopTimer();
    this.intervalId = setInterval(() => {
      if (this.currentQuestion.duration > 0) {
        this.currentQuestion.duration--;
      } else {
        this.stopTimer();
        this.evaluateUserAnswer();
        setTimeout(() => {
          this.showNextQuestion();
          // this.getQuizImages();
        }, this.appService.getConfigParam('QUIZ_BREATHING_TIME'));
      }
    }, 100000);
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  selectOption(option) {
    console.log(option);
    this.selectedOption = option.desc;
    console.log(this.selectedOption.length);
    const answerobject = {};
    const answer = [];
    answerobject['qId'] = this.currentQuestion._id;
    answer.push(option.id);
    answerobject['answer'] = answer;
    console.log(answer);
    console.log(answerobject);
    this.answers.push(answerobject);
    console.log(this.answers);
    if (this.currentQuestionIndex === 5) {
      this.enableSubmit = true;
      return;
    } else {
      setTimeout(() => {
        this.selectedOption = '';
        this.showNextQuestion();
      }, 1500);
    }
    // if (this.currentQuestion.submitting || this.currentQuestion.duration <= 0) {
    //   return;
    // }
    // if (option.selected) {
    //   option.selected = false;
    // } else {
    //   if (this.currentQuestion.noOfAnswer === 1) {
    //     this.currentQuestion.opt_eng.forEach(c => c.selected = false);
    //     // option.selected = true;
    //     setTimeout(() => {
    //        this.evaluateUserAnswer();
    //     }, this.appService.getConfigParam('QUIZ_BREATHING_TIME'));
    //   } else {
    //     const selectedOptions = this.currentQuestion.opt_eng.filter(o => o.selected);
    //     if (selectedOptions.length < this.currentQuestion.noOfAnswer) {
    //       option.selected = true;
    //     }
    //   }
    // }
  }

  submitQuiz() {
    if(this.requestdetail === 'XP') {
      this.type = 'mahindra';
    } else {
      this.type = 'mahindrasp';
    }
    this.restService.post(
      this.appService.getConfigParam('API_HOST') + '/'+this.type+'/weeekquiz/questions/answer',
      {
        answers: this.answers
      }
    )
      .subscribe(res => {
        this.level_response = res;
        if (this.level_response.level === 2) {
          this.levels_complete = true;
        }
        console.log(this.level_response.isWeekQuizCompleted);
        if (this.level_response.isWeekQuizCompleted === true && this.level_response.level === 2) {
          console.log('inside complete');
          this.levels_complete = true;
          console.log(this.levels_complete);
        }
        this.user_score = this.level_response.correctCount;
        this.max_score = this.level_response.total;
        if (this.user_score === this.max_score) {
          this.won = true;
          this.Image = 'assets/images/mahindra/congrats.png';
          if (this.English === true) {
            this.user_text2 = 'You have answered all the questions right';
            this.btn_text = 'Home';
          } else if (this.Hindi === true) {
            this.user_text2 = 'आपने सभी प्रश्नों के सही उत्तर दिए हैं';
            this.btn_text = 'होम';
          } else if (this.Telugu === true) {
            this.user_text2 = 'మీరు అన్ని ప్రశ్నలకు సరిగ్గా సమాధానం ఇచ్చారు';
            this.btn_text = 'హోమ్';
          } else if (this.Tamil === true) {
            this.user_text2 = 'எல்லா கேள்விகளுக்கும் நீங்கள் சரியாக பதிலளித்துள்ளீர்கள்';
            this.btn_text = 'ஹோம்';
          } else if(this.Marathi === true) {
            this.user_text2 = 'आपण सर्व प्रश्नांची उत्तरे अचूक दिली आहेत';
            this.btn_text = 'होम';
          }
          this.trackerService.trackGALink('Mahindra Tractors','Quiz Completed-Congratulations',' '+this.requestdetail+' Plus',' '+this. languagesel+' ');

        } else {
          this.won = false;
          this.Image = 'assets/images/mahindra/sorry.png';
          if (this.English === true) {
            // tslint:disable-next-line:max-line-length
            this.user_text2 = 'Oops! You have got ' + this.user_score + '/' + this.max_score + ' answers correct. Do yo want to play again?';
            this.btn_text = 'Try Again';
          } else if (this.Hindi === true) {
            this.user_text2 = 'आप ' + this.user_score + '/' + this.max_score + '  जवाब सही दिए हैं!. क्या आप दोबारा खेलना चाहते हैं?';
            this.btn_text = 'फिर खेलें';
          } else if (this.Telugu === true) {
            this.user_text2 = 'మీకు ' + this.user_score + '/' + this.max_score + '   సమాధానాలు సరైనవి. మళ్ళీ ఆడాలా?';
            this.btn_text = 'మళ్ళీ ఆడాలా';
          } else if (this.Tamil === true) {
            this.user_text2 = 'நீங்கள் ' + this.user_score + '/' + this.max_score + '   பதில் சரியாக அளித்துள்ளீர்கள்';
            this.btn_text = 'திரும்பவும் விளையாடு';
          } else if (this.Marathi === true) {
            this.user_text2 = 'तुमचे ' + this.user_score + '/' + this.max_score + ' उत्तरे योग्य आहेत!. तुम्ही पुन्हा खेळू ईच्छिता?';
            this.btn_text = 'परत खेळा';
          }

          this.trackerService.trackGALink('Mahindra Tractors','Quiz Completed-Sorry-Try Again',' '+this.requestdetail+' Plus',' '+this. languagesel+' ');
        }
         

      });
    this.open();
 
  }

  // submitAnswer(questions) {
  //   const q = questions.shift();
  //   if (q && q.userAnswer.length) {
  //     this.restService.post(
  //       this.appService.getConfigParam('API_HOST') + '/devsaavn/weekquiz/questions/answer',
  //       {
  //         answer: q.userAnswer.map(o => o.id)
  //       }
  //     )
  //       .subscribe(res => this.submitAnswer(questions));
  //   } else {
  //     this.profileService.getProfile()
  //       .subscribe(profile => {
  //         this.logger.log('done');
  //       });
  //     this.showQuizResults = true;

  //     // let digitalData = {
  //     //   link:{
  //     //   linkName: 'Quiz Complete',
  //     //   linkPosition:'Body',
  //     //   linkType:'AsianPAint'
  //     //   },
  //     //   question:{
  //     //   questionID: this.quiz.questions[0]._id,
  //     //   questionText: this.quiz.questions[0].qDesc,
  //     //   answer:this.quiz.questions[0].answer[0],
  //     //   optionNumber: this.quiz.questions[0].userAnswer[0]
  //     //   }
  //     //   }
  //     // atag(digitalData);

  //     // console.log(this.quiz, questions, 'completQ1');
  //   }
  // }

  evaluateUserAnswer() {
    if (this.currentQuestion.submitting) {
      return;
    }
    this.currentQuestion.submitting = true;
    this.currentQuestion.userAnswer = this.currentQuestion.opt_eng.filter(o => o.selected);
    if (this.currentQuestion.userAnswer && this.currentQuestion.userAnswer.length) {
      this.currentQuestion.isCorrectAnswer = !!_.intersection(
        this.currentQuestion.answer,
        (this.currentQuestion.userAnswer || []).map(o => o.id)
      ).length;
      if (this.currentQuestion.isCorrectAnswer) {
        this.pointsWon += this.currentQuestion.points;
        this.eventEmitterService.emit({ type: 'SHOW_CONFETTI', data: { clickable: false } });
      }
    }
    (this.currentQuestion.userAnswer || []).forEach(o => {
      o[this.currentQuestion.answer.indexOf(o.id) > -1 ? 'correct' : 'incorrect'] = true;
    });
    this.currentQuestion.opt_eng.forEach(o => {
      if (this.currentQuestion.answer.indexOf(o.id) > -1) {
        o.correct = true;
      }
    });
    this.stopTimer();
    setTimeout(() => {
      this.showNextQuestion();
    }, this.appService.getConfigParam('QUIZ_BREATHING_TIME'));
  }
  navigateToMovie() {
    if (this.quiz.answered) {
      // gtag('event', 'Watch_Cinema',{'event_category' : 'Andhadhun_Movie_Quiz',
      //   'event_label': 'Thank_Page'});
    } else {
      // gtag('event', 'Watch_Cinema',{'event_category' : 'Andhadhun_Movie_Quiz',
      // 'event_label': 'LevelCompleted_Page'});
    }
    this.externalInterfaceService.launchBrowser(
      'http://jioimages.cdn.jio.com/mailer/user-agent.html?id=fefeb23024a111e99f690d39b2f2fb61&type=0&referrer=utm_source=AndhadhunPlayAlong'
    );
  }

  ngOnDestroy() {
    this.stopTimer();
    this.eventEmitterService
      .emit({
        type: 'QUIZ_SCREEN_DESTROY',
        data: null
      });
  }
}
