export class Validator {
  /**
   * @example 80 or 9200 min 2 ,max 4
   * @type {RegExp}
   */
  public static portRegex: RegExp = /^(\d){2}$|(\d){4}$/;
  /**
   * url Pattern allowed
   * @example https://localkllk:9100/blubber&id=234 http://localkllk.de/blubber&id=234
   * @type {RegExp}
   */
  public static urlPattern: RegExp = /(http|https):\/\/[\w-]+(\.[\w-]+)|(\:[0-9])([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
  /**
   * allowed many string numbers chars
   */
  public static stringNumberCharsPattern: RegExp = /^[\w\d]+$/;
  /**
   * allow a-Z 0-9 for the server name
   * @type {RegExp}
   */
  public static stringNumberPattern: RegExp = /^[a-zA-Z\s]|[0-9\s]+$/;
  /**
   * allow 0-9 for the server name
   * @type {RegExp}
   */
  public static numberPattern: RegExp = /^[0-9\s]+$/;
  /**
   * allow a-Z for the given value
   * @type {RegExp}
   */
  public static stringPattern: RegExp = /^[a-zA-Z\s]+$/;
  /**
   * allow a-Z for the given value and must have at end a .p12 extension
   * @type {RegExp}
   */
  public static p12Pattern: RegExp = /^[a-zA-Z\s]+(\.p12)+$/;
  /**
   * check if the string is not empty
   */
  public static notEmptyValidate(label: any): boolean {
    // console.log(label);
    if (label && label.length) {
      return true;
    }
    console.log(`${label} can not be empty`);
    return false;
  }
  /**
   * check if the string is a valid url
   */
  public static url(url: string): any {
    return url.match(Validator.urlPattern);
  }
  /**
   * map the Javatype to a Javascript pattern
   *  public static columnTypeMapping = {
      'java.lang.Boolean': lf.Type.BOOLEAN,
      'java.lang.Double': lf.Type.NUMBER,
      'java.lang.Float': lf.Type.NUMBER,
      'java.lang.Integer': lf.Type.INTEGER,
      'java.lang.String': lf.Type.STRING,
      'java.lang.Object': lf.Type.OBJECT,
      'java.math.BigDecimal': lf.Type.NUMBER,
      'java.math.BigInteger': lf.Type.NUMBER,
      'java.util.Date': lf.Type.DATE_TIME
    };
   */
  public static mapJavaType(javaType: string): RegExp {
    let pattern: RegExp;
    switch (javaType) {
      case 'java.lang.String':
        pattern = Validator.stringPattern;
        break;
      case 'java.lang.Number':
      case 'java.lang.Long':
        pattern = Validator.numberPattern;
        break;
      default:
        pattern = Validator.stringNumberCharsPattern;
        break;
    }
    return pattern;
  }
}
