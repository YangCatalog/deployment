import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YangCatalogComponent } from './yang-catalog/yang-catalog.component';
import { AboutComponent } from './about/about.component';
import { BlogComponent } from './blog/blog.component';
import { ContributeComponent } from './contribute/contribute.component';
import { StaticContentComponent } from './static-content.component';
import { RouterModule } from '@angular/router';
import { StaticContentRoutingModule } from './static-content-routing.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [YangCatalogComponent, AboutComponent, BlogComponent, ContributeComponent, StaticContentComponent],
    imports: [
        CommonModule,
        RouterModule,
        StaticContentRoutingModule,
        CoreModule
    ]
})
export class StaticContentModule { }
