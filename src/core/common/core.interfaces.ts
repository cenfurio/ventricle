import {Provider, Type} from "injection-js";

export interface ILogger {
    info(msg: string, ...args: any[]);
    warn(msg: string, ...args: any[]);
    debug(msg: string, ...args: any[]);
    error(msg: string, ...args: any[]);

    // TODO: Look for other args needed
    // sentry(msg: string, ...args: any[]);
}

export interface TypeMetadata {
    type: Type<any>
}

export interface IModuleProcessor {
    /**
     * Processes a custom module, be aware to not reset the providers array!
     * @param type
     * @param providers
     */
    process(type: Type<any>, providers: Provider[]): void;
}

export interface IPropertyProcessor<T> {
    isSupported(annotation: any): boolean;
    process(instance: Object, propertyKey: string, annotation: T);
}
