import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedFormatPipe } from './advanced-format.pipe';

@NgModule({
    declarations: [AdvancedFormatPipe],
    exports: [
        AdvancedFormatPipe
    ],
    imports: [
        CommonModule
    ]
})
export class CoreModule { }
