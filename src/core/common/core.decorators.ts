import {Provider, Type} from "injection-js";
import {makeDecorator, makePropDecorator} from "../util";

export interface Module {
    providers?: Provider[];
    imports?: (Type<any> | ModuleWithProviders)[];
}

export interface ModuleWithProviders {
    module: Type<any>;
    providers: Provider[];
}

export const Module = makeDecorator('Module', (module: Module) => module);


export interface EventListener {
    eventName: string;
    priority: number;
}

export const EventListener = makePropDecorator('EventListener', (eventName: string, priority?: number) => ({eventName, priority}));

export interface Logger {
    module: string;
}

export const Logger = makePropDecorator('Logger', (module: string) => ({module}));
