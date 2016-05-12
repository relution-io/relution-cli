import {EnvCollection} from './EnvCollection';
import {EnvModel} from './../models/EnvModel';

describe('EnVCollection a subset of environments', () => {

  it ('load collection', (done) => {
    let envCollection = new EnvCollection();
    envCollection.getEnvironments().subscribe({
      complete: () => {
        console.log('envCollection.collection', envCollection.collection);
        expect(envCollection.collection.length).toBeGreaterThan(0);
        done();
      }
    });
  });
});
