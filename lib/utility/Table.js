"use strict";
var Clitable = require('cli-table2');
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
        this.table = new Clitable({ chars: this.tableChars });
        this.table.push(content);
        console.log(this.table.toString());
    };
    Table.prototype.sidebar = function (header, content) {
        var grid = new Clitable({
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
//# sourceMappingURL=Table.js.map