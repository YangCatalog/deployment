import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { StaticContentModule } from './static-content/static-content.module';
import { YangValidatorModule } from './yang-validator/yang-validator.module';
import { YangSearchModule } from './yang-search/yang-search.module';
import { YangImpactAnalysisModule } from './yang-impact-analysis/yang-impact-analysis.module';
import { YangModuleDetailViewerModule } from './yang-module-detail-viewer/yang-module-detail-viewer.module';
import { YangRegexValidatorModule } from './yang-regex-validator/yang-regex-validator.module';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { FileUploadFormComponent } from './shared/file-upload-form/file-upload-form.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    NgbTabsetModule,
    StaticContentModule,
    YangValidatorModule,
    YangSearchModule,
    YangImpactAnalysisModule,
    YangModuleDetailViewerModule,
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
