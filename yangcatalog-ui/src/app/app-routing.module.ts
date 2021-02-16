import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { YangCatalogComponent } from './static-content/yang-catalog/yang-catalog.component';
import { AboutComponent } from './static-content/about/about.component';
import { StaticContentComponent } from './static-content/static-content.component';
import { YangValidatorModule } from './yang-validator/yang-validator.module';
import { YangValidatorComponent } from './yang-validator/yang-validator.component';
import { YangSearchComponent } from './yang-search/yang-search.component';
import { YangImpactAnalysisComponent } from './yang-impact-analysis/yang-impact-analysis.component';
import { YangModuleDetailViewerComponent } from './yang-module-detail-viewer/yang-module-detail-viewer.component';
import { YangRegexValidatorComponent } from './yang-regex-validator/yang-regex-validator.component';

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
    path: 'yang-search/module_details',
    component: YangModuleDetailViewerComponent
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
