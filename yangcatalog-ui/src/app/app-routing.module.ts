import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { StaticContentComponent } from './features/static-content/static-content.component';
import { YangValidatorComponent } from './features/yang-validator/yang-validator.component';
import { YangSearchComponent } from './features/yang-search/yang-search.component';
import { YangImpactAnalysisComponent } from './features/yang-impact-analysis/yang-impact-analysis.component';
import { YangRegexValidatorComponent } from './features/yang-regex-validator/yang-regex-validator.component';
import { YangModuleDetailsComponent } from './features/yang-module-details/yang-module-details.component';
import { YangShowNodeComponent } from './features/yang-show-node/yang-show-node.component';
import { YangTreeComponent } from './features/yang-tree/yang-tree.component';

const routes: Routes = [
  {
    path: '',
    component: StaticContentComponent,
  },
  {
    path: 'yangvalidator/:validating',
    component: YangValidatorComponent,
  },
  {
    path: 'yangvalidator',
    component: YangValidatorComponent
  },
  {
    path: 'yang-search/show_node/:node/:path/:revision',
    component: YangShowNodeComponent,
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
    path: 'yang-search/yang_tree/show_node/:node/:path/:revision',
    component: YangShowNodeComponent,
  },
  {
    path: 'yang-search/yang_tree/:module',
    component: YangTreeComponent
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
