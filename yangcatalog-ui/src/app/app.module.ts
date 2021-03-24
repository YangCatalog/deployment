import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { StaticContentModule } from './features/static-content/static-content.module';
import { YangValidatorModule } from './features/yang-validator/yang-validator.module';
import { YangSearchModule } from './features/yang-search/yang-search.module';
import { YangImpactAnalysisModule } from './features/yang-impact-analysis/yang-impact-analysis.module';
import { YangRegexValidatorModule } from './features/yang-regex-validator/yang-regex-validator.module';
import { HttpClientModule } from '@angular/common/http';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { YangModuleDetailsModule } from './features/yang-module-details/yang-module-details.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    StaticContentModule,
    YangValidatorModule,
    YangSearchModule,
    YangModuleDetailsModule,
    YangImpactAnalysisModule,
    YangRegexValidatorModule,
    HttpClientModule,
    NgBootstrapFormValidationModule.forRoot()
  ],
  providers: [],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
