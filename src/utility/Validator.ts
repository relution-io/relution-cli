export class Validator{
  /**
   * @example 80 or 9200 min 2 ,max 4
   * @type {RegExp}
   */
  public static portRegex:RegExp = /^(\d){2}$|(\d){4}$/;
  /**
   * url Pattern allowed
   * @example https://localkllk:9100/blubber&id=234 http://localkllk.de/blubber&id=234
   * @type {RegExp}
   */
  public static urlPattern:RegExp = /(http|https):\/\/[\w-]+(\.[\w-]+)|(\:[0-9])([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
  /**
   * allow a-Z 0-9 for the server name
   * @type {RegExp}
   */
  public static stringNumberPattern:RegExp = /^[a-zA-Z\s]|[0-9\s]+$/;
  /**
   * check if the string is not empty
   */
  public static notEmptyValidate(label:any):boolean {
    console.log(label);
    if ( label && label.length ) {
      return true;
    }
    console.log(`${label} can not be empty`)
    return false;
  }
  /**
   * check if the string is a valid url
   */
  public static url(url:string): any{
    return url.match(Validator.urlPattern);
  }
}
