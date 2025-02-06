/* eslint-disable no-console */
import { encodeError } from 'error-message-utils';
import { ERRORS } from '../shared/errors.js';
import { IAppInstallerService, IBeforeInstallPromptEvent, IInstallationPromptOutcome } from './types.js';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
const appInstallerFactory = (debugMode: boolean = false): IAppInstallerService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // if enabled, it will display logs throughout all processes and events
  const __debugMode: boolean = debugMode;

  // app installation
  let __installationPrompt: IBeforeInstallPromptEvent | undefined;
  let __installationPromptOutcome: IInstallationPromptOutcome | undefined;
  let __appInstalled: boolean | undefined;
  const __runningInstalledApp: boolean = window.matchMedia('(display-mode: standalone)').matches;





  /* **********************************************************************************************
   *                                        EVENT LISTENERS                                       *
   ********************************************************************************************** */

  /**
   * Triggers when the service worker is registered. It subscribes to the beforeinstallprompt which
   * is issued by browsers that support PWAs and provde the ability to trigger the browser's install
   * prompt. For more info visit:
   * https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt
   * https://web.dev/learn/pwa/installation-prompt
   * https://stackoverflow.com/questions/50332119/is-it-possible-to-make-an-in-app-button-that-triggers-the-pwa-add-to-home-scree
   */
  window.addEventListener(
    'beforeinstallprompt',
    (e: IBeforeInstallPromptEvent) => {
      if (__debugMode) console.log('Event Fired: beforeinstallprompt', e);
      // prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // store the event
      __installationPrompt = e;
    },
    { once: true },
  );

  /**
   * Subscribes to the appinstalled which is fired by Chromium-based browsers and indicate when the
   * app has completed installing on the user's device. For more info visit:
   * https://web.dev/learn/pwa/detection
   */
  window.addEventListener(
    'appinstalled',
    () => {
      if (__debugMode) console.log('Event Fired: appinstalled');
      __appInstalled = true;
    },
    { once: true },
  );





  /* **********************************************************************************************
   *                                            ACTIONS                                           *
   ********************************************************************************************** */

  /**
   * Evaluates if the application can be installed on the device.
   * @returns boolean
   */
  const canAppBeInstalled = (): boolean => (
    __installationPrompt !== undefined
    && typeof __installationPrompt.prompt === 'function'
    && !__runningInstalledApp
  );

  /**
   * Attempts to install the application on the user's device and stores the prompt's outcome.
   * @returns Promise<void>
   * @throws
   * - NO_APP_INSTALLER: if the beforeinstallprompt did not trigger
   *
   * More info:
   * https://web.dev/learn/pwa/installation-prompt
   */
  const installApp = async (): Promise<void> => {
    if (__installationPrompt && typeof __installationPrompt.prompt === 'function') {
      try {
        __installationPrompt.prompt();
        const choice = await __installationPrompt.userChoice;
        __installationPromptOutcome = choice.outcome;
        if (__debugMode) console.log('Action Fired: installApp', choice);

        // the installation prompt can only be used once
        __installationPrompt = undefined;
      } catch (e) {
        throw new Error(encodeError(e, ERRORS.UNKNOWN_INSTALLATION_PROMPT_ERROR));
      }
    } else {
      throw new Error(encodeError('The app cannot be installed because the prompt event was not provided by the browser.', ERRORS.NO_APP_INSTALLER));
    }
  };





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    get installationPromptOutcome() {
      return __installationPromptOutcome;
    },
    get appInstalled() {
      return __appInstalled;
    },
    get runningInstalledApp() {
      return __runningInstalledApp;
    },

    // actions
    canAppBeInstalled,
    installApp,
  });
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  appInstallerFactory,
};
