import {New} from './New';

describe('Command New', () => {
  let project:New = new New();
  beforeEach(() => {
    project.preload().subscribe();
  });

  let commands:Array<string> = project.flatCommands();
  commands.forEach((method:string) => {
    it(`has ${method} as method`, (done) => {
      expect(project[method]).toBeDefined();
      done();
    });
  });

  it('has new as name', (done) => {
    expect(project.name).toBe('new');
    done();
  });
})
