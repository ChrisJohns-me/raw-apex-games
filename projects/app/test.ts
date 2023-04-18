// This file is required by karma.conf.js and loads recursively all the .spec and framework files
/* tslint:disable */
// tslint:disable:ordered-imports

import "zone.js/dist/zone-testing"; // zone-testing needs to be first import!
import { getTestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
