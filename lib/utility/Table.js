"use strict";
var clitable = require('cli-table2');
var Table = (function () {
    function Table() {
        this.tableChars = {
            'top': '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            'bottom': '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            'left': '║',
            'left-mid': '╟',
            'mid': '─',
            'mid-mid': '┼',
            'right': '║',
            'right-mid': '╢',
            'middle': '│'
        };
        this.tableCharsNoBorder = {
            'top': '',
            'top-mid': '',
            'top-left': '',
            'top-right': '',
            'bottom': '',
            'bottom-mid': '',
            'bottom-left': '',
            'bottom-right': '',
            'left': '',
            'left-mid': '',
            'mid': '',
            'mid-mid': '',
            'right': '',
            'right-mid': '',
            'middle': ''
        };
    }
    Object.defineProperty(Table.prototype, "table", {
        get: function () {
            return this._table;
        },
        set: function (v) {
            this._table = v;
        },
        enumerable: true,
        configurable: true
    });
    Table.prototype.notice = function (content) {
        this.table = new clitable({ chars: this.tableChars });
        this.table.push(content);
        console.log(this.table.toString());
    };
    Table.prototype.row = function (content, header) {
        var grid = new clitable({
            options: { hAlign: 'center', vAlign: 'center' },
            chars: this.tableCharsNoBorder,
            colWidths: [15, 200, 25, 25]
        });
        if (header) {
            grid.head = header;
        }
        content.forEach(function (item) {
            grid.push(item);
        });
        return grid.toString();
    };
    Table.prototype.sidebar = function (content, header) {
        var grid = new clitable({
            head: header,
            options: { hAlign: 'center', vAlign: 'center' },
            chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }
        });
        content.forEach(function (item) {
            grid.push(item);
        });
        return grid.toString();
    };
    return Table;
}());
exports.Table = Table;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbGl0eS9UYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3JDO0lBQUE7UUFHUyxlQUFVLEdBQVc7WUFDMUIsS0FBSyxFQUFFLEdBQUc7WUFDVixTQUFTLEVBQUUsR0FBRztZQUNkLFVBQVUsRUFBRSxHQUFHO1lBQ2YsV0FBVyxFQUFFLEdBQUc7WUFDaEIsUUFBUSxFQUFFLEdBQUc7WUFDYixZQUFZLEVBQUUsR0FBRztZQUNqQixhQUFhLEVBQUUsR0FBRztZQUNsQixjQUFjLEVBQUUsR0FBRztZQUNuQixNQUFNLEVBQUUsR0FBRztZQUNYLFVBQVUsRUFBRSxHQUFHO1lBQ2YsS0FBSyxFQUFFLEdBQUc7WUFDVixTQUFTLEVBQUUsR0FBRztZQUNkLE9BQU8sRUFBRSxHQUFHO1lBQ1osV0FBVyxFQUFFLEdBQUc7WUFDaEIsUUFBUSxFQUFFLEdBQUc7U0FDZCxDQUFDO1FBQ0ssdUJBQWtCLEdBQVc7WUFDbEMsS0FBSyxFQUFFLEVBQUU7WUFDVCxTQUFTLEVBQUUsRUFBRTtZQUNiLFVBQVUsRUFBRSxFQUFFO1lBQ2QsV0FBVyxFQUFFLEVBQUU7WUFDZixRQUFRLEVBQUUsRUFBRTtZQUNaLFlBQVksRUFBRSxFQUFFO1lBQ2hCLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLGNBQWMsRUFBRSxFQUFFO1lBQ2xCLE1BQU0sRUFBRSxFQUFFO1lBQ1YsVUFBVSxFQUFFLEVBQUU7WUFDZCxLQUFLLEVBQUUsRUFBRTtZQUNULFNBQVMsRUFBRSxFQUFFO1lBQ2IsT0FBTyxFQUFFLEVBQUU7WUFDWCxXQUFXLEVBQUUsRUFBRTtZQUNmLFFBQVEsRUFBRSxFQUFFO1NBQ2IsQ0FBQztJQXdDSixDQUFDO0lBdkNDLHNCQUFXLHdCQUFLO2FBSWhCO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQzthQU5ELFVBQWlCLENBQU07WUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbEIsQ0FBQzs7O09BQUE7SUFNRCxzQkFBTSxHQUFOLFVBQU8sT0FBWTtRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxtQkFBRyxHQUFILFVBQUksT0FBWSxFQUFFLE1BQXNCO1FBQ3RDLElBQUksSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtZQUMvQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtZQUM5QixTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7U0FDN0IsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLENBQUM7UUFDRCxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBWTtZQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBQ0QsdUJBQU8sR0FBUCxVQUFRLE9BQVksRUFBRSxNQUFxQjtRQUN6QyxJQUFJLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQztZQUN0QixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtZQUMvQyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFO1NBQ3JFLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFZO1lBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0FBQyxBQTVFRCxJQTRFQztBQTVFWSxhQUFLLFFBNEVqQixDQUFBIn0=