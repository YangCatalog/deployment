import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { YangCatalogComponent } from './yang-catalog/yang-catalog.component';
import { AboutComponent } from './about/about.component';
import { BlogComponent } from './blog/blog.component';
import { ContributeComponent } from './contribute/contribute.component';

const staticRoutes: Routes = [
  { path: '', redirectTo: '/home.html', pathMatch: 'full'},
  {
    path: 'home.html',
    component: YangCatalogComponent,
    pathMatch: 'full'
  },
  {
    path: 'about.html',
    component: AboutComponent
  },
  {
    path: 'blog.html',
    component: BlogComponent
  },
  {
    path: 'contribute.html',
    component: ContributeComponent
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(staticRoutes)

  ]
})
export class StaticContentRoutingModule { }
