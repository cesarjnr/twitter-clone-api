import { removeNullishValues } from '../../src/utils/object';

describe('object', () => {
  describe('removeNullishValues', () => {
    it('Should remove the nullish values from the given object', () => {
      const object = {
        prop1: 'value',
        prop2: null,
        prop3: 'value',
        prop4: undefined
      };

      const objectWithoutNullishValues = removeNullishValues(object);

      expect(objectWithoutNullishValues).toStrictEqual({
        prop1: 'value',
        prop3: 'value'
      });
    });

    it('Should throw an exception when the given argument is an array', () => {
      const thrownError = new Error('Parameter must be an object');
      const functionCall = () => { removeNullishValues([]) };

      expect(functionCall).toThrowError(thrownError);
    });

    it('Should throw an exception when the given argument is a function', () => {
      const thrownError = new Error('Parameter must be an object');
      const functionCall = () => { removeNullishValues(() => {}) };

      expect(functionCall).toThrowError(thrownError);
    });
  });
});
