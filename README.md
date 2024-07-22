# SW Service

The `sw-service` package streamlines the registration of Service Workers on client devices, simplifying the process of delivering enhanced functionality and offline capabilities through Progressive Web Apps. This package offers a user-friendly approach to managing PWA installations, providing a seamless experience for both developers and end users.

If you are looking for a tool to generate the Service Worker for your app, some options are: [sw-builder](https://github.com/jesusgraterol/sw-builder) and [PWA Builder](https://docs.pwabuilder.com/#/home/sw-intro). 

If your service worker is generated after the build process but you wish to test the registration flow during development, create an empty `sw.js` file and pass its path to the `register` method.

For an example on how to implement this package, visit [uipalettes](https://github.com/jesusgraterol/uipalettes).


</br>

## Getting Started

Install the package:
```bash
$ npm install -S sw-service
```





</br>

## Usage

Register the Service Worker:

```typescript
SWService.register({ 
  path: '/sw.js',
  debugMode: true 
});
```

<br/>

Trigger the PWA Installer:

```typescript
if (SWService.installer?.canAppBeInstalled()) {
  SWService.installer.installApp();
}
```

<br/>

Update the Service Worker and refresh the app:

```typescript
SWService.updateApp();
```

<br/>

## Built With

- TypeScript




<br/>

## Running the Tests

```bash
# E2E Tests
$ npm run test:e2e

# Integration Tests
$ npm run test:integration

# Unit Tests
$ npm run test:unit
```





<br/>

## License

[MIT](https://choosealicense.com/licenses/mit/)





<br/>

## Acknowledgments

- [MDN](https://developer.mozilla.org/en-US/)
- [web.dev](https://web.dev/)
- [PWA Builder](https://www.pwabuilder.com/)



<br/>

## @TODOS

- [ ] Write the tests
- [ ] Improve the docs





<br/>

## Deployment

Install dependencies:
```bash
$ npm install
```


Build the library:
```bash
$ npm start
```


Publish to `npm`:
```bash
$ npm publish
```
