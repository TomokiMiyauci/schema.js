# [1.0.0-beta.11](https://github.com/schemaland/schema.js/compare/1.0.0-beta.10...1.0.0-beta.11) (2022-08-26)


### Features

* **schemas:** change `ArraySchema` interface what accept array subtype ([5252859](https://github.com/schemaland/schema.js/commit/5252859f42f468f520065d16e19d9eb215054e01))

# [1.0.0-beta.10](https://github.com/schemaland/schema.js/compare/1.0.0-beta.9...1.0.0-beta.10) (2022-08-26)


### Bug Fixes

* **asserts:** fix to `orSchema` when assertion is none ([f1341ed](https://github.com/schemaland/schema.js/commit/f1341ed5e4df2578af04d04192e3b9b303a624de))


### Features

* **schemas:** `AndSchema` accept all values but also schemas ([04022e6](https://github.com/schemaland/schema.js/commit/04022e66def2e61463f4ba1b53914e5304f18a33))
* **schemas:** `NotSchema` accept all values but also schema ([4528ad0](https://github.com/schemaland/schema.js/commit/4528ad0a2bc005487ab0c91c2c109ed7dc00e2b1))
* **schemas:** `OrSchema` accept any values but also schemas ([a682091](https://github.com/schemaland/schema.js/commit/a682091e4e50ed511376eabd3038f5691b6ca5a7))

# [1.0.0-beta.9](https://github.com/schemaland/schema.js/compare/1.0.0-beta.8...1.0.0-beta.9) (2022-08-26)


### Features

* **schemas:** `ObjectSchema` expand accepting value types ([23c88b1](https://github.com/schemaland/schema.js/commit/23c88b1bfbc9392e85443c35dfd7fdabe74ac06d))
* **types:** export `Schema` types ([bc8aed7](https://github.com/schemaland/schema.js/commit/bc8aed72d6c6e492e2905e860aed9f6c6e1e9ef5))
* **validates:** add `validateSchema` that validate value with schema definition ([20be4c3](https://github.com/schemaland/schema.js/commit/20be4c3aa5cce658b10bfed6ec48bc9ab66fb06b))
* **validates:** export `isSchema` function ([f6c067b](https://github.com/schemaland/schema.js/commit/f6c067b8a3dbdba453c0b9ec3dfe1dc9f7827809))
* **validates:** export `ValidateResult` types ([38cd161](https://github.com/schemaland/schema.js/commit/38cd161ce5d95574b0d5f1281973cadc627b2216))

# [1.0.0-beta.8](https://github.com/schemaland/schema.js/compare/1.0.0-beta.7...1.0.0-beta.8) (2022-08-26)


### Bug Fixes

* **type_guards:** fix `isSchema` logic ([f33abf0](https://github.com/schemaland/schema.js/commit/f33abf02ca132c428df00a8fdf53bc8e58211928))


### Features

* **asserts:** add assertion for equality and partial property ([1c5e123](https://github.com/schemaland/schema.js/commit/1c5e12307b772c08e4072f32e5786694a3646cc0))
* **schemas:** add schema for optional properties ([00953db](https://github.com/schemaland/schema.js/commit/00953dbb0dd92b45c34ba87d900ea3fefaf17793))
* **types:** export `UnwrapSchema` types ([6cf89fe](https://github.com/schemaland/schema.js/commit/6cf89fe7138bccb85f35121489ecfa29b53f8cbc))
* **types:** improve `UnwrapSchema` types ([18b4b36](https://github.com/schemaland/schema.js/commit/18b4b365839fa9d485691a9040d41c9b41523bdd))
* **types:** improve `UnwrapSchema` types infer ([048be33](https://github.com/schemaland/schema.js/commit/048be334bc92b360e176b4d422bb9a6022bb6fe2))

# [1.0.0-beta.7](https://github.com/schemaland/schema.js/compare/1.0.0-beta.6...1.0.0-beta.7) (2022-08-25)


### Features

* **utils:** improve error message ([2d57a79](https://github.com/schemaland/schema.js/commit/2d57a799d5dd2ac2d5f765d53ef9584739ad0094))

# [1.0.0-beta.6](https://github.com/schemaland/schema.js/compare/1.0.0-beta.5...1.0.0-beta.6) (2022-08-25)


### Bug Fixes

* **operators:** remove types for Function what treat speciality ([be7e965](https://github.com/schemaland/schema.js/commit/be7e965ae77f43443c6036e4c7aae8e9a5d51d11))


### Features

* **errors:** add default assertion message template ([808b514](https://github.com/schemaland/schema.js/commit/808b514cf193e50e1b6357e8fa78d40251ebf76f))
* **schemas:** add `Date` object schema ([fe9ffbc](https://github.com/schemaland/schema.js/commit/fe9ffbcdabf6d8ebb7b053c81d2ef1c20a687f3c))
* **schemas:** add assertion for has property to ObjectSchema and add test case ([ba771b3](https://github.com/schemaland/schema.js/commit/ba771b36b6a80d8fbd8ab28a44d42f928e6d9b0e))

# [1.0.0-beta.5](https://github.com/schemaland/schema.js/compare/1.0.0-beta.4...1.0.0-beta.5) (2022-08-24)


### Bug Fixes

* **schemas:** change internal creating instance method ([2a39ff5](https://github.com/schemaland/schema.js/commit/2a39ff5626824eadcd232501a4eb95f3d18b64d0))


### Features

* **errors:** change assertion error interface ([53e6a32](https://github.com/schemaland/schema.js/commit/53e6a32e3f2371d1953dc3f14ea38da02396c6a2))
* **schemas:** add count schema ([99902f6](https://github.com/schemaland/schema.js/commit/99902f6a42f558dd506916702cf63a192a39d11f))
* **schemas:** add max schema and min schema for union types ([b2dbdbc](https://github.com/schemaland/schema.js/commit/b2dbdbcf901b11e3e92ceb94281c7c68df7d2f10))
* **schemas:** add min count schema ([ea8d7ea](https://github.com/schemaland/schema.js/commit/ea8d7ea58d3546e9654d1eb8833f8395790e651e))
* **schemas:** add min count schema ([c663c3a](https://github.com/schemaland/schema.js/commit/c663c3a5c5cde42f0f1689f713b1e90abedba480))
* **utils:** add prefix to stringified bigint value ([7b6979c](https://github.com/schemaland/schema.js/commit/7b6979c53638939d130894bd7d1ff0e5e07895af))

# [1.0.0-beta.4](https://github.com/schemaland/schema.js/compare/1.0.0-beta.3...1.0.0-beta.4) (2022-08-24)


### Bug Fixes

* **schemas:** add past assertion to new instance ([7cd1053](https://github.com/schemaland/schema.js/commit/7cd105308d1dadd9aa4925e53a1dfd8d4fc564c4))


### Features

* **schemas:** add string email schema ([9c16de3](https://github.com/schemaland/schema.js/commit/9c16de3c2207bae4900502db289856901f8863ce))
* **types:** add `InferSchema` that infer data types from schema ([2618b5d](https://github.com/schemaland/schema.js/commit/2618b5dcad943c59a41c7002fac059fb6af81328))

# [1.0.0-beta.3](https://github.com/schemaland/schema.js/compare/1.0.0-beta.2...1.0.0-beta.3) (2022-08-23)


### Bug Fixes

* **schemas:** add schema assertion via and method ([3b3bcb6](https://github.com/schemaland/schema.js/commit/3b3bcb6cb00a3ed11f41d5ab27d699a26ebfd6b8))
* **schemas:** return new instance on call `and` method ([ace07c5](https://github.com/schemaland/schema.js/commit/ace07c519ec4c690ff976ff5bef4bed77c583658))

# [1.0.0-beta.2](https://github.com/schemaland/schema.js/compare/1.0.0-beta.1...1.0.0-beta.2) (2022-08-23)


### Bug Fixes

* **schemas:** fix to operators type infer ([7fbab60](https://github.com/schemaland/schema.js/commit/7fbab60829a1f60dc4586516ef8b92b1ff117acf))


### Features

* **asserts:** add string length assertion ([01067d2](https://github.com/schemaland/schema.js/commit/01067d280842371bd1d099433b135cbb0eead704))
* change definition of schema ([294c0be](https://github.com/schemaland/schema.js/commit/294c0be197ef295ce93452ff0df2bd4efe77351e))
* **mod:** export `TupleSchema` schema ([b8ba80e](https://github.com/schemaland/schema.js/commit/b8ba80e8a20256d3716a9f26661c47998d590d5c))
* **schemas:** add string sub-type schemas ([603d557](https://github.com/schemaland/schema.js/commit/603d557922ca780bdc2bff84841f73a8df177565))
* **schemas:** add tuple schema ([50276d6](https://github.com/schemaland/schema.js/commit/50276d61d57f7fec7010ae9d9b527b2573e594cf))

# 1.0.0-beta.1 (2022-08-22)


### Features

* **asserts:** add assertion for `Array` object ([ee259a6](https://github.com/schemaland/schema.js/commit/ee259a6fc24308267f810eb3327d96fe8f7a4dad))
* **asserts:** add JavaScript data type assertion ([1033296](https://github.com/schemaland/schema.js/commit/10332960ef75dd189bd5d44f9fb50df29520fddc))
* **asserts:** add schema assertion function ([c92beda](https://github.com/schemaland/schema.js/commit/c92beda10beb88a05816387a2084342bf3196eee))
* **errors:** add assertion error ([e6194e3](https://github.com/schemaland/schema.js/commit/e6194e34053fd04b4156b02b4f52a59b64d9b094))
* **errors:** add Base error class ([f06213b](https://github.com/schemaland/schema.js/commit/f06213baf187f2755976ea9e8aa0a385025f7f07))
* **errors:** improve default error message ([a927689](https://github.com/schemaland/schema.js/commit/a927689387a03baf3dc3d11c953e81a9cc72945b))
* **mod:** export `assertArray` function ([6b3e8b4](https://github.com/schemaland/schema.js/commit/6b3e8b44b15bcd120164e9cf17d3ca7615847fc3))
* **mod:** export modules globaly ([ad4e8a7](https://github.com/schemaland/schema.js/commit/ad4e8a777d6fce6afc952959bbd1c554d4609f91))
* **operations:** improve narrowing scaler types ([8cbc4ff](https://github.com/schemaland/schema.js/commit/8cbc4ffa3d5349c2d66d93b6c7ba06236683cdb6))
* **operators:** add AND logical operation for schema ([fbc2b35](https://github.com/schemaland/schema.js/commit/fbc2b35979dc06cc358b2411654d2d5ea8e29933))
* **operators:** add logical `OR` and `AND` operation for schema ([9c7425f](https://github.com/schemaland/schema.js/commit/9c7425f204675834673fa50f2c76acac45482fa6))
* **operators:** add NOT logical operation for schema ([3389149](https://github.com/schemaland/schema.js/commit/33891495873c00d0fc75e1af30e005fdd0c43a09))
* **schemas:** add `and` method to subtype schemas ([a714f9c](https://github.com/schemaland/schema.js/commit/a714f9ca2dfd2962c6a3726944a9136e943aba99))
* **schemas:** add basic JavaScript scalers schema ([141bafa](https://github.com/schemaland/schema.js/commit/141bafa143ae663a6c94f3bf37620c0937182206))
* **schemas:** add built in `Array` object schema ([c8897de](https://github.com/schemaland/schema.js/commit/c8897de529d4b55d46d289905404cdf55f46d1e2))
* **schemas:** add JavaScript object schemas ([6cf0640](https://github.com/schemaland/schema.js/commit/6cf0640e932d4dbfe57c435939fb25e304a329da))
* **schemas:** add single field check to array schema ([0844ef3](https://github.com/schemaland/schema.js/commit/0844ef33b841c15f9d4977c03ca29696124555c8))
* **types:** add shared types ([2c01f1a](https://github.com/schemaland/schema.js/commit/2c01f1afaf47e4e0b1112298b6700b40cef971f7))
