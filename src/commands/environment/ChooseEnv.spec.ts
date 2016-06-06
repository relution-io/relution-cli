import {ChooseEnv} from './ChooseEnv';
import {EnvModel} from './../../models/EnvModel';
import {EnvCollection} from './../../collection/EnvCollection';
const expect = require('expect.js');

describe('Command Environment ChooseEnv', () => {
  let chooseEnv: ChooseEnv;
  let envCollection: EnvCollection = new EnvCollection();

  let collection: Array<EnvModel> = [];
  let mock: Array<string> = ['zend', 'foo', 'bar', 'dev', 'prod', 'atstart'];

  before(() => {
    collection = [];
    mock.forEach((name: string) => {
      collection.push(new EnvModel(name, `./test/${name}.hjson`, { name: name }));
    });
    envCollection.collection = collection;
    chooseEnv = new ChooseEnv(envCollection);
  });

  it('chooseEnv has a collection', (done) => {
    expect(chooseEnv.envCollection.collection.length).to.be(mock.length);
    expect(chooseEnv.promptName).to.be('env');
    expect(chooseEnv.envCollection.collection[0].name).to.be('zend');
    done();
  });

  it('chooseEnv has a prompt', (done) => {
    let prompt = chooseEnv.prompt(chooseEnv.choices)[0];
    expect(prompt.choices.length).to.be(mock.length + 1);
    expect(prompt.choices[0].name).to.be('atstart');
    done();
  });


  // it('chooseEnv has a observable', (done) => {
  //   chooseEnv.choose().subscribe(
  //     (answers: any) => {
  //       expect(answers[chooseEnv.promptName]).to.beDefined();
  //     },
  //     () => {
  //       done();
  //     },
  //     () => {
  //       done();
  //     }
  //   );
  // });
});
