import {Server} from './commands/Server';
import {Tower} from './commands/Tower';

let staticCommands = {
  server: new Server()
};
let relution = new Tower(staticCommands);
