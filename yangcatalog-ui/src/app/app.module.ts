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
import { YangTreeComponent } from './features/yang-tree/yang-tree.component';
import { CoreModule } from './core/core.module';
import { AppAgGridModule } from './shared/ag-grid/app-ag-grid.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { YangShowNodeModule } from './features/yang-show-node/yang-show-node.module';
import { ClipboardModule } from 'ngx-clipboard';
import { YangTreeModule } from './features/yang-tree/yang-tree.module';
import { YangStatsModule } from './features/statistics/yang-stats.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountModule } from './features/account/account.module';

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
    YangTreeModule,
    YangShowNodeModule,
    YangStatsModule,
    AccountModule,
    HttpClientModule,
    NgBootstrapFormValidationModule.forRoot(),
    CoreModule,
    AppAgGridModule,
    FontAwesomeModule,
    NgbTooltipModule,
    NgxChartsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
