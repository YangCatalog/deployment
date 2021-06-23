import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YangCatalogComponent } from './yang-catalog/yang-catalog.component';
import { AboutComponent } from './about/about.component';
import { ContributeComponent } from './contribute/contribute.component';
import { ContactComponent } from './contact/contact.component';
import { UseComponent } from './use/use.component';

const staticRoutes: Routes = [
  {
    path: '',
    component: YangCatalogComponent,
    pathMatch: 'full'
  },
  {
    path: 'home.html',
    component: YangCatalogComponent,
  },
  {
    path: 'contact.html',
    component: ContactComponent,
  },
  {
    path: 'use.html',
    component: UseComponent,
  },
  {
    path: 'about.html',
    component: AboutComponent
  },
  {
    path: 'contribute.html',
    component: ContributeComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(staticRoutes)

  ]
})
export class StaticContentRoutingModule {
}
