import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSearched'
})
export class HighlightSearchedPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    const searched = args[0] as string;
    const val = value.split(searched).join('<span class="highlight">' + searched + '</span>');
    return val;
  }

}
