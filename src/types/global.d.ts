/// <reference path="../../typings/main.d.ts" />

// Global vars

declare var __DEV__: boolean;
declare var __DOM__: boolean;
declare var __non_webpack_require__: any;
declare var __webpack_require__: any;

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
