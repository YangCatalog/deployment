import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedFormatPipe } from './advanced-format.pipe';
import { HighlightSearchedPipe } from './highlight-searched.pipe';
import { FooterComponent } from './footer/footer.component';

@NgModule({
    declarations: [AdvancedFormatPipe, HighlightSearchedPipe, FooterComponent],
    exports: [
        AdvancedFormatPipe,
        HighlightSearchedPipe,
        FooterComponent
    ],
    imports: [
        CommonModule
    ]
})
export class CoreModule { }
