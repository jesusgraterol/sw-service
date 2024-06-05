

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * App Installer Service
 * The service in charge of managing the PWA's Installation process.
 */
interface IAppInstallerService {
  // properties
  installationPromptOutcome: IInstallationPromptOutcome | undefined;
  appInstalled: boolean | undefined;
  runningInstalledApp: boolean;

  // actions
  canAppBeInstalled: () => boolean;
  installApp: () => Promise<void>;
}

/**
 * Installation Prompt Outcome
 * The action taken by the user once the installation prompt is displayed.
 */
type IInstallationPromptOutcome = 'accepted' | 'dismissed';

/**
 * User Choice
 * The result of the user's interaction with the installation prompt.
 */
interface IUserChoice {
  outcome: IInstallationPromptOutcome;
  platform: string;
}

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 * @important supported on Chrome and Android Webview.
 *
 * More Info:
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event
 * https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
 */
interface IBeforeInstallPromptEvent extends Event {
  // returns an array of DOMString items containing the platforms on which the event was dispatched.
  // This is provided for user agents that want to present a choice of versions to the user such as,
  // for example, "web" or "play" which would allow the user to chose between a web version or
  // an Android version.
  readonly platforms: Array<string>;

  // returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
  readonly userChoice: Promise<IUserChoice>;

  // allows a developer to show the install prompt at a time of their own choosing.
  prompt(): Promise<void>;
}

/**
 * Window Events
 * This technology is highly experimental and therefore, not all browser vedors have a "stable"
 * approach.
 */
declare global {
  interface WindowEventMap {
    beforeinstallprompt: IBeforeInstallPromptEvent;
  }
}





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IAppInstallerService,
  IInstallationPromptOutcome,
  IUserChoice,
  IBeforeInstallPromptEvent,
};
