import { Injectable } from '@angular/core';
import { ImageDetail } from '@pt/pt-topology';

@Injectable({
  providedIn: 'root'
})
export class SvgIconService {

  constructor() { }

  private transformToImageDetail(resourcesStr): ImageDetail {
    return new ImageDetail(19, 19, resourcesStr);
  }

  getRouterImageDetail(color, opacity): ImageDetail {
    const svgRouter = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.546665 33.573334" height="18" width="18" version="1.1">\n' +
      '    <g transform="matrix(1.3333333,0,0,-1.3333333,0,33.573333)" id="g10">\n' +
      '        <g transform="scale(0.1)" id="g12">\n' +
      '                <path style="fill:' + color + ';fill-opacity:' + opacity + ';fill-rule:nonzero;stroke:none" d="m 369.855,178.281 c 0,-39.504 -82.343,-71.523 -183.925,-71.523 C 84.3477,106.758 2,138.777 2,178.281 V 73.5156 c 0,-39.5 82.3477,-71.52341 183.93,-71.52341 101.582,0 183.925,32.02341 183.925,71.52341 V 178.281" />\n' +
      '                <path style="fill:none;stroke:#ffffff;stroke-width:4;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 369.855,178.281 c 0,-39.504 -82.343,-71.523 -183.925,-71.523 C 84.3477,106.758 2,138.777 2,178.281 V 73.5156 c 0,-39.5 82.3477,-71.52341 183.93,-71.52341 101.582,0 183.925,32.02341 183.925,71.52341 z" />\n' +
      '                <path style="fill:' + color + ';fill-opacity:' + opacity + ';fill-rule:nonzero;stroke:none" d="m 185.93,106.758 c 101.582,0 183.925,32.019 183.925,71.523 0,39.512 -82.343,71.524 -183.925,71.524 C 84.3477,249.805 2,217.793 2,178.281 2,138.777 84.3477,106.758 185.93,106.758" />\n' +
      '                <path style="fill:none;stroke:#ffffff;stroke-width:4;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 185.93,106.758 c 101.582,0 183.925,32.019 183.925,71.523 0,39.512 -82.343,71.524 -183.925,71.524 C 84.3477,249.805 2,217.793 2,178.281 2,138.777 84.3477,106.758 185.93,106.758 Z" />\n' +
      '                <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 143.926,206.25 15.183,-22.781 -57.421,-13.274 12.55,10.45 -88.7497,15.168 22.2656,16.687 85.6371,-14.5 10.535,8.25" />\n' +
      '                <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 224.727,151.008 -10.364,23.484 51.797,10.352 -8.98,-8.047 86.328,-14.746 -20.715,-16.571 -85.813,16.114 -12.253,-10.586" />\n' +
      '                <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 196.406,218.691 58.02,15.879 0.679,-24.863 -14.5,2.766 -28.308,-23.489 -27.024,3.946 29.231,22.968 -18.098,2.793" />\n' +
      '                <path style="fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 171.543,129.59 -55.242,-10.352 -2.071,25.547 15.875,-3.445 30.415,25.965 26.914,-4.551 -32.461,-28.32 16.57,-4.844" />\n' +
      '        </g>\n' +
      '    </g>\n' +
      '</svg>\n';

    return this.transformToImageDetail(svgRouter);
  }
}
