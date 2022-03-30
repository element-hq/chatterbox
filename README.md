Chatterbox lets you securely embed [Hydrogen](https://github.com/vector-im/hydrogen-web) within any website.
    
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
