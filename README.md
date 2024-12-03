# Service Worker Service

The `sw-service` package streamlines the registration of Service Workers on client devices, simplifying the process of delivering enhanced functionality and offline capabilities through Progressive Web Apps. This package offers a user-friendly approach to managing PWA installations, providing a seamless experience for both developers and end users.

If you are looking for a tool to generate the Service Worker for your app, some options are: [sw-builder](https://github.com/jesusgraterol/sw-builder) and [PWA Builder](https://docs.pwabuilder.com/#/home/sw-intro). 

If your service worker is generated after the build process but you wish to test the registration flow during development, create an empty `sw.js` file and pass its path to the `register` method.

For an example on how to implement this package, visit [uipalettes](https://github.com/jesusgraterol/uipalettes).


</br>

## Getting Started

Install the package:
```bash
npm install -S sw-service
```

### Usage

Register the Service Worker:

```typescript
import { SWService } from 'sw-service';

SWService.register({ 
  path: '/sw.js',
  debugMode: true 
});
```

<br/>

Trigger the PWA Installer:

```typescript
import { SWService } from 'sw-service';

if (SWService.installer?.canAppBeInstalled()) {
  SWService.installer.installApp();
}
```

<br/>

Update the Service Worker and refresh the app:

```typescript
import { SWService } from 'sw-service';

SWService.updateApp();
```





<br/>

## Types

<details>
  <summary><code>IAppInstallerService</code></summary>
  
  The service in charge of managing the PWA's Installation process.
  ```typescript
  interface IAppInstallerService {
    // properties
    installationPromptOutcome: IInstallationPromptOutcome | undefined;
    appInstalled: boolean | undefined;
    runningInstalledApp: boolean;

    // actions
    canAppBeInstalled: () => boolean;
    installApp: () => Promise<void>;
  }
  ```
</details>

<br/>

<details>
  <summary><code>IInstallationPromptOutcome</code></summary>
  
  The action taken by the user once the installation prompt is displayed.
  ```typescript
  type IInstallationPromptOutcome = 'accepted' | 'dismissed';
  ```
</details>

<br/>

<details>
  <summary><code>IUserChoice</code></summary>
  
  The result of the user's interaction with the installation prompt.
  ```typescript
  interface IUserChoice {
    outcome: IInstallationPromptOutcome;
    platform: string;
  }
  ```
</details>

<br/>

<details>
  <summary><code>ISWService</code></summary>
  
  The singleton that will handle the Service Worker's state as well as its functionality.
  ```typescript
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
  ```
</details>

<br/>

<details>
  <summary><code>ISWRegistrationOptions</code></summary>
  
  The options that can be passed when registering the Service Worker.
  ```typescript
  interface ISWRegistrationOptions {
    // the path to the service worker file. Defaults to: '/sw.js'
    path?: string;

    // enables debug mode in the service worker, as well as the rest of the sub modules
    debugMode?: boolean;
  }
  ```
</details>





<br/>

## Built With

- TypeScript




<br/>

## Running the Tests

```bash
# E2E Tests
npm run test:e2e

# Integration Tests
npm run test:integration

# Unit Tests
npm run test:unit
```





<br/>

## License

[MIT](https://choosealicense.com/licenses/mit/)





<br/>

## Deployment

Install dependencies:
```bash
npm install
```


Build the library:
```bash
npm start
```


Publish to `npm`:
```bash
npm publish
```
