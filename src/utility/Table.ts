let clitable = require('cli-table2');
export class Table {
  private _table: any;

  public tableChars: Object = {
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
  public tableCharsNoBorder: Object = {
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
  public set table(v: any) {
    this._table = v;
  }

  public get table(): any {
    return this._table;
  }

  notice(content: any) {
    this.table = new clitable({ chars: this.tableChars });
    this.table.push(content);
    console.log(this.table.toString());
  }

  row(content: any, header?: Array<string>) {
    let grid = new clitable({
      options: { hAlign: 'center', vAlign: 'center' },
      chars: this.tableCharsNoBorder,
      colWidths: [15, 200, 25, 25]
    });
    if (header) {
      grid.head = header;
    }
    content.forEach((item: Object) => {
      grid.push(item);
    });
    return grid.toString();
  }
  sidebar(content: any, header: Array<string>) {
    console.log(content, header);
    let grid = new clitable({
      head: header,
      options: { hAlign: 'center', vAlign: 'center' },
      chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }
    });
    content.forEach((item: Object) => {
      grid.push(item);
    });
    return grid.toString();
  }
}
