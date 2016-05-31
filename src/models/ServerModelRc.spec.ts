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

  it('has attributes', (done) => {
    expect(model.attributes).not.to.be(undefined);
    expect(model.attributes.toString()).to.be.equal(Object.keys(temp).toString());
    done();
  });

  it('convert into a json object', (done) => {
    expect(model.toJson).not.to.be(undefined);
    expect(Object.keys(model.toJson()).toString()).to.be.equal(Object.keys(temp).toString());
    done();
  });
});
