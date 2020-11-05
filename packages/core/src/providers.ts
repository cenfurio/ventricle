import {Provider} from "@ventricle/common";

import {ModuleResolver} from "./module.resolver";
import {Application} from "./application";
import {EventDispatcher} from "./dispatcher";

export const CORE_PROVIDERS: Provider[] = [
    Application,
    ModuleResolver,
    EventDispatcher
];
