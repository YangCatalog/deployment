import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaticContentComponent } from './features/static-content/static-content.component';
import { YangValidatorComponent } from './features/yang-validator/yang-validator.component';
import { YangSearchComponent } from './features/yang-search/yang-search.component';
import { YangImpactAnalysisComponent } from './features/yang-impact-analysis/yang-impact-analysis.component';
import { YangRegexValidatorComponent } from './features/yang-regex-validator/yang-regex-validator.component';
import { YangModuleDetailsComponent } from './features/yang-module-details/yang-module-details.component';

const routes: Routes = [
  {
    path: '',
    component: StaticContentComponent,
  },
  {
    path: 'yangvalidator',
    component: YangValidatorComponent
  },
  {
    path: 'yang-search',
    component: YangSearchComponent
  },
  {
    path: 'yang-search/impact_analysis',
    component: YangImpactAnalysisComponent
  },
  {
    path: 'yang-search/module_details/:module',
    component: YangModuleDetailsComponent
  },
  {
    path: 'yang-search/module_details',
    component: YangModuleDetailsComponent
  },
  {
    path: 'yangre',
    component: YangRegexValidatorComponent
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
