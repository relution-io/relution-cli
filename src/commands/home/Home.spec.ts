import {Home} from './Home';

describe('Home Command', () => {
  let commandHome = new Home();
  beforeEach(() => {
    commandHome = new Home();
  });

  it('should have a name', (done) => {
    console.log('commandHome');
    console.log(commandHome);
    // expect(commandHome.name).tobe('Home');
    done();
  });
});
