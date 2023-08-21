import examples from './examples.json';
import { Cell } from '../GameOfLifeService';

type exampleName = 'block' | 'glider' | 'blinker' | 'pulsar' | 'synthesis' | 'soup';

export const exampleLoader = async ({ params }: { params: any}) => {
    console.log(params);
    if (params.example) {
        if (params.example !== 'soup') {
            return examples[params.example as exampleName];
        } else {
            const soupData: Cell[] = [];
            for (let i = 0; i < 50; i++) {
                for (let ii = 0; ii < 50; ii++) {
                    if (Math.round(Math.random() * 2) % 2 === 0) {
                        soupData.push({ x: i, y: ii });
                    } 
                }
            }
            console.log(soupData);
            return { data: soupData };
        }
    } else {
        return examples.glider;
    }
}