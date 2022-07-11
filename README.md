Chatterbox
==========

Chatterbox lets you securely embed [Hydrogen](https://github.com/vector-im/hydrogen-web) within any website.


<p align="center">
  <img alt="Chatterbox client screenshot" src="https://user-images.githubusercontent.com/2072976/178049551-14caddbe-4b06-4dfe-bc44-bab10603c632.png" />
</p>


### Requirements

To use Chatterbox you will need:

- A homeserver which supports [Token-authenticated registration](https://spec.matrix.org/v1.3/client-server-api/#token-authenticated-registration). Currently the only known implementation is [Synapse](https://github.com/matrix-org/synapse).
- An account on that homeserver which can create registration tokens. Synapse requires the account to be an admin.
    
### Develop Instructions
---
1) Clone the repo.
2) Install dependencies (you only need to do this once):
    ```properties
    yarn install
    ```
3) Modify config.json in `public` directory with your homeserver details.  
(See [`types/IChatterboxConfig.ts`](https://github.com/vector-im/chatterbox/blob/main/src/types/IChatterboxConfig.ts) for the format)
4) Start develop server:
    ```properties
    yarn start
    ```

### Build Instructions
---
Follow the develop instructions above (steps 1-3), then:
- Build chatterbox app into `/target` directory:
    ```properties
    yarn build
    ```

### Embed Instructions
---
Assuming that the build output (inside `/target`) is hosted at `<root>` (eg: chatterbox.element.io), copy and paste the following snippet before the closing `</body>` tag:
```html
	<script>
		window.CHATTERBOX_CONFIG_LOCATION = "path_to_config";
	</script>
	<script src="<root>/assets/parent.js" type="module" id="chatterbox-script"></script>
```

## Testing

Chatterbox comes with a suite of integration tests, using cypress.

You can run them by doing
```sh
yarn cypress install
yarn cypress open
``` 

Ensure you copy the `cypress/fixtures/demoInstance.sample.json` file to `cypress/fixtures/demoInstance.json` and edit 
the keys accordingly.

## Homeserver requirements & configuration

Chatterbox makes use of the [Token-authenticated registration](https://spec.matrix.org/v1.3/client-server-api/#token-authenticated-registration) feature,
and as such your homeserver implementation will need to support it.

### Synapse

Synapse has supported this feature since at least 1.52.0. You can enable token registration in homeserver config with:

```yaml
registration_requires_token: true
```

You will also need to manually create a registration token with the [create token API](https://matrix-org.github.io/synapse/latest/usage/administration/admin_api/registration_tokens.html#create-token).
You must use the access token of an administatator for this. See [the Synapse documentation](https://matrix-org.github.io/synapse/latest/usage/administration/admin_api/index.html) for help.

```sh
$ curl --data '{ "uses_allowed": 50 }' -H 'Authorization: Bearer YOUR_ADMIN_TOKEN' 'https://your-homeserver/_synapse/admin/v1/registration_tokens/new'
200 OK
{
    "token": "defg",
    "uses_allowed": 50,
    "pending": 0,
    "completed": 0,
    "expiry_time": null
}
```

Note that you can use `uses_allowed` to set how many chatterbox users can register via this token before no more will be permitted.
You can then use the value of `token` in the response inside your `config.json`.