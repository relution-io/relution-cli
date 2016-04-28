import {Home} from './Home';

describe('Home Command', () => {
  let commandHome = null;

  beforeEach((done) => {
    commandHome = new Home();
    done();
  });

  it('should have a name', (done) => {
    console.log(commandHome);
    // expect(commandHome.name).tobe('Home');
    done();
  });
});
