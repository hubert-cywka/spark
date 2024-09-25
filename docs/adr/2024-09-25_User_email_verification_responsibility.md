# User email verification responsibility

## Context

In the project, we have two microservices responsible for different user-related functionalities:
- **Authentication**: Manages registration, login, access tokens, and refresh tokens.
- **Users**: Manages user information, such as personal data and preferences.

A question arose about which microservice should be responsible for the email verification process during user registration.

## Decision

It was decided that the email verification process would be managed by the **Authentication** microservice.

### Reasons
1. **Direct dependency on the registration and login process**: Email verification is closely related to user registration and identity confirmation, which is a core function of the Authentication microservice.
2. **Security**: Email verification is a crucial step in confirming the user's identity and activating the account, which is significant for authentication processes.
3. **Separation of concerns**: Authentication handles all operations related to registration and authentication, while the Users microservice is responsible for managing user data, allowing a clear division of responsibilities.

## Consequences

- The **Authentication** microservice will be responsible for generating and sending verification links (delegating email sending to another service) and validating those links.
- The **Users** microservice will store information about the email verification status but will not handle the verification process itself.

## Alternatives considered

1. **Delegating email verification to the Users microservice**:
    - **Rejected**, as this service doesn't need to know anything about the account creation process.

## Date

Decision date: `2024.09.25`

## Authors

Decision authors: Hubert Cywka
