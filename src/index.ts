/* eslint-disable no-console */
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
  let __registration: ServiceWorkerRegistration | undefined;
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
  const register = ({
    path = '/sw.js',
    options = { scope: '/' },
    debugMode = false,
  }: ISWRegistrationOptions = {}): void => {
    // set the debug mode
    __debugMode = debugMode;

    // register the worker if the browser supports it
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(path, options)
        .then((registration: ServiceWorkerRegistration) => {
          // keep a copy of the registration
          __registration = registration;

          // populate the worker based on its state
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

  /**
   * Attempts to update the Service Worker safely if it was successfully registered. More info:
   * https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update
   * @returns Promise<void>
   */
  const __updateServiceWorker = async (): Promise<void> => {
    if (__registration) {
      try {
        await __registration.update();
      } catch (e) {
        console.error(e);
      }
    }
  };

  /**
   * Attempts to update the Service Worker (if it was registered) and then reloads the app.
   * @returns Promise<void>
   */
  const updateApp = async (): Promise<void> => {
    await __updateServiceWorker();
    window.location.reload();
  };





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    get registration() {
      return __registration;
    },
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
    updateApp,
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
  type ISWService,
  type ISWRegistrationOptions,
  SWService,
};
