import {New} from './New';
const expect = require('expect.js');

describe('Command New', () => {
  let project:New = new New();
  beforeEach(() => {
    project.preload().subscribe();
  });

  let commands:Array<string> = project.flatCommands();
  commands.forEach((method:string) => {
    it(`has ${method} as method`, (done) => {
      expect(project[method]).not.to.be(undefined);
      done();
    });
  });

  it('has new as name', (done) => {
    expect(project.name).to.be('new');
    done();
  });
})
