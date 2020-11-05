import {Injectable, isType, Provider, Type, Module, ModuleMetadata} from "@ventricle/common";

import {Reflector} from "./util";

export class TransitiveModule {
    private rootProviders = new Set<Provider>();
    private providers = new Set<Provider>();
    private modules = new Set<Type<any>>();

    public addRootProvider(provider: Provider) {
        this.rootProviders.add(provider);
    }

    public addProvider(provider: Provider) {
        this.providers.add(provider);
    }

    public addModule(module: Type<any>) {
        this.modules.add(module);
    }

    public getRootProviders() {
        return [...this.rootProviders.values()];
    }

    public getProviders() {
        return [...this.providers.values()];
    }

    public getModules() {
        return [...this.modules.values()];
    }
}

@Injectable()
export class ModuleResolver {
    private cache = new Map<Type<any>, TransitiveModule>();

    resolve(type: Type<any>): TransitiveModule {
        if (this.cache.has(type)) {
            return this.cache.get(type)!;
        }

        if (!Reflector.hasAnnotation(type, Module)) {
            throw new Error(`${type.name} is missing the @Module annotation`);
        }

        const annotation = Reflector.getAnnotation<ModuleMetadata>(type, Module)!;

        // const metadata: ModuleMetadata = {
        //     type,
        //     providers: [],
        //     importedModules: []
        // }

        const transitiveModule = new TransitiveModule();

        if (annotation.imports) {
            annotation.imports.forEach(importedType => {
                let importedModule: Type<any> | null = null;
                if (isType(importedType)) {
                    importedModule = importedType;
                } else if (importedType.module) {
                    importedModule = importedType.module;
                    importedType.providers.forEach(provider => transitiveModule.addRootProvider(provider));
                    // metadata.providers.push(...importedType.providers);
                }

                if (!importedModule || importedModule === type) {
                    return;
                }

                const resolvedModule = this.resolve(importedModule);

                resolvedModule.getRootProviders().forEach(provider => transitiveModule.addRootProvider(provider));
                resolvedModule.getModules().forEach(module => transitiveModule.addModule(module));
                resolvedModule.getProviders().forEach(provider => transitiveModule.addProvider(provider));

                // this.processors.forEach(processor => processor.process(importedModule!, transitiveModule));
                // metadata.importedModules.push(resolvedModule);
            });
        }

        if (annotation.providers) {
            annotation.providers.forEach(provider => transitiveModule.addProvider(provider));
            // metadata.providers.push(...annotation.providers);
        }

        transitiveModule.addModule(type);

        this.cache.set(type, transitiveModule);

        return transitiveModule;
    }

    /**
     * Resolve a transitive module
     * @param type
     */
    resolveTransitive(type: Type<any>) {

    }
}
