import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'geturl'})
export class GetSafeUrl implements PipeTransform {

  constructor(private sanitizer: DomSanitizer ) {

  }
  transform(value: any) {
      console.log('pipe',value);
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}