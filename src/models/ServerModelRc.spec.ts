import {ServerModelRc} from './ServerModelRc';
const expect = require('expect.js');

describe('ServerModelRc', () => {
  let model: ServerModelRc;
  let temp = {
    'default': false,
    'id': 'beckmann new',
    'serverUrl': 'http://10.21.4.60:8080',
    'userName': 'ibxdev',
    'password': 'ibxdev'
  };

  beforeEach(() => {
    model = new ServerModelRc(temp);
  });

  it('convert into a json object', (done) => {
    expect(model.toJSON).not.to.be(undefined);
    expect(Object.keys(model.toJSON()).toString()).to.be.equal(Object.keys(temp).toString());
    done();
  });
});
