import {Application, CORE_PROVIDERS, Injector, Provider, ReflectiveInjector, Type} from "@lib/core";

export function bootstrapFromModule(moduleType: Type<any>, parentProviders: Provider[] = []) {
    const bootstrapInjector: Injector = ReflectiveInjector.resolveAndCreate([
        ...CORE_PROVIDERS,
        ...parentProviders
    ]);

    const app = bootstrapInjector.get(Application);

    return app.bootstrapModule(moduleType);
}
