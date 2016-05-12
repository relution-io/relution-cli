import {ChooseEnv} from './ChooseEnv';
import {EnvModel} from './../../models/EnvModel';
import {EnvCollection} from './../../collection/EnvCollection';

describe('Command Environment ChooseEnv', () => {
  let chooseEnv:ChooseEnv;
  let envCollection: EnvCollection = new EnvCollection();

  let collection:Array<EnvModel> = [];
  let mock:Array<string> = ['zend', 'foo','bar','dev', 'prod', 'atstart'];

  beforeEach(() => {
    collection = [];
    mock.forEach((name:string) => {
      collection.push(new EnvModel(name, `./test/${name}.hjson`, {name: name}))
    });
    envCollection.collection = collection;
    chooseEnv = new ChooseEnv(envCollection);
    chooseEnv.promptName = 'testenv';
  });

  it('chooseEnv has a collection', (done) => {
    expect(chooseEnv.envCollection.collection.length).toBe(mock.length);
    expect(chooseEnv.promptName).toBe('testenv');
    expect(chooseEnv.envCollection.collection[0].name).toBe('zend');
    done();
  });

  it('chooseEnv has a prompt', (done) => {
    let prompt = chooseEnv.prompt()[0];
    expect(prompt.choices.length).toBe(mock.length + 1);
    expect(prompt.choices[0]).toBe('atstart');
    done();
  });

  it('chooseEnv has a observable', (done) => {
    // chooseEnv.choose().subscribe((answers:any) => {
    //   expect(answers[chooseEnv.promptName]).toBeDefined();
    //   done();
    // });
  });
})
