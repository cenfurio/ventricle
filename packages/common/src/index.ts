export { Module, EventListener, Log } from './decorators';
export { ILogger, ModuleMetadata, ModuleWithProviders } from './interfaces';
export { Logger } from './services';
export { ANNOTATIONS, PARAMETERS, PROP_METADATA, ClassDecorator, ParameterDecorator, PropertyDecorator, makeDecorator, makeParamDecorator, makePropDecorator } from './util';

// Re-export injection-js functionalities
export { Inject, Optional, Type, Injectable, Provider, Injector, ReflectiveInjector, InjectionToken, isType } from 'injection-js';