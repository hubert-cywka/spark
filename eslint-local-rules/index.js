module.exports = {
    "no-dto-as-type": {
        meta: {
            type: "problem",
            docs: {
                description: "Disallow importing classes ending with '-Dto' as type",
                category: "Breaking",
                recommended: true,
            },
            messages: {
                noDtoAsType: "Using DTO as type may result in fatal bugs.",
            },
            schema: [],
        },
        create(context) {
            return {
                ImportDeclaration(node) {
                    for (const specifier of node.specifiers) {
                        const isTypeImport =
                            node.importKind === "type" || (specifier.type === "ImportSpecifier" && specifier.importKind === "type");

                        if (isTypeImport && specifier.imported.name.toLowerCase().endsWith("dto")) {
                            context.report({
                                node: specifier,
                                messageId: "noDtoAsType",
                            });
                        }
                    }
                },
            };
        },
    },
};
