import {ServerModelRc} from './ServerModelRc';

describe('ServerModelRc', () => {
  let model:ServerModelRc;
  let temp =  {
    "default": false,
    "id": "beckmann new",
    "serverUrl": "http://10.21.4.60:8080",
    "userName": "ibxdev",
    "password": "ibxdev"
  };

  beforeEach(() => {
    model = new ServerModelRc(temp)
  });

  it('has attributes', (done) => {
    expect(model.attributes).toBeDefined();
    expect(model.attributes).toEqual(Object.keys(temp));
    done();
  });

  it('convert into a json object', (done) => {
    expect(model.toJson).toBeDefined();
    expect(Object.keys(model.toJson())).toEqual(Object.keys(temp));
    done();
  });
});
