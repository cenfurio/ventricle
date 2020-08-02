import 'reflect-metadata';

import { Type } from 'injection-js';

import { ANNOTATIONS, PARAMETERS, PROP_METADATA } from './decorators';

export type PropMetadata = {
    [key: string]: any[]
}

export interface ParamInformation {
    type: Type<any>;
    annotations: Readonly<any[]>;
}

export interface TypeInformation<T> {
    name: string;
    parameters: Readonly<ParamInformation[]>;
    annotations: Readonly<any[]>;
    props: PropMetadata
    factory: (args: any[]) => T;
}

/**
 * A wrapper around reflect-metadata
 * to get information from our decorators
 */
export class Reflector {

    /**
     * Get factory to create given type
     * @param type The type
     */
    static factory<T>(type: Type<T>): (args: any[]) => T {
        return (...args: any[]) => new type(...args);
    }

    /**
     * Get the parent constructor of a type
     * @param typeOrFunc The type
     */
    static parentCtor(typeOrFunc: Type<any> | Function): Type<any> {
        const parentPrototype = typeOrFunc.prototype ? Object.getPrototypeOf(typeOrFunc.prototype) : null;
        
        return parentPrototype ? parentPrototype.constructor : Object;
    }

    /**
     * Get own parameters of the given type
     * @param typeOrFunc The type
     * @param propertyKey
     */
    static ownParameters(typeOrFunc: Type<any> | Function | any, propertyKey?: string | symbol): Readonly<ParamInformation[]> {
        // if (!Reflect.hasOwnMetadata('design:paramtypes', typeOrFunc, propertyKey!)) throw new Error(`Couldn't find the parameter types of ${typeOrFunc}, is the class annotated with @Injectable()`);

        const paramTypes: any[] = Reflect.getOwnMetadata('design:paramtypes', typeOrFunc, propertyKey!) || [];
        const paramAnnotations: any[][] = Reflect.getOwnMetadata(PARAMETERS, typeOrFunc, propertyKey!) || [];

        return paramTypes.map((type, i) => ({
            type,
            annotations: paramAnnotations[i] || []
        }));
    }

    /**
     * Get all parameters of the given type
     * @param typeOrFunc The type
     * @param propertyKey
     */
    static parameters(typeOrFunc: Type<any> | Function | any, propertyKey?: string | symbol): Readonly<ParamInformation[]> {
        const parentCtor = this.parentCtor(typeOrFunc);
        const ownParameters = this.ownParameters(typeOrFunc, propertyKey) || [];
        const parentParameters = parentCtor !== Object ? this.parameters(parentCtor, propertyKey) : [];

        return [...parentParameters, ...ownParameters];
    }

    /**
     * Get own annotations of the given type
     * @param type The type
     */
    static ownAnnotations(type: Type<any>): Readonly<any[]> {
        return Reflect.getOwnMetadata(ANNOTATIONS, type) || [];
    }

    /**
     * Get all annotations of the given type
     * @param type The type
     */
    static annotations(type: Type<any>): Readonly<any[]> {
        const parentCtor = this.parentCtor(type);
        const ownAnnotations = this.ownAnnotations(type);
        const parentAnnotations = parentCtor !== Object ? this.annotations(parentCtor) : [];

        return [...parentAnnotations, ...ownAnnotations];
    }

    /**
     * Get own prop metadata of the given type
     * @param type The type
     */
    static ownPropMetadata(type: Type<any>): Readonly<PropMetadata> {
        return Reflect.getOwnMetadata(PROP_METADATA, type) || {};
    }

    /**
     * Get all prop metadata of the given type
     * @param type The type
     */
    static propMetadata(type: Type<any>): Readonly<PropMetadata> {
        const parentCtor = this.parentCtor(type);
        const ownPropMetadata = this.ownPropMetadata(type);
        const parentPropMetadata = parentCtor !== Object ? this.propMetadata(parentCtor) : null;

        if(!parentPropMetadata) {
            return ownPropMetadata;
        }

        const result: PropMetadata = { ...parentPropMetadata };

        Object.keys(ownPropMetadata).forEach(propKey => {
            const metadata: any[] = [];

            if(result.hasOwnProperty(propKey)) {
                metadata.push(...result[propKey]);
            }

            metadata.push(...ownPropMetadata[propKey]);

            result[propKey] = metadata;
        });

        return result;
    }

    /**
     * Checks whether the given type has the given annotation
     * @param type The type
     * @param annotation The annotation
     */
    static hasAnnotation(type: Type<any>, annotation: Type<any>) {
        const annotations = this.annotations(type);

        return annotations.some(a => a instanceof annotation);
    }

    /**
     * Gets an annotation from the given type
     * @param type The type
     * @param annotation The annotation
     */
    static getAnnotation<T>(type: Type<any>, annotation: Type<T>): T | undefined {
        const annotations = this.annotations(type);

        return annotations.find(a => a instanceof annotation);
    }

    /**
     * Gets all known metadata of the given type
     * @param type The type
     */
    static info<T>(type: Type<T>): TypeInformation<T> {
        return {
            name: type.name,
            parameters: this.parameters(type),
            annotations: this.annotations(type),
            props: this.propMetadata(type),
            factory: this.factory(type)
        };
    }
}