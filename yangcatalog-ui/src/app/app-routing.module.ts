import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './features/account/account/account.component';
import { ImpactAnalysisComponent } from './features/impact-analysis/impact-analysis.component';
import { PrivateComponent } from './features/private/private.component';
import { YangCatalogComponent } from './features/static-content/yang-catalog/yang-catalog.component';
import { YangStatsComponent } from './features/statistics/yang-stats.component';
import { YangModuleDetailsComponent } from './features/yang-module-details/yang-module-details.component';
import { YangRegexValidatorComponent } from './features/yang-regex-validator/yang-regex-validator.component';
import { YangSearchComponent } from './features/yang-search/yang-search.component';
import { YangShowNodeComponent } from './features/yang-show-node/yang-show-node.component';
import { YangTreeComponent } from './features/yang-tree/yang-tree.component';
import { YangValidatorComponent } from './features/yang-validator/yang-validator.component';

// todo: move child routes to child modules
const routes: Routes = [
  {
    path: '',
    component: YangCatalogComponent
  },
  {
    path: 'private-page',
    component: PrivateComponent,
  },
  {
    path: 'private-page/:jsonfile',
    component: PrivateComponent,
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
  // {
  //   path: 'yang-search/impact_analysis',
  //   component: YangImpactAnalysisComponent
  // },
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
    path: 'yang-search/impact_analysis/:module',
    component: ImpactAnalysisComponent
  },
  {
    path: 'yang-search/impact_analysis',
    component: ImpactAnalysisComponent
  },
  {
    path: 'yangre',
    component: YangRegexValidatorComponent
  },
  {
    path: 'stats/statistics.html',
    component: YangStatsComponent
  },
  {
    path: 'create.html',
    component: AccountComponent
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
