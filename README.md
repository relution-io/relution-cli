```
 _____      ​_       _   _​                 __   __      __
|  __ \    | |     | | (_)              /   | |  |    |  |
| |__) |___| |_   ​_| |_​ _  ___  _ _    |   /  |  |    |  |
|  ​_  // _​ \ | | | | __| |/ _ \| '_ \  |  |   |  |    |  |
| | \ \  __/ | |_| | |_| | (_) | | | | |   \  |  |__  |  |
|_|  \_\___|_|\__,_|\__|_|\___/|_| |_|  \___| |_____| |__|
```

### Dev Guide
---

##### Installation
```bash
$: git clone git@github.com:relution-io/relution-cli.git
$: cd relution-cli
$: npm i -g tsconfig-cli typings istanbul http-server
$: npm i
$: npm run watch
```

#### Bump Version
> Please Notice all files are uncommitted will be added also add a tag to your repo and push it to the repo. If you dont want this Please commit your changes before with your own comment.
```bash
npm run bump major|minor|patch|pre|premajor|preminor|prepatch|prerelease //available options
```

##### Test

```bash
$: npm test
```

##### Api reference
```bash
$: npm run api
$: npm run serve-api
```
