import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(fdato: Date, args: any): string {

    console.log(fdato);

    if (fdato === undefined || fdato === null ) {
      return '';
    } else {
      return '( ' +
              fdato.getDate().toString() + '/' +
              (fdato.getMonth() + 1).toString() + '/' +
              fdato.getFullYear().toString() + ' )';
    }
  }

}
