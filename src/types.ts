import { IAppInstallerService } from './app-installer/types.js';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * SW Service
 * The singleton that will handle the Service Worker's state as well as its functionality.
 */
interface ISWService {
  // properties
  registration: ServiceWorkerRegistration | undefined;
  worker: ServiceWorker | undefined;
  registrationError: string | undefined;
  registrationDurationSeconds: number;

  // sub modules
  installer: IAppInstallerService | undefined;

  // service worker registration
  register(options?: ISWRegistrationOptions): void;
  updateApp(): Promise<void>,
}

/**
 * SW Registration Options
 * The options that can be passed when registering the Service Worker.
 */
interface ISWRegistrationOptions {
  // the path to the service worker file. Defaults to: '/sw.js'
  path?: string;

  // enables debug mode in the service worker, as well as the rest of the sub modules
  debugMode?: boolean;
}




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  ISWService,
  ISWRegistrationOptions,
};
