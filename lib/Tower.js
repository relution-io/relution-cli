// #!/usr/bin/env node
// import {Observable} from '@reactivex/rxjs';
// import * as Commands from './commands/Commands';
// let path = require('path');
// let nopt = require('nopt');
// let pkg = require('./../package.json');
// let readline = require('readline');
// /**
//  * @class Tower
//  */
// class Tower {
//   public dispatcher: Observable<any>;
//   public rl: any;
//   public userArgs:any;
//   constructor( argv?:any) {
//     console.log(Commands.home);
//     debugger;
//     //use the prompt
//     if (!argv) {
//       this.rl = readline.createInterface(process.stdin, process.stdout);
//       this.rl.setPrompt('$relution: ');
//       this.rl.prompt();
//     } else {
//       //use it directly
//       this.userArgs = argv;
//       console.log(this.userArgs);
//     }
//   }
//   public addListener(){
//     this.dispatcher = Observable.create((observer:any) => {
//       this.rl.on('line', (line: string) => {
//         console.log(line);
//         switch(line.trim()) {
//           case 'q':
//           case 'quit':
//             this.exit();
//             break;
//           case '':
//             this.rl.prompt();
//             break;
//           default:
//             observer.next(line.trim().split(' '));
//             console.log(JSON.stringify(line.trim().split(' '), null, 2));
//             break;
//         }
//         this.rl.prompt();
//       }).on('close', () => {
//         observer.complete();
//       }).on('error', (e:Error) => {
//         console.log(e);
//       });
//     });
//     console.log(this.dispatcher);
//   }
//   public exit(){
//     console.log('Have a great day!');
//     process.exit(0);
//   }
// }
// let cli:Tower;
// if (process.argv.length >= 2) {
//   let args = process.argv.splice(0, 2);
//   cli = new Tower(args);
// } else {
//   cli = new Tower();
//   cli.addListener();
//   cli.dispatcher.subscribe({
//     next: (x) => console.log('got value ' + x),
//     error: err => console.error('something wrong occurred: ' + err),
//     complete: () => console.log('done'),
//   });
// }
// export default cli;
//# sourceMappingURL=Tower.js.map