import {
    Injector,
    ReflectiveInjector,
    Type,
    Injectable,
    ResolvedReflectiveProvider
} from 'injection-js';

import {
    ILogger,
    CoreEvents, IPropertyProcessor, PROPERTY_PROCESSORS
} from './common';
import {Reflector} from './util';


import {EventDispatcher} from "./dispatcher";
import {ModuleResolver} from "./module.resolver";
import {ModuleProcessor} from "./processors";
import {GenericLogger} from "../util";

@Injectable()
export class Application {
    // private providers: Provider[] = [];
    private injector!: Injector;

    private readonly logger: ILogger = new GenericLogger("Application");

    constructor(private bootstrapInjector: Injector) {
    }

    async bootstrapModule(type: Type<any>): Promise<Injector> {
        if (!this.injector) this.injector = await this.doBootstrap(type);

        process.on('SIGINT', this.destroy.bind(this));
        process.on('SIGTERM', this.destroy.bind(this));
        // process.on('SIGUSR1', this.destroy.bind(this));
        // process.on('SIGUSR2', this.destroy.bind(this));
        // process.on('exit', this.destroy.bind(this));
        process.on('unhandledRejection', this.onProcessError.bind(this));
        process.on('uncaughtException', this.onProcessError.bind(this));

        return this.injector;
    }

    private async doBootstrap(type: Type<any>): Promise<Injector> {
        const moduleResolver = this.bootstrapInjector.get(ModuleResolver);

        const resolvedModule = moduleResolver.resolve(type);

        // The rootInjector has all providers of ModuleWithProvider modules
        const rootProviders = [...resolvedModule.getRootProviders()];
        const rootInjector: Injector = ReflectiveInjector.resolveAndCreate(rootProviders, this.bootstrapInjector);

        // The moduleInjector has all module providers
        const moduleProviders = [...resolvedModule.getProviders(), ...resolvedModule.getModules()];
        const moduleProcessor = rootInjector.get(ModuleProcessor, null);
        if (!moduleProcessor) {
            throw new Error("Failed to find ModuleProcessor, did you forget to import the CoreModule?");
        }
        resolvedModule.getModules().forEach(moduleType => moduleProcessor.process(moduleType, moduleProviders));

        // Module provider
        const moduleInjector: Injector = ReflectiveInjector.resolveAndCreate(moduleProviders, rootInjector);

        const resolvedProviders = this.resolveInjectorProviders(moduleInjector);

        const propertyProcessors = moduleInjector.get(PROPERTY_PROCESSORS);

        this.logger.info(`Initializing ${resolvedProviders.length} providers`);
        resolvedProviders.forEach(resolvedProvider => {
            const service = moduleInjector.get(resolvedProvider.key.token);
            this.processProviderProperties(propertyProcessors, service);
        });

        const dispatcher = moduleInjector.get(EventDispatcher);
        await dispatcher.dispatch(CoreEvents.INIT);

        return moduleInjector;
    }

    private resolveInjectorProviders(injector: Injector) {
        let providers: ResolvedReflectiveProvider[] = [];

        while(injector != null) {
            if (injector.hasOwnProperty('_providers')) {
                providers.push(...(<any>injector)._providers as ResolvedReflectiveProvider[]);
            }
            injector = (<any>injector).parent;
        }

        return providers;
    }

    private processProviderProperties(propertyProcessors: IPropertyProcessor<any>[], instance: Object | Object[]) {
        if (!instance.constructor) return;

        if (Array.isArray(instance)) {
            return instance.forEach(i => this.processProviderProperties(propertyProcessors, i));
        }

        const propMetadata = Reflector.propMetadata(instance.constructor as any);

        Object.keys(propMetadata).forEach(propertyKey => {
            propMetadata[propertyKey]
                .forEach(annotation => {
                    propertyProcessors
                        .filter(processor => processor.isSupported(annotation))
                        .forEach(processor => processor.process(instance, propertyKey, annotation));
                });
        });
    }

    private async destroy() {
        const dispatcher = this.injector.get(EventDispatcher);

        return await dispatcher.dispatch(CoreEvents.DESTROY);
    }

    private async onProcessError(err: any) {
        this.logger.error(err);
        process.exit(-1);
    }
}
