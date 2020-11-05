import {Injector, Provider, ReflectiveInjector, Type} from "@ventricle/common";
import {Application, CORE_PROVIDERS} from "@ventricle/core";

export function bootstrapFromModule(moduleType: Type<any>, parentProviders: Provider[] = []) {
    const bootstrapInjector: Injector = ReflectiveInjector.resolveAndCreate([
        ...CORE_PROVIDERS,
        ...parentProviders
    ]);

    const app = bootstrapInjector.get(Application);

    return app.bootstrapModule(moduleType);
}
