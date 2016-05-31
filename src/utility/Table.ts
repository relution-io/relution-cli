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

  sidebar(content: any, header: Array<string> = ['Options', 'Commands', 'Param(s)', 'Description']) {
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
