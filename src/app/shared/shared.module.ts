import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

import { PadPipe } from './pipes/pad.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { GlobalErrorHandler } from './global-error-handler';

const pipes = [PadPipe, KeysPipe];
const components = [HeaderComponent, FooterComponent];

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  declarations: [...pipes, ...components],
  providers: [{provide: ErrorHandler, useClass: GlobalErrorHandler}],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ...pipes,
    ...components
  ]
})
export class SharedModule {}
