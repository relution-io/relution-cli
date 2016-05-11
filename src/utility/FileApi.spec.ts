import {FileApi} from './FileApi';

describe('File api', () => {

  it('read from a folder files by ext', (done) => {
    let api:FileApi = new FileApi();

    api.fileList(`${__dirname}/devtest`, '.hjson').subscribe(
      (files:any) => {
        console.log(files);
        expect(typeof files).toEqual('Array');
      },
      () => {},
      () => {done();}
    );
  });
});
