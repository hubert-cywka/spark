# Setting up your environment

## Prerequisites
This guide assumes you're using the **Chocolatey** package manager.

### PowerShell
**pwsh** is required to run other setup scripts.
To install, run: `choco install pwsh`

## Step-by-step guide
1.  Run the `pwsh ./setup-env-vars.ps1` script from the repository's root directory.
2.  Update the newly created `*.env` and `*.tfvars` files (e.g. `infrastructure/docker/.env` - the script will log 
    all paths to created files):
    1.  **Google OIDC** - if you plan to use [Google OIDC](https://developers.google.com/identity/openid-connect/openid-connect?hl=pl), you'll need to set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Ensure your [redirect URL](https://developers.google.com/identity/openid-connect/openid-connect?hl=pl#setredirecturi) matches the value of `GOOGLE_OIDC_REDIRECT_URL`.
    2.  **Mailing service** - for mailing services (currently, only [Resend](https://resend.com/emails) is supported; 
        generic SMTP client has been deprecated), update `MAIL_SENDER_PASSWORD` (for Resend, this is your API token) 
        and `MAIL_SENDER_NAME` (the email address recipients will see). If `MAIL_DEBUG_MODE` is set `true`, no 
        emails will be sent, and their payload will be logged in the application's console instead. If you don't 
        want to configure Resend, you can simply set `MAIL_DEBUG_MODE` to `true`.
    3. **S3** - TODO: update docs.
3. Follow [the local development guide](./local-development.md).
