import {makeDecorator} from "../util";
import {ModuleMetadata} from '../interfaces';

export const Module = makeDecorator('Module', (module: ModuleMetadata) => module);