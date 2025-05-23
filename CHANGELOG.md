# Change Log - @itwin/access-control-client

<!-- This log was last generated on Thu, 15 May 2025 14:36:59 GMT and should not be manually modified. -->

<!-- Start content -->

## 3.4.0

Thu, 15 May 2025 14:36:59 GMT

### Minor changes

- Adding optional `customMessage` param to the `addITwinUserMembersAsync` function. ([commit](https://github.com/iTwin/access-control-client/commit/470d52c12eaf310f6d73aa356f49996703e0c29a))

## 3.3.0

- Adding `deleteITwinMemberInvitationAsync` method to the `MemberInvitationsClient`.

## 3.2.0

- Adding iTwin jobs client

## 3.1.0

- Add headers to the API response object

## 3.0.2

- Upgrading axios version to ^1.7.4

## 3.0.0

- **Breaking** Adjusting add user & add owner schemas to include invitations
- **Breaking** Adjusting add user member and add group member schemas to support multiple roleIds
- Adding member invitations client

## 2.3.1

- Upgrading axios version to ^1.6.1

## 2.2.0

- Added owner member client

## 2.1.0

- Changed the `users` property to `members` on the `Groups` object.
  - `members` property now accepts a `GroupUser[]` object instead of a `string[]`

## 2.0.0

- Added groups client
- Added group member client
- Added user member client
- Removed members client

## 1.3.0

- Added support for the `accept` header inside of `BaseClient`.

## 1.2.0

- Return newly added members.

## 1.1.1

- Fixed custom url bug.

## 1.1.0

- Added constructor parameter to AccessControlClient for custom url.

## 1.0.0

- Intial commit.
