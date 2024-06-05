import { encodeError, extractMessage } from 'error-message-utils';
import { ERRORS } from './shared/errors.js';
import {
  IAppInstallerService,
  IInstallationPromptOutcome,
  IBeforeInstallPromptEvent,
  IUserChoice,
} from './app-installer/types.js';
import { appInstallerFactory } from './app-installer/app-installer.service.js';
import { ISWService, ISWRegistrationOptions } from './types.js';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
const SWServiceFactory = (): ISWService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // if enabled, it will display logs throughout all processes and events
  let __debugMode: boolean = false;

  // service worker's registration
  let __worker: ServiceWorker | undefined;
  let __registrationError: string | undefined;
  const __registrationDurationSeconds: number = 5;


  /* **********************************************************************************************
   *                                         SUB MODULES                                          *
   ********************************************************************************************** */

  // app installer
  let __installer: IAppInstallerService | undefined;





  /* **********************************************************************************************
   *                                           ACTIONS                                            *
   ********************************************************************************************** */

  /**
   * Attempts to register the Service Worker. If it is successful, it stores the registration
   * instance. Otherwise, it stores the error message.
   * @param options?
   * @throws
   * - SW_NO_BROWSER_SUPPORT: if the browser doesn't support service workers
   * - EMPTY_SW_REGISTRATION: if the service worker's registration is empty for an unknown reason
   */
  const register = ({ path = 'sw.js', debugMode = false }: ISWRegistrationOptions = {}): void => {
    // set the debug mode
    __debugMode = debugMode;

    // register the worker if the browser supports it
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(path, { scope: '/' })
        .then((registration: ServiceWorkerRegistration) => {
          let serviceWorker: ServiceWorker | undefined;
          if (registration.installing) {
            if (__debugMode) console.log('Event Fired: serviceWorker.registration.installing', registration);
            serviceWorker = registration.installing;
          } else if (registration.waiting) {
            if (__debugMode) console.log('Event Fired: serviceWorker.registration.waiting', registration);
            serviceWorker = registration.waiting;
          } else if (registration.active) {
            if (__debugMode) console.log('Event Fired: serviceWorker.registration.active', registration);
            serviceWorker = registration.active;
          }
          if (serviceWorker) {
            // store the worker's instance
            __worker = serviceWorker;

            // update the instance whenever the state changes
            serviceWorker.addEventListener('statechange', (e) => {
              if (__debugMode) console.log('Event Fired: serviceWorker.registration.statechange', e);
              __worker = <ServiceWorker>e.target;
            });

            // init the app's installer
            __installer = appInstallerFactory(debugMode);
          } else {
            console.log(registration);
            __registrationError = encodeError('The Service Worker\'s Registration is empty', ERRORS.EMPTY_SW_REGISTRATION);
          }
        })
        .catch((e) => {
          console.error(e);
          __registrationError = extractMessage(e);
        });
    } else {
      __registrationError = encodeError('The browser does not support Service Workers.', ERRORS.SW_NO_BROWSER_SUPPORT);
    }
  };





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    get worker() {
      return __worker;
    },
    get registrationError() {
      return __registrationError;
    },
    get registrationDurationSeconds() {
      return __registrationDurationSeconds;
    },

    // sub modules
    get installer() {
      return __installer;
    },

    // actions
    register,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const SWService = SWServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // app installer
  type IAppInstallerService,
  type IInstallationPromptOutcome,
  type IUserChoice,
  type IBeforeInstallPromptEvent,

  // service worker singleton
  SWService,
  type ISWRegistrationOptions,
};
