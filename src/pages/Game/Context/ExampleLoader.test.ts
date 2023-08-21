import { exampleLoader } from './ExampleLoader';
import examples from './examples.json';

describe('exampleLoader', () => {
    it('returns the configuration for a given example param', async () => {
        let result = await exampleLoader({ params: { example: 'pulsar'}});

        expect(result).toEqual(examples.pulsar);
    });
})