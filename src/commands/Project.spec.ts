import {Project} from './Project';
const expect = require('expect.js');

describe('Command Project', () => {
  let project: Project = new Project();
  beforeEach(() => {
    project.preload().subscribe();
  });

  let commands: Array<string> = project.flatCommands();
  commands.forEach((method: string) => {
    it(`has ${method} as method`, (done) => {
      expect(project[method]).not.to.be(undefined);
      done();
    });
  });

  it('has project as name', (done) => {
    expect(project.name).to.be('project');
    done();
  });
});
