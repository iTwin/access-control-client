## Integration Test Setup

Make sure an `.env` file is created in the root folder. The following are the keys without the values:

```
IMJS_AUTH_AUTHORITY=""
IMJS_URL_PREFIX=""
IMJS_OIDC_AUTHING_BROWSER_TEST_AUTHORITY=""
IMJS_OIDC_BROWSER_TEST_CLIENT_ID=""
IMJS_OIDC_BROWSER_TEST_REDIRECT_URI=""
IMJS_OIDC_BROWSER_TEST_SCOPES=""
IMJS_OIDC_AUTHING_BROWSER_TEST_SCOPES=""
IMJS_TEST_REGULAR_USER_NAME=""
IMJS_TEST_REGULAR_USER_PASSWORD=""
IMJS_TEST_REGULAR_USER_ID=""
IMJS_TEST_ASSET_ID=""
IMJS_TEST_PROJECT_ID=""
IMJS_TEST_IMODEL_ID=""
IMJS_TEST_PERMANENT_ROLE_ID1=""
IMJS_TEST_PERMANENT_ROLE_NAME1=""
IMJS_TEST_PERMANENT_ROLE_ID2=""
IMJS_TEST_PERMANENT_ROLE_NAME2=""
IMJS_TEST_TEMP_USER_EMAIL=""
IMJS_TEST_TEMP_USER_ID=""
```

Run the following npm commands from the root folder in order.

```
pnpm install
pnpm build
pnpm test
```

`pnpm test` runs a script defined in `package.json`.
