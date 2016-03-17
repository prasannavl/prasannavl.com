/// <reference path="../../typings/main.d.ts" />

// Global vars

declare var __DEV__: boolean;
declare var __DOM__: boolean;

// Data modules

declare namespace DataModules {
    export interface ITitleServiceData {
        title: string;
        titleTemplate: string;
        titleOnEmpty: string;
    }
}

declare module "title-service-data" {
    export default {} as DataModules.ITitleServiceData;
}
