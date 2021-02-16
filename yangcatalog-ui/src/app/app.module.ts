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

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    StaticContentModule,
    YangValidatorModule,
    YangSearchModule,
    YangImpactAnalysisModule,
    YangModuleDetailViewerModule,
    YangRegexValidatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
