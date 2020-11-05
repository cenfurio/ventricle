import { makePropDecorator } from '../util';

export interface Log {
    module: string;
    id?: string
}

export const Log = makePropDecorator('Logger', (module: string, id?: string) => ({ module, id }));