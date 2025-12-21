"use strict";

customElements.define(
    "compodoc-menu",
    class extends HTMLElement {
        constructor() {
            super();
            this.isNormalMode = this.getAttribute("mode") === "normal";
        }

        connectedCallback() {
            this.render(this.isNormalMode);
        }

        render(isNormalMode) {
            let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">codename-backend documentation</a>
                </li>

                <li class="divider"></li>
                ${isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : ""}
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${
                                isNormalMode ? 'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"'
                            }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"'}>
                            <li class="link">
                                <a href="modules/AccountModule.html" data-type="entity-link" >AccountModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                            isNormalMode
                                                ? 'data-bs-target="#controllers-links-module-AccountModule-9abb26abb6be7783eb62d9d9a4417b1928b49beaace3e5c43dfd40edc9aae1b469d40890c3b9c16e46a9158a4931ba2ddcf549afe2b73b73c2652af0c75b22aa"'
                                                : 'data-bs-target="#xs-controllers-links-module-AccountModule-9abb26abb6be7783eb62d9d9a4417b1928b49beaace3e5c43dfd40edc9aae1b469d40890c3b9c16e46a9158a4931ba2ddcf549afe2b73b73c2652af0c75b22aa"'
                                        }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${
                                            isNormalMode
                                                ? 'id="controllers-links-module-AccountModule-9abb26abb6be7783eb62d9d9a4417b1928b49beaace3e5c43dfd40edc9aae1b469d40890c3b9c16e46a9158a4931ba2ddcf549afe2b73b73c2652af0c75b22aa"'
                                                : 'id="xs-controllers-links-module-AccountModule-9abb26abb6be7783eb62d9d9a4417b1928b49beaace3e5c43dfd40edc9aae1b469d40890c3b9c16e46a9158a4931ba2ddcf549afe2b73b73c2652af0c75b22aa"'
                                        }>
                                            <li class="link">
                                                <a href="controllers/AccountController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                        isNormalMode
                                            ? 'data-bs-target="#injectables-links-module-AccountModule-9abb26abb6be7783eb62d9d9a4417b1928b49beaace3e5c43dfd40edc9aae1b469d40890c3b9c16e46a9158a4931ba2ddcf549afe2b73b73c2652af0c75b22aa"'
                                            : 'data-bs-target="#xs-injectables-links-module-AccountModule-9abb26abb6be7783eb62d9d9a4417b1928b49beaace3e5c43dfd40edc9aae1b469d40890c3b9c16e46a9158a4931ba2ddcf549afe2b73b73c2652af0c75b22aa"'
                                    }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${
                                        isNormalMode
                                            ? 'id="injectables-links-module-AccountModule-9abb26abb6be7783eb62d9d9a4417b1928b49beaace3e5c43dfd40edc9aae1b469d40890c3b9c16e46a9158a4931ba2ddcf549afe2b73b73c2652af0c75b22aa"'
                                            : 'id="xs-injectables-links-module-AccountModule-9abb26abb6be7783eb62d9d9a4417b1928b49beaace3e5c43dfd40edc9aae1b469d40890c3b9c16e46a9158a4931ba2ddcf549afe2b73b73c2652af0c75b22aa"'
                                    }>
                                        <li class="link">
                                            <a href="injectables/AccountRemovalRequestedEventHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountRemovalRequestedEventHandler</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AccountRemovedEventHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountRemovedEventHandler</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AlertsModule.html" data-type="entity-link" >AlertsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                            isNormalMode
                                                ? 'data-bs-target="#controllers-links-module-AlertsModule-5e70dc7c9f809244e258adcc0fe1287d2d27abad9e1bc7ea574576819be647472dd25c4a314f627bb31c80f0a208457736092be1cda0eb6384fe5bd394f8a9e0"'
                                                : 'data-bs-target="#xs-controllers-links-module-AlertsModule-5e70dc7c9f809244e258adcc0fe1287d2d27abad9e1bc7ea574576819be647472dd25c4a314f627bb31c80f0a208457736092be1cda0eb6384fe5bd394f8a9e0"'
                                        }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${
                                            isNormalMode
                                                ? 'id="controllers-links-module-AlertsModule-5e70dc7c9f809244e258adcc0fe1287d2d27abad9e1bc7ea574576819be647472dd25c4a314f627bb31c80f0a208457736092be1cda0eb6384fe5bd394f8a9e0"'
                                                : 'id="xs-controllers-links-module-AlertsModule-5e70dc7c9f809244e258adcc0fe1287d2d27abad9e1bc7ea574576819be647472dd25c4a314f627bb31c80f0a208457736092be1cda0eb6384fe5bd394f8a9e0"'
                                        }>
                                            <li class="link">
                                                <a href="controllers/AlertsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AlertsController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                        isNormalMode
                                            ? 'data-bs-target="#injectables-links-module-AppModule-f7008108f96c873536bfbdd654d886674ee81387cdd40735e2e4084875411b4b7517519d13bb98bbcdcc3508856354452cd4d389022af3dec6b9dbf6d5eb4a6d"'
                                            : 'data-bs-target="#xs-injectables-links-module-AppModule-f7008108f96c873536bfbdd654d886674ee81387cdd40735e2e4084875411b4b7517519d13bb98bbcdcc3508856354452cd4d389022af3dec6b9dbf6d5eb4a6d"'
                                    }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${
                                        isNormalMode
                                            ? 'id="injectables-links-module-AppModule-f7008108f96c873536bfbdd654d886674ee81387cdd40735e2e4084875411b4b7517519d13bb98bbcdcc3508856354452cd4d389022af3dec6b9dbf6d5eb4a6d"'
                                            : 'id="xs-injectables-links-module-AppModule-f7008108f96c873536bfbdd654d886674ee81387cdd40735e2e4084875411b4b7517519d13bb98bbcdcc3508856354452cd4d389022af3dec6b9dbf6d5eb4a6d"'
                                    }>
                                        <li class="link">
                                            <a href="injectables/AccessTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccessTokenStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthenticationModule.html" data-type="entity-link" >AuthenticationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                            isNormalMode
                                                ? 'data-bs-target="#controllers-links-module-AuthenticationModule-a1b19f70b9950f1b5b0f565ce6abffc968f252d0133d051ac13b5acbe7bb04f9836b45572cf7fa7f9ba04fa8401699263853a3234f032c4f13e1ce32a57d9748"'
                                                : 'data-bs-target="#xs-controllers-links-module-AuthenticationModule-a1b19f70b9950f1b5b0f565ce6abffc968f252d0133d051ac13b5acbe7bb04f9836b45572cf7fa7f9ba04fa8401699263853a3234f032c4f13e1ce32a57d9748"'
                                        }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${
                                            isNormalMode
                                                ? 'id="controllers-links-module-AuthenticationModule-a1b19f70b9950f1b5b0f565ce6abffc968f252d0133d051ac13b5acbe7bb04f9836b45572cf7fa7f9ba04fa8401699263853a3234f032c4f13e1ce32a57d9748"'
                                                : 'id="xs-controllers-links-module-AuthenticationModule-a1b19f70b9950f1b5b0f565ce6abffc968f252d0133d051ac13b5acbe7bb04f9836b45572cf7fa7f9ba04fa8401699263853a3234f032c4f13e1ce32a57d9748"'
                                        }>
                                            <li class="link">
                                                <a href="controllers/AccessScopesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccessScopesController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/AuthenticationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/OpenIDConnectController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OpenIDConnectController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                        isNormalMode
                                            ? 'data-bs-target="#injectables-links-module-AuthenticationModule-a1b19f70b9950f1b5b0f565ce6abffc968f252d0133d051ac13b5acbe7bb04f9836b45572cf7fa7f9ba04fa8401699263853a3234f032c4f13e1ce32a57d9748"'
                                            : 'data-bs-target="#xs-injectables-links-module-AuthenticationModule-a1b19f70b9950f1b5b0f565ce6abffc968f252d0133d051ac13b5acbe7bb04f9836b45572cf7fa7f9ba04fa8401699263853a3234f032c4f13e1ce32a57d9748"'
                                    }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${
                                        isNormalMode
                                            ? 'id="injectables-links-module-AuthenticationModule-a1b19f70b9950f1b5b0f565ce6abffc968f252d0133d051ac13b5acbe7bb04f9836b45572cf7fa7f9ba04fa8401699263853a3234f032c4f13e1ce32a57d9748"'
                                            : 'id="xs-injectables-links-module-AuthenticationModule-a1b19f70b9950f1b5b0f565ce6abffc968f252d0133d051ac13b5acbe7bb04f9836b45572cf7fa7f9ba04fa8401699263853a3234f032c4f13e1ce32a57d9748"'
                                    }>
                                        <li class="link">
                                            <a href="injectables/AccountPasswordUpdatedEventHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountPasswordUpdatedEventHandler</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AccountSuspendedEventHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountSuspendedEventHandler</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RefreshTokenInvalidationJobTriggeredEventHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RefreshTokenInvalidationJobTriggeredEventHandler</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthorsModule.html" data-type="entity-link" >AuthorsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                        isNormalMode
                                            ? 'data-bs-target="#injectables-links-module-AuthorsModule-ec649391b151f907f8233c647dfec4c37bcfab021b7635bc902b49febd1ec3018a34079ca9568086d2ea57151242ebc52715fff8a97bc8a5491b50c0b78fefe8"'
                                            : 'data-bs-target="#xs-injectables-links-module-AuthorsModule-ec649391b151f907f8233c647dfec4c37bcfab021b7635bc902b49febd1ec3018a34079ca9568086d2ea57151242ebc52715fff8a97bc8a5491b50c0b78fefe8"'
                                    }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${
                                        isNormalMode
                                            ? 'id="injectables-links-module-AuthorsModule-ec649391b151f907f8233c647dfec4c37bcfab021b7635bc902b49febd1ec3018a34079ca9568086d2ea57151242ebc52715fff8a97bc8a5491b50c0b78fefe8"'
                                            : 'id="xs-injectables-links-module-AuthorsModule-ec649391b151f907f8233c647dfec4c37bcfab021b7635bc902b49febd1ec3018a34079ca9568086d2ea57151242ebc52715fff8a97bc8a5491b50c0b78fefe8"'
                                    }>
                                        <li class="link">
                                            <a href="injectables/AccountCreatedEventHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountCreatedEventHandler</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthorRemovedEventHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthorRemovedEventHandler</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CacheModule.html" data-type="entity-link" >CacheModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigurationModule.html" data-type="entity-link" >ConfigurationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                            isNormalMode
                                                ? 'data-bs-target="#controllers-links-module-ConfigurationModule-6fcdaefd543d872e899466d490177d5b1b91fff8dd4360cd9c9b576bb42f9dd817513cf0a14a6cade5996f84af32a9e81c726d30754921d3b35342de588f9ca2"'
                                                : 'data-bs-target="#xs-controllers-links-module-ConfigurationModule-6fcdaefd543d872e899466d490177d5b1b91fff8dd4360cd9c9b576bb42f9dd817513cf0a14a6cade5996f84af32a9e81c726d30754921d3b35342de588f9ca2"'
                                        }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${
                                            isNormalMode
                                                ? 'id="controllers-links-module-ConfigurationModule-6fcdaefd543d872e899466d490177d5b1b91fff8dd4360cd9c9b576bb42f9dd817513cf0a14a6cade5996f84af32a9e81c726d30754921d3b35342de588f9ca2"'
                                                : 'id="xs-controllers-links-module-ConfigurationModule-6fcdaefd543d872e899466d490177d5b1b91fff8dd4360cd9c9b576bb42f9dd817513cf0a14a6cade5996f84af32a9e81c726d30754921d3b35342de588f9ca2"'
                                        }>
                                            <li class="link">
                                                <a href="controllers/FeatureFlagsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeatureFlagsController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DailyModule.html" data-type="entity-link" >DailyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                            isNormalMode
                                                ? 'data-bs-target="#controllers-links-module-DailyModule-a67f0f9c07506266c780510ef87a0d57c75dea9370ed81cab4b75a403e77821164feede73e5f85d8735ba9363c6b7d712bd3eef49b037c158f54c036af66ba00"'
                                                : 'data-bs-target="#xs-controllers-links-module-DailyModule-a67f0f9c07506266c780510ef87a0d57c75dea9370ed81cab4b75a403e77821164feede73e5f85d8735ba9363c6b7d712bd3eef49b037c158f54c036af66ba00"'
                                        }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${
                                            isNormalMode
                                                ? 'id="controllers-links-module-DailyModule-a67f0f9c07506266c780510ef87a0d57c75dea9370ed81cab4b75a403e77821164feede73e5f85d8735ba9363c6b7d712bd3eef49b037c158f54c036af66ba00"'
                                                : 'id="xs-controllers-links-module-DailyModule-a67f0f9c07506266c780510ef87a0d57c75dea9370ed81cab4b75a403e77821164feede73e5f85d8735ba9363c6b7d712bd3eef49b037c158f54c036af66ba00"'
                                        }>
                                            <li class="link">
                                                <a href="controllers/DailyController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DailyController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EntriesModule.html" data-type="entity-link" >EntriesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                            isNormalMode
                                                ? 'data-bs-target="#controllers-links-module-EntriesModule-88dceaa01a091224619b4e91a8127df56eb7db59a6d5291c89604458d583d53f3976e21740d0379f6c4ea9c76e2ead58a85402aa58ba0e72e649e4bdca89ff18"'
                                                : 'data-bs-target="#xs-controllers-links-module-EntriesModule-88dceaa01a091224619b4e91a8127df56eb7db59a6d5291c89604458d583d53f3976e21740d0379f6c4ea9c76e2ead58a85402aa58ba0e72e649e4bdca89ff18"'
                                        }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${
                                            isNormalMode
                                                ? 'id="controllers-links-module-EntriesModule-88dceaa01a091224619b4e91a8127df56eb7db59a6d5291c89604458d583d53f3976e21740d0379f6c4ea9c76e2ead58a85402aa58ba0e72e649e4bdca89ff18"'
                                                : 'id="xs-controllers-links-module-EntriesModule-88dceaa01a091224619b4e91a8127df56eb7db59a6d5291c89604458d583d53f3976e21740d0379f6c4ea9c76e2ead58a85402aa58ba0e72e649e4bdca89ff18"'
                                        }>
                                            <li class="link">
                                                <a href="controllers/DailyEntryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DailyEntryController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/EntryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EntryController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GdprModule.html" data-type="entity-link" >GdprModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GlobalModule.html" data-type="entity-link" >GlobalModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GoalsModule.html" data-type="entity-link" >GoalsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                            isNormalMode
                                                ? 'data-bs-target="#controllers-links-module-GoalsModule-11a7e27a84004032328b2e2fda0bc5f919e05c50743653175bf7aeb49d5c1731256f26e2e850a77cec74d1255e5209305169b46a90a0f3a239810963b5eb173e"'
                                                : 'data-bs-target="#xs-controllers-links-module-GoalsModule-11a7e27a84004032328b2e2fda0bc5f919e05c50743653175bf7aeb49d5c1731256f26e2e850a77cec74d1255e5209305169b46a90a0f3a239810963b5eb173e"'
                                        }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${
                                            isNormalMode
                                                ? 'id="controllers-links-module-GoalsModule-11a7e27a84004032328b2e2fda0bc5f919e05c50743653175bf7aeb49d5c1731256f26e2e850a77cec74d1255e5209305169b46a90a0f3a239810963b5eb173e"'
                                                : 'id="xs-controllers-links-module-GoalsModule-11a7e27a84004032328b2e2fda0bc5f919e05c50743653175bf7aeb49d5c1731256f26e2e850a77cec74d1255e5209305169b46a90a0f3a239810963b5eb173e"'
                                        }>
                                            <li class="link">
                                                <a href="controllers/GoalController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GoalController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/GoalEntryLinkController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GoalEntryLinkController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HealthCheckModule.html" data-type="entity-link" >HealthCheckModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                            isNormalMode
                                                ? 'data-bs-target="#controllers-links-module-HealthCheckModule-b4747e04c05d4c9ba5821eaed3a4063df92671fac6cbb18f1a9ede00d7bb0d9388b651b420f94d865d99c077949168a17a5e02319e86c1da892a7efb158c3735"'
                                                : 'data-bs-target="#xs-controllers-links-module-HealthCheckModule-b4747e04c05d4c9ba5821eaed3a4063df92671fac6cbb18f1a9ede00d7bb0d9388b651b420f94d865d99c077949168a17a5e02319e86c1da892a7efb158c3735"'
                                        }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${
                                            isNormalMode
                                                ? 'id="controllers-links-module-HealthCheckModule-b4747e04c05d4c9ba5821eaed3a4063df92671fac6cbb18f1a9ede00d7bb0d9388b651b420f94d865d99c077949168a17a5e02319e86c1da892a7efb158c3735"'
                                                : 'id="xs-controllers-links-module-HealthCheckModule-b4747e04c05d4c9ba5821eaed3a4063df92671fac6cbb18f1a9ede00d7bb0d9388b651b420f94d865d99c077949168a17a5e02319e86c1da892a7efb158c3735"'
                                        }>
                                            <li class="link">
                                                <a href="controllers/HealthCheckController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HealthCheckController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/IdentityModule.html" data-type="entity-link" >IdentityModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/IdentitySharedModule.html" data-type="entity-link" >IdentitySharedModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/IntegrationEventsModule.html" data-type="entity-link" >IntegrationEventsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/JournalModule.html" data-type="entity-link" >JournalModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/JournalSharedModule.html" data-type="entity-link" >JournalSharedModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/KafkaModule.html" data-type="entity-link" >KafkaModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link" >MailModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SchedulingModule.html" data-type="entity-link" >SchedulingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ServiceToServiceModule.html" data-type="entity-link" >ServiceToServiceModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TwoFactorAuthenticationModule.html" data-type="entity-link" >TwoFactorAuthenticationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                            isNormalMode
                                                ? 'data-bs-target="#controllers-links-module-TwoFactorAuthenticationModule-3f1ea1a3b9f39ded1d0bc5af8ab2b264d6362e5dca29990b24f230ec2ad13ad2deb831f45a2e61350d88940e6745ef6377e0f50725a4eb9bea4037814fc47932"'
                                                : 'data-bs-target="#xs-controllers-links-module-TwoFactorAuthenticationModule-3f1ea1a3b9f39ded1d0bc5af8ab2b264d6362e5dca29990b24f230ec2ad13ad2deb831f45a2e61350d88940e6745ef6377e0f50725a4eb9bea4037814fc47932"'
                                        }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${
                                            isNormalMode
                                                ? 'id="controllers-links-module-TwoFactorAuthenticationModule-3f1ea1a3b9f39ded1d0bc5af8ab2b264d6362e5dca29990b24f230ec2ad13ad2deb831f45a2e61350d88940e6745ef6377e0f50725a4eb9bea4037814fc47932"'
                                                : 'id="xs-controllers-links-module-TwoFactorAuthenticationModule-3f1ea1a3b9f39ded1d0bc5af8ab2b264d6362e5dca29990b24f230ec2ad13ad2deb831f45a2e61350d88940e6745ef6377e0f50725a4eb9bea4037814fc47932"'
                                        }>
                                            <li class="link">
                                                <a href="controllers/TwoFactorAuthenticationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TwoFactorAuthenticationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                        isNormalMode
                                            ? 'data-bs-target="#injectables-links-module-TwoFactorAuthenticationModule-3f1ea1a3b9f39ded1d0bc5af8ab2b264d6362e5dca29990b24f230ec2ad13ad2deb831f45a2e61350d88940e6745ef6377e0f50725a4eb9bea4037814fc47932"'
                                            : 'data-bs-target="#xs-injectables-links-module-TwoFactorAuthenticationModule-3f1ea1a3b9f39ded1d0bc5af8ab2b264d6362e5dca29990b24f230ec2ad13ad2deb831f45a2e61350d88940e6745ef6377e0f50725a4eb9bea4037814fc47932"'
                                    }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${
                                        isNormalMode
                                            ? 'id="injectables-links-module-TwoFactorAuthenticationModule-3f1ea1a3b9f39ded1d0bc5af8ab2b264d6362e5dca29990b24f230ec2ad13ad2deb831f45a2e61350d88940e6745ef6377e0f50725a4eb9bea4037814fc47932"'
                                            : 'id="xs-injectables-links-module-TwoFactorAuthenticationModule-3f1ea1a3b9f39ded1d0bc5af8ab2b264d6362e5dca29990b24f230ec2ad13ad2deb831f45a2e61350d88940e6745ef6377e0f50725a4eb9bea4037814fc47932"'
                                    }>
                                        <li class="link">
                                            <a href="injectables/AccountActivatedEventHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountActivatedEventHandler</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                            isNormalMode
                                                ? 'data-bs-target="#controllers-links-module-UsersModule-82beec3790b275cb2d38e4c435faedd93a5184214fd9dd22c7499e532a420a55b9c768cb8921fb34814fd1e96e40164825dff7d51a2d2af0d3041afdde9a4993"'
                                                : 'data-bs-target="#xs-controllers-links-module-UsersModule-82beec3790b275cb2d38e4c435faedd93a5184214fd9dd22c7499e532a420a55b9c768cb8921fb34814fd1e96e40164825dff7d51a2d2af0d3041afdde9a4993"'
                                        }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${
                                            isNormalMode
                                                ? 'id="controllers-links-module-UsersModule-82beec3790b275cb2d38e4c435faedd93a5184214fd9dd22c7499e532a420a55b9c768cb8921fb34814fd1e96e40164825dff7d51a2d2af0d3041afdde9a4993"'
                                                : 'id="xs-controllers-links-module-UsersModule-82beec3790b275cb2d38e4c435faedd93a5184214fd9dd22c7499e532a420a55b9c768cb8921fb34814fd1e96e40164825dff7d51a2d2af0d3041afdde9a4993"'
                                        }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                isNormalMode ? 'data-bs-target="#controllers-links"' : 'data-bs-target="#xs-controllers-links"'
                            }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"'}>
                                <li class="link">
                                    <a href="controllers/AccessScopesController.html" data-type="entity-link" >AccessScopesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AccountController.html" data-type="entity-link" >AccountController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AlertsController.html" data-type="entity-link" >AlertsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthenticationController.html" data-type="entity-link" >AuthenticationController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DailyController.html" data-type="entity-link" >DailyController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DailyEntryController.html" data-type="entity-link" >DailyEntryController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/EntryController.html" data-type="entity-link" >EntryController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/FeatureFlagsController.html" data-type="entity-link" >FeatureFlagsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/GoalController.html" data-type="entity-link" >GoalController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/GoalEntryLinkController.html" data-type="entity-link" >GoalEntryLinkController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/HealthCheckController.html" data-type="entity-link" >HealthCheckController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/OpenIDConnectController.html" data-type="entity-link" >OpenIDConnectController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TwoFactorAuthenticationController.html" data-type="entity-link" >TwoFactorAuthenticationController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                isNormalMode ? 'data-bs-target="#entities-links"' : 'data-bs-target="#xs-entities-links"'
                            }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"'}>
                                <li class="link">
                                    <a href="entities/AlertEntity.html" data-type="entity-link" >AlertEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/AuthorEntity.html" data-type="entity-link" >AuthorEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/BaseAccountEntity.html" data-type="entity-link" >BaseAccountEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DailyEntity.html" data-type="entity-link" >DailyEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DataPurgePlanEntity.html" data-type="entity-link" >DataPurgePlanEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/EntryEntity.html" data-type="entity-link" >EntryEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/FeatureFlagEntity.html" data-type="entity-link" >FeatureFlagEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/GoalEntity.html" data-type="entity-link" >GoalEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/InboxEventEntity.html" data-type="entity-link" >InboxEventEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/InboxEventPartitionEntity.html" data-type="entity-link" >InboxEventPartitionEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/JobExecutionEntity.html" data-type="entity-link" >JobExecutionEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/JobScheduleEntity.html" data-type="entity-link" >JobScheduleEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OutboxEventEntity.html" data-type="entity-link" >OutboxEventEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OutboxEventPartitionEntity.html" data-type="entity-link" >OutboxEventPartitionEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RecipientEntity.html" data-type="entity-link" >RecipientEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RecipientEntity-1.html" data-type="entity-link" >RecipientEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RefreshTokenEntity.html" data-type="entity-link" >RefreshTokenEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SingleUseTokenEntity.html" data-type="entity-link" >SingleUseTokenEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TenantEntity.html" data-type="entity-link" >TenantEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TenantEntity-1.html" data-type="entity-link" >TenantEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TwoFactorAuthenticationIntegrationEntity.html" data-type="entity-link" >TwoFactorAuthenticationIntegrationEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserEntity.html" data-type="entity-link" >UserEntity</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                            isNormalMode ? 'data-bs-target="#classes-links"' : 'data-bs-target="#xs-classes-links"'
                        }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"'}>
                            <li class="link">
                                <a href="classes/AccessScopesDto.html" data-type="entity-link" >AccessScopesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccessScopeUnavailableError.html" data-type="entity-link" >AccessScopeUnavailableError</a>
                            </li>
                            <li class="link">
                                <a href="classes/Account.html" data-type="entity-link" >Account</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountActivatedEvent.html" data-type="entity-link" >AccountActivatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountActivationTokenRequestedEvent.html" data-type="entity-link" >AccountActivationTokenRequestedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountAlreadyActivatedError.html" data-type="entity-link" >AccountAlreadyActivatedError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountAlreadyExistsError.html" data-type="entity-link" >AccountAlreadyExistsError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountCreatedEvent.html" data-type="entity-link" >AccountCreatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountDto.html" data-type="entity-link" >AccountDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountEventsPublisher.html" data-type="entity-link" >AccountEventsPublisher</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountMapper.html" data-type="entity-link" >AccountMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountModuleFacade.html" data-type="entity-link" >AccountModuleFacade</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountNotActivatedError.html" data-type="entity-link" >AccountNotActivatedError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountNotFoundError.html" data-type="entity-link" >AccountNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountPasswordUpdatedEvent.html" data-type="entity-link" >AccountPasswordUpdatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountRemovalCompletedEvent.html" data-type="entity-link" >AccountRemovalCompletedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountRemovalRequestedEvent.html" data-type="entity-link" >AccountRemovalRequestedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountRemovalScheduledEmail.html" data-type="entity-link" >AccountRemovalScheduledEmail</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountRemovalScheduledEvent.html" data-type="entity-link" >AccountRemovalScheduledEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountRequestedPasswordResetEvent.html" data-type="entity-link" >AccountRequestedPasswordResetEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountSuspendedError.html" data-type="entity-link" >AccountSuspendedError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountSuspendedEvent.html" data-type="entity-link" >AccountSuspendedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ActivateAccessScopesDto.html" data-type="entity-link" >ActivateAccessScopesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddFeatureFlagsTable1765020949930.html" data-type="entity-link" >AddFeatureFlagsTable1765020949930</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddIndicesToFfTable1765022076178.html" data-type="entity-link" >AddIndicesToFfTable1765022076178</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddTimestamps1752925853545.html" data-type="entity-link" >AddTimestamps1752925853545</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddTimestamps1752925879790.html" data-type="entity-link" >AddTimestamps1752925879790</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddTimestamps1752925904452.html" data-type="entity-link" >AddTimestamps1752925904452</a>
                            </li>
                            <li class="link">
                                <a href="classes/AesGcmEncryptionAlgorithm.html" data-type="entity-link" >AesGcmEncryptionAlgorithm</a>
                            </li>
                            <li class="link">
                                <a href="classes/AlertDto.html" data-type="entity-link" >AlertDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AlertEventsPublisher.html" data-type="entity-link" >AlertEventsPublisher</a>
                            </li>
                            <li class="link">
                                <a href="classes/AlertLimitReachedError.html" data-type="entity-link" >AlertLimitReachedError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AlertMapper.html" data-type="entity-link" >AlertMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/AlertNotFoundError.html" data-type="entity-link" >AlertNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnotherError.html" data-type="entity-link" >AnotherError</a>
                            </li>
                            <li class="link">
                                <a href="classes/Application.html" data-type="entity-link" >Application</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthenticationMapper.html" data-type="entity-link" >AuthenticationMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthenticationResultDto.html" data-type="entity-link" >AuthenticationResultDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthorAlreadyExistsError.html" data-type="entity-link" >AuthorAlreadyExistsError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthorDto.html" data-type="entity-link" >AuthorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthorMapper.html" data-type="entity-link" >AuthorMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthorNotFoundError.html" data-type="entity-link" >AuthorNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseAccountEntity.html" data-type="entity-link" >BaseAccountEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseModelDTOEntityMapper.html" data-type="entity-link" >BaseModelDTOEntityMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/CookieContentInvalidError.html" data-type="entity-link" >CookieContentInvalidError</a>
                            </li>
                            <li class="link">
                                <a href="classes/CookieSignatureInvalidError.html" data-type="entity-link" >CookieSignatureInvalidError</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAlertDto.html" data-type="entity-link" >CreateAlertDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateDailyDto.html" data-type="entity-link" >CreateDailyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEntryDto.html" data-type="entity-link" >CreateEntryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrUpdateGoalDto.html" data-type="entity-link" >CreateOrUpdateGoalDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomError.html" data-type="entity-link" >CustomError</a>
                            </li>
                            <li class="link">
                                <a href="classes/DailyActivityDto.html" data-type="entity-link" >DailyActivityDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DailyDto.html" data-type="entity-link" >DailyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DailyMapper.html" data-type="entity-link" >DailyMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/DailyMetricsDto.html" data-type="entity-link" >DailyMetricsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DailyNotFoundError.html" data-type="entity-link" >DailyNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/DailyRangeDto.html" data-type="entity-link" >DailyRangeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DailyReminderEmail.html" data-type="entity-link" >DailyReminderEmail</a>
                            </li>
                            <li class="link">
                                <a href="classes/DailyReminderTriggeredEvent.html" data-type="entity-link" >DailyReminderTriggeredEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/DistributedCache.html" data-type="entity-link" >DistributedCache</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailDeliveryError.html" data-type="entity-link" >EmailDeliveryError</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailIntegrationTOTPIssuedEvent.html" data-type="entity-link" >EmailIntegrationTOTPIssuedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnableApp2FADto.html" data-type="entity-link" >EnableApp2FADto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntityConflictError.html" data-type="entity-link" >EntityConflictError</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntityNotFoundError.html" data-type="entity-link" >EntityNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntriesInsightsProvider.html" data-type="entity-link" >EntriesInsightsProvider</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntriesMetricsDto.html" data-type="entity-link" >EntriesMetricsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntryDailyNotFoundError.html" data-type="entity-link" >EntryDailyNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntryDetailDto.html" data-type="entity-link" >EntryDetailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntryDetailMapper.html" data-type="entity-link" >EntryDetailMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntryDto.html" data-type="entity-link" >EntryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntryLoggingHistogramDayDto.html" data-type="entity-link" >EntryLoggingHistogramDayDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntryLoggingHistogramDto.html" data-type="entity-link" >EntryLoggingHistogramDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntryLoggingHistogramHourDto.html" data-type="entity-link" >EntryLoggingHistogramHourDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntryMapper.html" data-type="entity-link" >EntryMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntryNotFoundError.html" data-type="entity-link" >EntryNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntryService.html" data-type="entity-link" >EntryService</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventHandlersNotFoundError.html" data-type="entity-link" >EventHandlersNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventInboxProcessor.html" data-type="entity-link" >EventInboxProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventOutboxProcessor.html" data-type="entity-link" >EventOutboxProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExponentialRetryBackoffPolicy.html" data-type="entity-link" >ExponentialRetryBackoffPolicy</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExternalIdentityDto.html" data-type="entity-link" >ExternalIdentityDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeatureFlagDto.html" data-type="entity-link" >FeatureFlagDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeatureFlagEntity.html" data-type="entity-link" >FeatureFlagEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeatureFlagMapper.html" data-type="entity-link" >FeatureFlagMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeatureFlagsProvider.html" data-type="entity-link" >FeatureFlagsProvider</a>
                            </li>
                            <li class="link">
                                <a href="classes/FeatureFlagsStore.html" data-type="entity-link" >FeatureFlagsStore</a>
                            </li>
                            <li class="link">
                                <a href="classes/FederatedAccountEntity.html" data-type="entity-link" >FederatedAccountEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindDailyFiltersDto.html" data-type="entity-link" >FindDailyFiltersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindDailyMetricsDto.html" data-type="entity-link" >FindDailyMetricsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindEntriesFiltersDto.html" data-type="entity-link" >FindEntriesFiltersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindEntriesInsightsDto.html" data-type="entity-link" >FindEntriesInsightsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindEntryDetailsFiltersDto.html" data-type="entity-link" >FindEntryDetailsFiltersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindGoalsFiltersDto.html" data-type="entity-link" >FindGoalsFiltersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForbiddenError.html" data-type="entity-link" >ForbiddenError</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetFeatureFlagsDto.html" data-type="entity-link" >GetFeatureFlagsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GoalDto.html" data-type="entity-link" >GoalDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GoalEntryLinkNotFoundError.html" data-type="entity-link" >GoalEntryLinkNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/GoalEntryLinkService.html" data-type="entity-link" >GoalEntryLinkService</a>
                            </li>
                            <li class="link">
                                <a href="classes/GoalMapper.html" data-type="entity-link" >GoalMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/GoalNotFoundError.html" data-type="entity-link" >GoalNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/GoalOrEntryNotFoundError.html" data-type="entity-link" >GoalOrEntryNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/GoalService.html" data-type="entity-link" >GoalService</a>
                            </li>
                            <li class="link">
                                <a href="classes/HtmlEmail.html" data-type="entity-link" >HtmlEmail</a>
                            </li>
                            <li class="link">
                                <a href="classes/InboxAndOutbox1749299050551.html" data-type="entity-link" >InboxAndOutbox1749299050551</a>
                            </li>
                            <li class="link">
                                <a href="classes/InboxAndOutboxSequenceNumber1753291628862.html" data-type="entity-link" >InboxAndOutboxSequenceNumber1753291628862</a>
                            </li>
                            <li class="link">
                                <a href="classes/InboxAndOutboxSplitTopicAndSubject1753291628863.html" data-type="entity-link" >InboxAndOutboxSplitTopicAndSubject1753291628863</a>
                            </li>
                            <li class="link">
                                <a href="classes/InboxEventEntity.html" data-type="entity-link" >InboxEventEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/InboxEventPartitionEntity.html" data-type="entity-link" >InboxEventPartitionEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/InboxEventRepository.html" data-type="entity-link" >InboxEventRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/InboxPartitionRepository.html" data-type="entity-link" >InboxPartitionRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/InitConfigurationModule1765016363086.html" data-type="entity-link" >InitConfigurationModule1765016363086</a>
                            </li>
                            <li class="link">
                                <a href="classes/InitSchedulingModule1764101420518.html" data-type="entity-link" >InitSchedulingModule1764101420518</a>
                            </li>
                            <li class="link">
                                <a href="classes/InsufficientAccessError.html" data-type="entity-link" >InsufficientAccessError</a>
                            </li>
                            <li class="link">
                                <a href="classes/IntegrationAlreadyEnabledError.html" data-type="entity-link" >IntegrationAlreadyEnabledError</a>
                            </li>
                            <li class="link">
                                <a href="classes/IntegrationEvent.html" data-type="entity-link" >IntegrationEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/IntegrationEventEntity.html" data-type="entity-link" >IntegrationEventEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/IntegrationEventPartitionEntity.html" data-type="entity-link" >IntegrationEventPartitionEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/IntegrationEventRepository.html" data-type="entity-link" >IntegrationEventRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/IntegrationEventsJobsOrchestrator.html" data-type="entity-link" >IntegrationEventsJobsOrchestrator</a>
                            </li>
                            <li class="link">
                                <a href="classes/IntegrationMethodNotSupportedError.html" data-type="entity-link" >IntegrationMethodNotSupportedError</a>
                            </li>
                            <li class="link">
                                <a href="classes/IntegrationNotFoundError.html" data-type="entity-link" >IntegrationNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/IntervalJobScheduleUpdatedEvent.html" data-type="entity-link" >IntervalJobScheduleUpdatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidAccessTokenError.html" data-type="entity-link" >InvalidAccessTokenError</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidArgumentError.html" data-type="entity-link" >InvalidArgumentError</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidCredentialsError.html" data-type="entity-link" >InvalidCredentialsError</a>
                            </li>
                            <li class="link">
                                <a href="classes/JobTriggeredEvent.html" data-type="entity-link" >JobTriggeredEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/KafkaAdmin.html" data-type="entity-link" >KafkaAdmin</a>
                            </li>
                            <li class="link">
                                <a href="classes/KafkaLoggerAdapter.html" data-type="entity-link" >KafkaLoggerAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinearRetryBackoffPolicy.html" data-type="entity-link" >LinearRetryBackoffPolicy</a>
                            </li>
                            <li class="link">
                                <a href="classes/LinkEntryWithGoalDto.html" data-type="entity-link" >LinkEntryWithGoalDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogoutDto.html" data-type="entity-link" >LogoutDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ManagedAccountEntity.html" data-type="entity-link" >ManagedAccountEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/MissingCookieError.html" data-type="entity-link" >MissingCookieError</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotEnoughIntegrationsEnabledError.html" data-type="entity-link" >NotEnoughIntegrationsEnabledError</a>
                            </li>
                            <li class="link">
                                <a href="classes/OIDCRedirectResponseDto.html" data-type="entity-link" >OIDCRedirectResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationNotSupportedError.html" data-type="entity-link" >OperationNotSupportedError</a>
                            </li>
                            <li class="link">
                                <a href="classes/OutboxEventEntity.html" data-type="entity-link" >OutboxEventEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/OutboxEventPartitionEntity.html" data-type="entity-link" >OutboxEventPartitionEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/OutboxEventRepository.html" data-type="entity-link" >OutboxEventRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/OutboxPartitionRepository.html" data-type="entity-link" >OutboxPartitionRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageDto.html" data-type="entity-link" >PageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageMetaDto.html" data-type="entity-link" >PageMetaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageOptionsDto.html" data-type="entity-link" >PageOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PartitionRepository.html" data-type="entity-link" >PartitionRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordResetRequestedEmail.html" data-type="entity-link" >PasswordResetRequestedEmail</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordUpdatedEmail.html" data-type="entity-link" >PasswordUpdatedEmail</a>
                            </li>
                            <li class="link">
                                <a href="classes/PayloadEncryptedError.html" data-type="entity-link" >PayloadEncryptedError</a>
                            </li>
                            <li class="link">
                                <a href="classes/PublicConfigurationModule.html" data-type="entity-link" >PublicConfigurationModule</a>
                            </li>
                            <li class="link">
                                <a href="classes/RecipientAlreadyExistsError.html" data-type="entity-link" >RecipientAlreadyExistsError</a>
                            </li>
                            <li class="link">
                                <a href="classes/RecipientAlreadyExistsError-1.html" data-type="entity-link" >RecipientAlreadyExistsError</a>
                            </li>
                            <li class="link">
                                <a href="classes/RecipientDto.html" data-type="entity-link" >RecipientDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RecipientDto-1.html" data-type="entity-link" >RecipientDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RecipientMapper.html" data-type="entity-link" >RecipientMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/RecipientMapper-1.html" data-type="entity-link" >RecipientMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/RecipientNotFoundError.html" data-type="entity-link" >RecipientNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/RecipientNotFoundError-1.html" data-type="entity-link" >RecipientNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/RedeemActivationTokenDto.html" data-type="entity-link" >RedeemActivationTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenEntity.html" data-type="entity-link" >RefreshTokenEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenNotFoundError.html" data-type="entity-link" >RefreshTokenNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegenerateMigrations1749289881465.html" data-type="entity-link" >RegenerateMigrations1749289881465</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegenerateMigrations1749289896371.html" data-type="entity-link" >RegenerateMigrations1749289896371</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegenerateMigrations1749289911264.html" data-type="entity-link" >RegenerateMigrations1749289911264</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegenerateMigrations1749289925550.html" data-type="entity-link" >RegenerateMigrations1749289925550</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegenerateMigrations1749289938815.html" data-type="entity-link" >RegenerateMigrations1749289938815</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegenerateMigrations1749289951431.html" data-type="entity-link" >RegenerateMigrations1749289951431</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterViaOIDCDto.html" data-type="entity-link" >RegisterViaOIDCDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterWithCredentialsDto.html" data-type="entity-link" >RegisterWithCredentialsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequestActivationTokenDto.html" data-type="entity-link" >RequestActivationTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RequestPasswordResetDto.html" data-type="entity-link" >RequestPasswordResetDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ServiceRequestFailedError.html" data-type="entity-link" >ServiceRequestFailedError</a>
                            </li>
                            <li class="link">
                                <a href="classes/ServiceToServiceClient.html" data-type="entity-link" >ServiceToServiceClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetFeatureFlagDto.html" data-type="entity-link" >SetFeatureFlagDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SingleUseTokenEntity.html" data-type="entity-link" >SingleUseTokenEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantAlreadyExistsError.html" data-type="entity-link" >TenantAlreadyExistsError</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantAlreadyExistsError-1.html" data-type="entity-link" >TenantAlreadyExistsError</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantDto.html" data-type="entity-link" >TenantDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantDto-1.html" data-type="entity-link" >TenantDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantMapper.html" data-type="entity-link" >TenantMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantMapper-1.html" data-type="entity-link" >TenantMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantNotFoundError.html" data-type="entity-link" >TenantNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/TenantNotFoundError-1.html" data-type="entity-link" >TenantNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/TestEvent.html" data-type="entity-link" >TestEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/TestEventEnqueueSubscriber.html" data-type="entity-link" >TestEventEnqueueSubscriber</a>
                            </li>
                            <li class="link">
                                <a href="classes/TestEventHandler.html" data-type="entity-link" >TestEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenInvalidError.html" data-type="entity-link" >TokenInvalidError</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenNotFoundError.html" data-type="entity-link" >TokenNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/TOTPInvalidError.html" data-type="entity-link" >TOTPInvalidError</a>
                            </li>
                            <li class="link">
                                <a href="classes/TOTPIssuingNotSupportedError.html" data-type="entity-link" >TOTPIssuingNotSupportedError</a>
                            </li>
                            <li class="link">
                                <a href="classes/TOTPSecretsManager.html" data-type="entity-link" >TOTPSecretsManager</a>
                            </li>
                            <li class="link">
                                <a href="classes/TwoFactorAuthCodeIssuedEmail.html" data-type="entity-link" >TwoFactorAuthCodeIssuedEmail</a>
                            </li>
                            <li class="link">
                                <a href="classes/TwoFactorAuthenticationIntegrationDto.html" data-type="entity-link" >TwoFactorAuthenticationIntegrationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TwoFactorAuthenticationIntegrationMapper.html" data-type="entity-link" >TwoFactorAuthenticationIntegrationMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/TwoFactorAuthenticationIntegrationService.html" data-type="entity-link" >TwoFactorAuthenticationIntegrationService</a>
                            </li>
                            <li class="link">
                                <a href="classes/TwoFactorAuthenticationIntegrationsProviderService.html" data-type="entity-link" >TwoFactorAuthenticationIntegrationsProviderService</a>
                            </li>
                            <li class="link">
                                <a href="classes/TwoFactorAuthenticationModuleFacade.html" data-type="entity-link" >TwoFactorAuthenticationModuleFacade</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnsupportedOIDCProviderError.html" data-type="entity-link" >UnsupportedOIDCProviderError</a>
                            </li>
                            <li class="link">
                                <a href="classes/UntrustedDomainError.html" data-type="entity-link" >UntrustedDomainError</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAlertDaysOfWeekDto.html" data-type="entity-link" >UpdateAlertDaysOfWeekDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAlertStatusDto.html" data-type="entity-link" >UpdateAlertStatusDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAlertTimeDto.html" data-type="entity-link" >UpdateAlertTimeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateDailyDateDto.html" data-type="entity-link" >UpdateDailyDateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEntryContentDto.html" data-type="entity-link" >UpdateEntryContentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEntryIsFeaturedDto.html" data-type="entity-link" >UpdateEntryIsFeaturedDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEntryStatusDto.html" data-type="entity-link" >UpdateEntryStatusDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePasswordDto.html" data-type="entity-link" >UpdatePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserActivatedEmail.html" data-type="entity-link" >UserActivatedEmail</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserActivationEmail.html" data-type="entity-link" >UserActivationEmail</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserAlreadyExistsError.html" data-type="entity-link" >UserAlreadyExistsError</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDto.html" data-type="entity-link" >UserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserMapper.html" data-type="entity-link" >UserMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserNotFoundError.html" data-type="entity-link" >UserNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/VariantNotSupportedError.html" data-type="entity-link" >VariantNotSupportedError</a>
                            </li>
                            <li class="link">
                                <a href="classes/Verify2FACodeDto.html" data-type="entity-link" >Verify2FACodeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Verify2FACodeDto-1.html" data-type="entity-link" >Verify2FACodeDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                                isNormalMode ? 'data-bs-target="#injectables-links"' : 'data-bs-target="#xs-injectables-links"'
                            }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"'}>
                                <li class="link">
                                    <a href="injectables/AccessScopesService.html" data-type="entity-link" >AccessScopesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccessTokenStrategy.html" data-type="entity-link" >AccessTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountActivatedEventHandler.html" data-type="entity-link" >AccountActivatedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountActivatedEventHandler-1.html" data-type="entity-link" >AccountActivatedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountActivationTokenRequestedEventHandler.html" data-type="entity-link" >AccountActivationTokenRequestedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountActivationTokenService.html" data-type="entity-link" >AccountActivationTokenService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountCreatedEventHandler.html" data-type="entity-link" >AccountCreatedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountPasswordUpdatedEventHandler.html" data-type="entity-link" >AccountPasswordUpdatedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountPasswordUpdatedEventHandler-1.html" data-type="entity-link" >AccountPasswordUpdatedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountRemovalRequestedEventHandler.html" data-type="entity-link" >AccountRemovalRequestedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountRemovalScheduledEventHandler.html" data-type="entity-link" >AccountRemovalScheduledEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountRemovalService.html" data-type="entity-link" >AccountRemovalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountRemovedEventHandler.html" data-type="entity-link" >AccountRemovedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountRemovedEventHandler-1.html" data-type="entity-link" >AccountRemovedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountRequestedPasswordResetEventHandler.html" data-type="entity-link" >AccountRequestedPasswordResetEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountSuspendedEventHandler.html" data-type="entity-link" >AccountSuspendedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AlertCheckJobTriggeredEventHandler.html" data-type="entity-link" >AlertCheckJobTriggeredEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AlertScheduler.html" data-type="entity-link" >AlertScheduler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AlertService.html" data-type="entity-link" >AlertService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AlertsProcessor.html" data-type="entity-link" >AlertsProcessor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/App2FAIntegrationService.html" data-type="entity-link" >App2FAIntegrationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link" >AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthorRemovedEventHandler.html" data-type="entity-link" >AuthorRemovedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthorService.html" data-type="entity-link" >AuthorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BaseSingleUseTokenService.html" data-type="entity-link" >BaseSingleUseTokenService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DailyInsightsProvider.html" data-type="entity-link" >DailyInsightsProvider</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DailyProviderService.html" data-type="entity-link" >DailyProviderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DailyReminderTriggeredEventHandler.html" data-type="entity-link" >DailyReminderTriggeredEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DailyService.html" data-type="entity-link" >DailyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataPurgeEventsPublisher.html" data-type="entity-link" >DataPurgeEventsPublisher</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataPurgeProcessor.html" data-type="entity-link" >DataPurgeProcessor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataPurgeScheduler.html" data-type="entity-link" >DataPurgeScheduler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DomainVerifierService.html" data-type="entity-link" >DomainVerifierService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Email2FAIntegrationService.html" data-type="entity-link" >Email2FAIntegrationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmailLookup.html" data-type="entity-link" >EmailLookup</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventInbox.html" data-type="entity-link" >EventInbox</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventLoopLagHealthIndicator.html" data-type="entity-link" >EventLoopLagHealthIndicator</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventOutbox.html" data-type="entity-link" >EventOutbox</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventPublisher.html" data-type="entity-link" >EventPublisher</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventsRemovalService.html" data-type="entity-link" >EventsRemovalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FeatureFlagService.html" data-type="entity-link" >FeatureFlagService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FederatedAccountService.html" data-type="entity-link" >FederatedAccountService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GoogleOIDCProvider.html" data-type="entity-link" >GoogleOIDCProvider</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HealthCheckProbesRegistry.html" data-type="entity-link" >HealthCheckProbesRegistry</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HtmlEmailTemplateFactory.html" data-type="entity-link" >HtmlEmailTemplateFactory</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HydratePipe.html" data-type="entity-link" >HydratePipe</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IntegrationEventsEncryptionService.html" data-type="entity-link" >IntegrationEventsEncryptionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IntegrationEventsSubscriber.html" data-type="entity-link" >IntegrationEventsSubscriber</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IntervalJobScheduleUpdatedEventHandler.html" data-type="entity-link" >IntervalJobScheduleUpdatedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JobExecutionsPurgeService.html" data-type="entity-link" >JobExecutionsPurgeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JobScheduleConfigurationService.html" data-type="entity-link" >JobScheduleConfigurationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JobScheduler.html" data-type="entity-link" >JobScheduler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KafkaConsumer.html" data-type="entity-link" >KafkaConsumer</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KafkaProducer.html" data-type="entity-link" >KafkaProducer</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ManagedAccountService.html" data-type="entity-link" >ManagedAccountService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OIDCProviderFactory.html" data-type="entity-link" >OIDCProviderFactory</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PartitionAssigner.html" data-type="entity-link" >PartitionAssigner</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PasswordResetTokenService.html" data-type="entity-link" >PasswordResetTokenService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PurgeJobTriggeredEventHandler.html" data-type="entity-link" >PurgeJobTriggeredEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RecipientCreatedEventHandler.html" data-type="entity-link" >RecipientCreatedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RecipientRemovedEventHandler.html" data-type="entity-link" >RecipientRemovedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RecipientService.html" data-type="entity-link" >RecipientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RecipientService-1.html" data-type="entity-link" >RecipientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshTokenInvalidationJobTriggeredEventHandler.html" data-type="entity-link" >RefreshTokenInvalidationJobTriggeredEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshTokenService.html" data-type="entity-link" >RefreshTokenService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResendMailSender.html" data-type="entity-link" >ResendMailSender</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SecureRefreshTokenCookieStrategy.html" data-type="entity-link" >SecureRefreshTokenCookieStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SingleUseTokenServiceFactory.html" data-type="entity-link" >SingleUseTokenServiceFactory</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantCreatedEventHandler.html" data-type="entity-link" >TenantCreatedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantCreatedEventHandler-1.html" data-type="entity-link" >TenantCreatedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantRemovalRequestedEventHandler.html" data-type="entity-link" >TenantRemovalRequestedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantRemovedEventHandler.html" data-type="entity-link" >TenantRemovedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantRemovedEventHandler-1.html" data-type="entity-link" >TenantRemovedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantService.html" data-type="entity-link" >TenantService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantService-1.html" data-type="entity-link" >TenantService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Throttler.html" data-type="entity-link" >Throttler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThrottlingGuard.html" data-type="entity-link" >ThrottlingGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TwoFactorAuthCodeIssuedEventHandler.html" data-type="entity-link" >TwoFactorAuthCodeIssuedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TwoFactorAuthenticationEventsPublisher.html" data-type="entity-link" >TwoFactorAuthenticationEventsPublisher</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TwoFactorAuthenticationFactory.html" data-type="entity-link" >TwoFactorAuthenticationFactory</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserActivatedEventHandler.html" data-type="entity-link" >UserActivatedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserCreatedEventHandler.html" data-type="entity-link" >UserCreatedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserEventsPublisher.html" data-type="entity-link" >UserEventsPublisher</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserRemovedEventHandler.html" data-type="entity-link" >UserRemovedEventHandler</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                            isNormalMode ? 'data-bs-target="#guards-links"' : 'data-bs-target="#xs-guards-links"'
                        }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"'}>
                            <li class="link">
                                <a href="guards/AccessGuard.html" data-type="entity-link" >AccessGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                            isNormalMode ? 'data-bs-target="#interfaces-links"' : 'data-bs-target="#xs-interfaces-links"'
                        }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"'}>
                            <li class="link">
                                <a href="interfaces/ConstructorOf.html" data-type="entity-link" >ConstructorOf</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventInboxOptions.html" data-type="entity-link" >EventInboxOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventInboxProcessorOptions.html" data-type="entity-link" >EventInboxProcessorOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventOutboxOptions.html" data-type="entity-link" >EventOutboxOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventOutboxProcessorOptions.html" data-type="entity-link" >EventOutboxProcessorOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAccessScopesService.html" data-type="entity-link" >IAccessScopesService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAccountEventsPublisher.html" data-type="entity-link" >IAccountEventsPublisher</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAccountMapper.html" data-type="entity-link" >IAccountMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAccountModuleFacade.html" data-type="entity-link" >IAccountModuleFacade</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAccountRemovalService.html" data-type="entity-link" >IAccountRemovalService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAlertEventsPublisher.html" data-type="entity-link" >IAlertEventsPublisher</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAlertMapper.html" data-type="entity-link" >IAlertMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAlertScheduler.html" data-type="entity-link" >IAlertScheduler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAlertService.html" data-type="entity-link" >IAlertService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAlertsProcessor.html" data-type="entity-link" >IAlertsProcessor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAuthenticationMapper.html" data-type="entity-link" >IAuthenticationMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAuthenticationService.html" data-type="entity-link" >IAuthenticationService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAuthorMapper.html" data-type="entity-link" >IAuthorMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAuthorService.html" data-type="entity-link" >IAuthorService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDailyInsightsProvider.html" data-type="entity-link" >IDailyInsightsProvider</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDailyMapper.html" data-type="entity-link" >IDailyMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDailyProviderService.html" data-type="entity-link" >IDailyProviderService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDailyService.html" data-type="entity-link" >IDailyService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDataPurgeEventsPublisher.html" data-type="entity-link" >IDataPurgeEventsPublisher</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDataPurgeProcessor.html" data-type="entity-link" >IDataPurgeProcessor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDataPurgeScheduler.html" data-type="entity-link" >IDataPurgeScheduler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDistributedCache.html" data-type="entity-link" >IDistributedCache</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDomainVerifierService.html" data-type="entity-link" >IDomainVerifierService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEmailLookup.html" data-type="entity-link" >IEmailLookup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEmailTemplate.html" data-type="entity-link" >IEmailTemplate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEmailTemplateFactory.html" data-type="entity-link" >IEmailTemplateFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEncryptionAlgorithm.html" data-type="entity-link" >IEncryptionAlgorithm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEntriesInsightsProvider.html" data-type="entity-link" >IEntriesInsightsProvider</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEntryDetailMapper.html" data-type="entity-link" >IEntryDetailMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEntryMapper.html" data-type="entity-link" >IEntryMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEntryService.html" data-type="entity-link" >IEntryService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventAdmin.html" data-type="entity-link" >IEventAdmin</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventConsumer.html" data-type="entity-link" >IEventConsumer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventInbox.html" data-type="entity-link" >IEventInbox</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventInboxProcessor.html" data-type="entity-link" >IEventInboxProcessor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventLoopLagHealthIndicator.html" data-type="entity-link" >IEventLoopLagHealthIndicator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventOutbox.html" data-type="entity-link" >IEventOutbox</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventOutboxProcessor.html" data-type="entity-link" >IEventOutboxProcessor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventProducer.html" data-type="entity-link" >IEventProducer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventPublisher.html" data-type="entity-link" >IEventPublisher</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventsQueueObserver.html" data-type="entity-link" >IEventsQueueObserver</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventsQueueSubscriber.html" data-type="entity-link" >IEventsQueueSubscriber</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventsRemovalService.html" data-type="entity-link" >IEventsRemovalService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFeatureFlagMapper.html" data-type="entity-link" >IFeatureFlagMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFeatureFlagService.html" data-type="entity-link" >IFeatureFlagService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFeatureFlagsProvider.html" data-type="entity-link" >IFeatureFlagsProvider</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFeatureFlagsStore.html" data-type="entity-link" >IFeatureFlagsStore</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFederatedAccountService.html" data-type="entity-link" >IFederatedAccountService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGoalEntryLinkService.html" data-type="entity-link" >IGoalEntryLinkService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGoalMapper.html" data-type="entity-link" >IGoalMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGoalService.html" data-type="entity-link" >IGoalService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IHealthCheckProbesRegistry.html" data-type="entity-link" >IHealthCheckProbesRegistry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInboxEventHandler.html" data-type="entity-link" >IInboxEventHandler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInboxEventRepository.html" data-type="entity-link" >IInboxEventRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInboxPartitionRepository.html" data-type="entity-link" >IInboxPartitionRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIntegrationEventRepository.html" data-type="entity-link" >IIntegrationEventRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIntegrationEventsEncryptionService.html" data-type="entity-link" >IIntegrationEventsEncryptionService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIntegrationEventsJobsOrchestrator.html" data-type="entity-link" >IIntegrationEventsJobsOrchestrator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIntegrationEventsSubscriber.html" data-type="entity-link" >IIntegrationEventsSubscriber</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IJobExecutionsPurgeService.html" data-type="entity-link" >IJobExecutionsPurgeService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IJobScheduleConfigurationService.html" data-type="entity-link" >IJobScheduleConfigurationService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IJobScheduler.html" data-type="entity-link" >IJobScheduler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMailSender.html" data-type="entity-link" >IMailSender</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IManagedAccountService.html" data-type="entity-link" >IManagedAccountService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IModelDTOEntityMapper.html" data-type="entity-link" >IModelDTOEntityMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOIDCProvider.html" data-type="entity-link" >IOIDCProvider</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOIDCProviderFactory.html" data-type="entity-link" >IOIDCProviderFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOutboxEventRepository.html" data-type="entity-link" >IOutboxEventRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOutboxPartitionRepository.html" data-type="entity-link" >IOutboxPartitionRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPartitionAssigner.html" data-type="entity-link" >IPartitionAssigner</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPartitionRepository.html" data-type="entity-link" >IPartitionRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRecipientMapper.html" data-type="entity-link" >IRecipientMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRecipientMapper-1.html" data-type="entity-link" >IRecipientMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRecipientService.html" data-type="entity-link" >IRecipientService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRecipientService-1.html" data-type="entity-link" >IRecipientService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRefreshTokenCookieStrategy.html" data-type="entity-link" >IRefreshTokenCookieStrategy</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRefreshTokenService.html" data-type="entity-link" >IRefreshTokenService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IServiceToServiceClient.html" data-type="entity-link" >IServiceToServiceClient</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISingleUseTokenService.html" data-type="entity-link" >ISingleUseTokenService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISingleUseTokenServiceFactory.html" data-type="entity-link" >ISingleUseTokenServiceFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITenantMapper.html" data-type="entity-link" >ITenantMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITenantMapper-1.html" data-type="entity-link" >ITenantMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITenantService.html" data-type="entity-link" >ITenantService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITenantService-1.html" data-type="entity-link" >ITenantService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IThrottler.html" data-type="entity-link" >IThrottler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITOTPSecretsManager.html" data-type="entity-link" >ITOTPSecretsManager</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITwoFactorAuthenticationEventsPublisher.html" data-type="entity-link" >ITwoFactorAuthenticationEventsPublisher</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITwoFactorAuthenticationFactory.html" data-type="entity-link" >ITwoFactorAuthenticationFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITwoFactorAuthenticationIntegrationMapper.html" data-type="entity-link" >ITwoFactorAuthenticationIntegrationMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITwoFactorAuthenticationIntegrationService.html" data-type="entity-link" >ITwoFactorAuthenticationIntegrationService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITwoFactorAuthenticationIntegrationsProviderService.html" data-type="entity-link" >ITwoFactorAuthenticationIntegrationsProviderService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITwoFactorAuthenticationModuleFacade.html" data-type="entity-link" >ITwoFactorAuthenticationModuleFacade</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserEventsPublisher.html" data-type="entity-link" >IUserEventsPublisher</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserMapper.html" data-type="entity-link" >IUserMapper</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUsersService.html" data-type="entity-link" >IUsersService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageMeta.html" data-type="entity-link" >PageMeta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageMetaDtoParameters.html" data-type="entity-link" >PageMetaDtoParameters</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageOptions.html" data-type="entity-link" >PageOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Paginated.html" data-type="entity-link" >Paginated</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RetryBackoffPolicy.html" data-type="entity-link" >RetryBackoffPolicy</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${
                            isNormalMode ? 'data-bs-target="#miscellaneous-links"' : 'data-bs-target="#xs-miscellaneous-links"'
                        }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"'}>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
            this.innerHTML = tp.strings;
        }
    }
);
