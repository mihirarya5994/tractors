import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'bb-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  languagesel;
  text1;
  text2;
  text3;
  constructor(
    private router: Router,
  ) {
    this.languagesel = window.location.pathname.split(';')[2].split('=')[1];
   }

  ngOnInit() {
    if (this.languagesel === 'English') {
      this.text1 = 'You have already completed the quiz';
      this.text2 = 'Home';
      this.text3 = 'Congratulations';
    } else if (this.languagesel === 'Hindi') {
      this.text1 = 'आपने सभी प्रश्नों के सही उत्तर दिए हैं';
      this.text2 = 'होम';
      this.text3 = 'बधाई हो!';

    } else if (this.languagesel === 'Telugu') {
      this.text1 = 'మీరు అన్ని ప్రశ్నలకు సరిగ్గా సమాధానం ఇచ్చారు';
      this.text2 = 'హోమ్';
      this.text3 = 'అభినందనలు!';
    } else if (this.languagesel === 'Tamil') {
      this.text1 = 'எல்லா கேள்விகளுக்கும் நீங்கள் சரியாக பதிலளித்துள்ளீர்கள்';
      this.text2 = 'ஹோம்';
      this.text3 = 'வாழ்த்துக்கள்!';
    } else if (this.languagesel === 'Marathi') {
      this.text1 = 'आपण सर्व प्रश्नांची उत्तरे दिली आहेत';
      this.text2 = 'होम';
      this.text3 = 'अभिनंदन!';
    }
  }
  gotohome() {
    this.router.navigate(['bb']);
  }

}
