import {Server} from './commands/Server';
import {Relution} from './commands/Relution';

let staticCommands = {
  server: new Server()
};

if (process.argv[2] === 'relution') {
  let relution = new Relution(staticCommands);
}

