/* eslint-disable */
export default async () => {
    const t = {
        ['./modules/identity/authentication/dto/Account.dto']: await import(
            './modules/identity/authentication/dto/Account.dto'
        ),
        ['./modules/identity/account/entities/BaseAccountEntity']: await import(
            './modules/identity/account/entities/BaseAccountEntity'
        ),
        ['./modules/identity/authentication/types/ManagedAccountProvider']:
            await import(
                './modules/identity/authentication/types/ManagedAccountProvider'
            ),
        ['./modules/journal/author/entities/Author.entity']: await import(
            './modules/journal/author/entities/Author.entity'
        ),
        ['./modules/journal/daily/entities/Daily.entity']: await import(
            './modules/journal/daily/entities/Daily.entity'
        ),
        ['./common/pagination/dto/PageMeta.dto']: await import(
            './common/pagination/dto/PageMeta.dto'
        ),
        ['./common/pagination/types/Order']: await import(
            './common/pagination/types/Order'
        ),
        ['./modules/journal/daily/dto/Daily.dto']: await import(
            './modules/journal/daily/dto/Daily.dto'
        ),
    };
    return {
        '@nestjs/swagger': {
            models: [
                [
                    import('./common/events/entities/InboxEvent.entity'),
                    {
                        InboxEventEntity: {
                            id: { required: true, type: () => String },
                            topic: { required: true, type: () => String },
                            payload: { required: true },
                            attempts: { required: true, type: () => Number },
                            createdAt: { required: true, type: () => Date },
                            receivedAt: { required: true, type: () => Date },
                            processedAt: {
                                required: true,
                                type: () => Date,
                                nullable: true,
                            },
                        },
                    },
                ],
                [
                    import('./common/events/entities/OutboxEvent.entity'),
                    {
                        OutboxEventEntity: {
                            id: { required: true, type: () => String },
                            topic: { required: true, type: () => String },
                            payload: { required: true },
                            attempts: { required: true, type: () => Number },
                            createdAt: { required: true, type: () => Date },
                            processedAt: {
                                required: true,
                                type: () => Date,
                                nullable: true,
                            },
                        },
                    },
                ],
                [
                    import('./modules/identity/authentication/dto/Account.dto'),
                    {
                        AccountDto: {
                            email: {
                                required: true,
                                type: () => String,
                                format: 'email',
                            },
                            id: { required: true, type: () => String },
                            providerId: { required: true, type: () => String },
                            providerAccountId: {
                                required: true,
                                type: () => String,
                            },
                        },
                    },
                ],
                [
                    import(
                        './modules/identity/authentication/dto/AuthenticationResult.dto'
                    ),
                    {
                        AuthenticationResultDto: {
                            account: {
                                required: true,
                                type: () =>
                                    t[
                                        './modules/identity/authentication/dto/Account.dto'
                                    ].AccountDto,
                            },
                            accessToken: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./modules/identity/authentication/dto/Login.dto'),
                    {
                        LoginDto: {
                            email: {
                                required: true,
                                type: () => String,
                                format: 'email',
                            },
                            password: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import(
                        './modules/identity/authentication/dto/RegisterWithCredentials.dto'
                    ),
                    {
                        RegisterWithCredentialsDto: {
                            email: {
                                required: true,
                                type: () => String,
                                format: 'email',
                            },
                            password: { required: true, type: () => String },
                            lastName: {
                                required: true,
                                type: () => String,
                                pattern: 'USER_NAME_REGEX',
                            },
                            firstName: {
                                required: true,
                                type: () => String,
                                pattern: 'USER_NAME_REGEX',
                            },
                            hasAcceptedTermsAndConditions: {
                                required: true,
                                type: () => Boolean,
                            },
                        },
                    },
                ],
                [
                    import(
                        './modules/identity/account/dto/RedeemActivationToken.dto'
                    ),
                    {
                        RedeemActivationTokenDto: {
                            activationToken: {
                                required: true,
                                type: () => String,
                            },
                        },
                    },
                ],
                [
                    import(
                        './modules/identity/account/dto/RequestActivationToken.dto'
                    ),
                    {
                        RequestActivationTokenDto: {
                            email: {
                                required: true,
                                type: () => String,
                                format: 'email',
                            },
                        },
                    },
                ],
                [
                    import(
                        './modules/identity/account/dto/RequestPasswordReset.dto'
                    ),
                    {
                        RequestPasswordResetDto: {
                            email: {
                                required: true,
                                type: () => String,
                                format: 'email',
                            },
                        },
                    },
                ],
                [
                    import('./modules/identity/account/dto/UpdatePassword.dto'),
                    {
                        UpdatePasswordDto: {
                            passwordChangeToken: {
                                required: true,
                                type: () => String,
                            },
                            password: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import(
                        './modules/identity/authentication/entities/RefreshToken.entity'
                    ),
                    {
                        RefreshTokenEntity: {
                            id: { required: true, type: () => String },
                            hashedValue: { required: true, type: () => String },
                            expiresAt: { required: true, type: () => Date },
                            createdAt: { required: true, type: () => Date },
                            invalidatedAt: {
                                required: true,
                                type: () => Date,
                                nullable: true,
                            },
                            owner: {
                                required: true,
                                type: () =>
                                    t[
                                        './modules/identity/account/entities/BaseAccountEntity'
                                    ].BaseAccountEntity,
                            },
                        },
                    },
                ],
                [
                    import(
                        './modules/identity/authentication/dto/ExternalIdentity.dto'
                    ),
                    {
                        ExternalIdentityDto: {
                            firstName: { required: true, type: () => String },
                            lastName: { required: true, type: () => String },
                            email: {
                                required: true,
                                type: () => String,
                                format: 'email',
                            },
                            id: { required: true, type: () => String },
                            providerId: {
                                required: true,
                                type: () => String,
                                enum: t[
                                    './modules/identity/authentication/types/ManagedAccountProvider'
                                ].FederatedAccountProvider,
                            },
                        },
                    },
                ],
                [
                    import(
                        './modules/identity/authentication/dto/OIDCRedirectResponse.dto'
                    ),
                    {
                        OIDCRedirectResponseDto: {
                            url: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import(
                        './modules/identity/authentication/dto/RegisterViaOIDC.dto'
                    ),
                    {
                        RegisterViaOIDCDto: {
                            hasAcceptedTermsAndConditions: {
                                required: true,
                                type: () => Boolean,
                            },
                        },
                    },
                ],
                [
                    import('./modules/journal/daily/entities/Daily.entity'),
                    {
                        DailyEntity: {
                            id: { required: true, type: () => String },
                            date: { required: true, type: () => String },
                            createdAt: { required: true, type: () => Date },
                            updatedAt: { required: true, type: () => Date },
                            deletedAt: {
                                required: true,
                                type: () => Date,
                                nullable: true,
                            },
                            author: {
                                required: true,
                                type: () =>
                                    t[
                                        './modules/journal/author/entities/Author.entity'
                                    ].AuthorEntity,
                            },
                            authorId: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./modules/journal/author/entities/Author.entity'),
                    {
                        AuthorEntity: {
                            id: { required: true, type: () => String },
                            dailies: {
                                required: true,
                                type: () => [
                                    t[
                                        './modules/journal/daily/entities/Daily.entity'
                                    ].DailyEntity,
                                ],
                            },
                            createdAt: { required: true, type: () => Date },
                            updatedAt: { required: true, type: () => Date },
                        },
                    },
                ],
                [
                    import('./common/dto/UUID.dto'),
                    { UUIDDto: { id: { required: true, type: () => String } } },
                ],
                [
                    import('./common/pagination/dto/PageMeta.dto'),
                    {
                        PageMetaDto: {
                            page: { required: true, type: () => Number },
                            take: { required: true, type: () => Number },
                            itemCount: { required: true, type: () => Number },
                            pageCount: { required: true, type: () => Number },
                            hasPreviousPage: {
                                required: true,
                                type: () => Boolean,
                            },
                            hasNextPage: {
                                required: true,
                                type: () => Boolean,
                            },
                        },
                    },
                ],
                [
                    import('./common/pagination/dto/Page.dto'),
                    {
                        PageDto: {
                            data: { required: true },
                            meta: {
                                required: true,
                                type: () =>
                                    t['./common/pagination/dto/PageMeta.dto']
                                        .PageMetaDto,
                            },
                        },
                    },
                ],
                [
                    import('./common/pagination/dto/PageOptions.dto'),
                    {
                        PageOptionsDto: {
                            order: {
                                required: true,
                                enum: t['./common/pagination/types/Order']
                                    .Order,
                            },
                            page: {
                                required: true,
                                type: () => Number,
                                default: 1,
                                minimum: 1,
                            },
                            take: {
                                required: true,
                                type: () => Number,
                                default: 20,
                                minimum: 1,
                                maximum: 100,
                            },
                        },
                    },
                ],
                [
                    import(
                        './modules/journal/daily/dto/CreateDailyRequest.dto'
                    ),
                    {
                        CreateDailyRequestDto: {
                            date: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./modules/journal/daily/dto/Daily.dto'),
                    {
                        DailyDto: {
                            id: { required: true, type: () => String },
                            authorId: { required: true, type: () => String },
                            date: { required: true, type: () => String },
                            createdAt: { required: true, type: () => String },
                            updatedAt: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import(
                        './modules/journal/daily/dto/FindDailiesByDateRangeQuery.dto'
                    ),
                    {
                        FindDailiesByDateRangeQueryDto: {
                            from: { required: true, type: () => String },
                            to: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import(
                        './modules/journal/daily/dto/UpdateDailyDateRequest.dto'
                    ),
                    {
                        UpdateDailyDateRequestDto: {
                            date: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./modules/users/dto/User.dto'),
                    {
                        UserDto: {
                            id: { required: true, type: () => String },
                            email: { required: true, type: () => String },
                            firstName: { required: true, type: () => String },
                            lastName: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./modules/users/entities/User.entity'),
                    {
                        UserEntity: {
                            id: { required: true, type: () => String },
                            email: { required: true, type: () => String },
                            lastName: { required: true, type: () => String },
                            firstName: { required: true, type: () => String },
                            isActivated: {
                                required: true,
                                type: () => Boolean,
                            },
                            createdAt: { required: true, type: () => Date },
                            updatedAt: { required: true, type: () => Date },
                        },
                    },
                ],
            ],
            controllers: [
                [
                    import(
                        './modules/identity/authentication/controllers/Authentication.controller'
                    ),
                    {
                        AuthenticationController: {
                            registerWithCredentials: {},
                            login: {},
                            refresh: {},
                            logout: {},
                        },
                    },
                ],
                [
                    import(
                        './modules/identity/account/controllers/Account.controller'
                    ),
                    {
                        AccountController: {
                            requestPasswordChange: {},
                            updatePassword: {},
                            redeemActivationToken: {},
                            requestActivationToken: {},
                        },
                    },
                ],
                [
                    import(
                        './modules/identity/authentication/controllers/OpenIDConnect.controller'
                    ),
                    {
                        OpenIDConnectController: {
                            login: {},
                            loginCallback: {},
                            registerWithOIDC: {},
                        },
                    },
                ],
                [
                    import(
                        './modules/journal/daily/controllers/Daily.controller'
                    ),
                    {
                        DailyController: {
                            getDailies: {},
                            getDailyById: {
                                type: t['./modules/journal/daily/dto/Daily.dto']
                                    .DailyDto,
                            },
                            createDaily: { type: Object },
                            updateDaily: {
                                type: t['./modules/journal/daily/dto/Daily.dto']
                                    .DailyDto,
                            },
                            deleteDaily: {},
                        },
                    },
                ],
                [
                    import('./modules/users/controllers/User.controller'),
                    { UserController: { getMyself: { type: Object } } },
                ],
            ],
        },
    };
};
