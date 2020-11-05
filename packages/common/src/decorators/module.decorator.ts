import {makeDecorator} from "../util";
import {ModuleMetadata} from '../interfaces/module.interface';

export const Module = makeDecorator('Module', (module: ModuleMetadata) => module);