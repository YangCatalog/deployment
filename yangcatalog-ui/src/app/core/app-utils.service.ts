import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppUtilsService {

  constructor() { }

  /**
   * Modifies the value for alphanumerical sorting
   * @param value - any alphanumerical string
   */
  normalizeMixedDataValue(value) {
    const padding = '000000000000000';
    if (value) {
      value = '' + value;
      // Loop over all numeric values in the string and
      // replace them with a value of a fixed-width for
      // both leading (integer) and trailing (decimal)
      // padded zeroes.
      value = value.replace(
        /(\d+)((\.\d+)+)?/g,
        function( $0, integer, decimal, $3 ) {
          // If this numeric value has 'multiple'
          // decimal portions, then the complexity
          // is too high for this simple approach -
          // just return the padded integer.
          if ( decimal !== $3 ) {
            return(
              padding.slice( integer.length ) +
              integer +
              decimal
            );
          }
          decimal = ( decimal || '.0' );
          return(
            padding.slice( integer.length ) +
            integer +
            decimal +
            padding.slice( decimal.length )
          );
        }
      );
      return( value );
    } else {
      return (padding);
    }
  }
}
