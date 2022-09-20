## Integration Test Setup

Make sure a `.env` file is created in the root folder.

```
IMJS_BUDDI_RESOLVE_URL_USING_REGION="{region_code_here}"
IMJS_AUTH_AUTHORITY="{ims_authority_url_here}"
IMJS_URL_PREFIX="qa-"
IMJS_OIDC_AUTHING_BROWSER_TEST_AUTHORITY="{ims_oidc_authority_url_here}"
IMJS_OIDC_BROWSER_TEST_CLIENT_ID="spa-B9Y8pYnRiSJLDPbRcB2IJJBQO"
IMJS_OIDC_BROWSER_TEST_REDIRECT_URI="http://localhost:3000/signin-callback"
IMJS_OIDC_BROWSER_TEST_SCOPES="itwins:read itwins:modify"
IMJS_OIDC_AUTHING_BROWSER_TEST_SCOPES="itwins:read itwins:modify"
IMJS_TEST_REGULAR_USER_NAME="{test_user_account_here}"
IMJS_TEST_REGULAR_USER_PASSWORD="{test_user_account_password_here}"
IMJS_TEST_REGULAR_USER_ID="{test_user_id_here}"
IMJS_TEST_ASSET_ID="{asset_id_here}"
IMJS_TEST_PROJECT_ID="{project_id_here}"
IMJS_TEST_IMODEL_ID="{imodel_id_here}"
IMJS_TEST_PERMANENT_ROLE_ID1="{first_role_id_here}"
IMJS_TEST_PERMANENT_ROLE_NAME1="Access Control Typescript Client Integration Test Role 1"
IMJS_TEST_PERMANENT_ROLE_ID2="{second_role_id_here}"
IMJS_TEST_PERMANENT_ROLE_NAME2="Access Control Typescript Client Integration Test Role 2"
IMJS_TEST_TEMP_USER_EMAIL="{temp_user_email_here}"
IMJS_TEST_TEMP_USER_ID="{temp_user_id_here}"
```

Run the following npm commands from the root folder in order.

```
npm i
npm run build
npm run test
```

`npm run test` runs a script defined in `package.json`.
