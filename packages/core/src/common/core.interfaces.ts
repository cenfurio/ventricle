import {Provider, Type} from "@ventricle/common";

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
