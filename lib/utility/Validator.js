"use strict";
var Validator = (function () {
    function Validator() {
    }
    /**
     * check if the string is not empty
     */
    Validator.notEmptyValidate = function (label) {
        // console.log(label);
        if (label && label.length) {
            return true;
        }
        console.log(label + " can not be empty");
        return false;
    };
    /**
     * check if the string is a valid url
     */
    Validator.url = function (url) {
        return url.match(Validator.urlPattern);
    };
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
    Validator.mapJavaType = function (javaType) {
        var pattern;
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
    };
    /**
     * @example 80 or 9200 min 2 ,max 4
     * @type {RegExp}
     */
    Validator.portRegex = /^(\d){2}$|(\d){4}$/;
    /**
     * url Pattern allowed
     * @example https://localkllk:9100/blubber&id=234 http://localkllk.de/blubber&id=234
     * @type {RegExp}
     */
    Validator.urlPattern = /(http|https):\/\/[\w-]+(\.[\w-]+)|(\:[0-9])([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
    /**
     * allowed many string numbers chars
     */
    Validator.stringNumberCharsPattern = /^[\w\d]+$/;
    /**
     * allow a-Z 0-9 for the server name
     * @type {RegExp}
     */
    Validator.stringNumberPattern = /^[a-zA-Z\s]|[0-9\s]+$/;
    /**
     * allow a-Z _- for the string but no space
     * @type {RegExp}
     */
    Validator.namePattern = /^[a-zA-Z_]+$/;
    /**
     * allow a-Z _[] for the string but no space
     * @type {RegExp}
     */
    Validator.interfaceTypePattern = /^[a-zA-Z_\[\]]+$/;
    /**
     * allow 0-9 for the server name
     * @type {RegExp}
     */
    Validator.numberPattern = /^[0-9\s]+$/;
    /**
     * allow a-Z for the given value
     * @type {RegExp}
     */
    Validator.stringPattern = /^[a-zA-Z\s]+$/;
    /**
     * allow a-Z for the given value and must have at end a .p12 extension
     * @type {RegExp}
     */
    Validator.p12Pattern = /^[a-zA-Z\s]+(\.p12)+$/;
    return Validator;
}());
exports.Validator = Validator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxpdHkvVmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtJQUFBO0lBNkZBLENBQUM7SUEvQ0M7O09BRUc7SUFDVywwQkFBZ0IsR0FBOUIsVUFBK0IsS0FBVTtRQUN2QyxzQkFBc0I7UUFDdEIsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBSSxLQUFLLHNCQUFtQixDQUFDLENBQUM7UUFDekMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFDRDs7T0FFRztJQUNXLGFBQUcsR0FBakIsVUFBa0IsR0FBVztRQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUNEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDVyxxQkFBVyxHQUF6QixVQUEwQixRQUFnQjtRQUN4QyxJQUFJLE9BQWUsQ0FBQztRQUNwQixNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLEtBQUssa0JBQWtCO2dCQUNyQixPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQztnQkFDbEMsS0FBSyxDQUFDO1lBQ1IsS0FBSyxrQkFBa0IsQ0FBQztZQUN4QixLQUFLLGdCQUFnQjtnQkFDbkIsT0FBTyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUM7Z0JBQ2xDLEtBQUssQ0FBQztZQUNSO2dCQUNFLE9BQU8sR0FBRyxTQUFTLENBQUMsd0JBQXdCLENBQUM7Z0JBQzdDLEtBQUssQ0FBQztRQUNWLENBQUM7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUEzRkQ7OztPQUdHO0lBQ1csbUJBQVMsR0FBVyxvQkFBb0IsQ0FBQztJQUN2RDs7OztPQUlHO0lBQ1csb0JBQVUsR0FBVyw0RkFBNEYsQ0FBQztJQUNoSTs7T0FFRztJQUNXLGtDQUF3QixHQUFXLFdBQVcsQ0FBQztJQUM3RDs7O09BR0c7SUFDVyw2QkFBbUIsR0FBVyx1QkFBdUIsQ0FBQztJQUNwRTs7O09BR0c7SUFDVyxxQkFBVyxHQUFXLGNBQWMsQ0FBQztJQUNuRDs7O09BR0c7SUFDVyw4QkFBb0IsR0FBVyxrQkFBa0IsQ0FBQztJQUNoRTs7O09BR0c7SUFDVyx1QkFBYSxHQUFXLFlBQVksQ0FBQztJQUNuRDs7O09BR0c7SUFDVyx1QkFBYSxHQUFXLGVBQWUsQ0FBQztJQUN0RDs7O09BR0c7SUFDVyxvQkFBVSxHQUFXLHVCQUF1QixDQUFDO0lBZ0Q3RCxnQkFBQztBQUFELENBQUMsQUE3RkQsSUE2RkM7QUE3RlksaUJBQVMsWUE2RnJCLENBQUEifQ==