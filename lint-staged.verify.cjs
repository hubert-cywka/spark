module.exports = {
    "*.{js,jsx,ts,tsx}": ["prettier --write --editorconfig --check", "eslint"],
    "*.{tf,tfvars}": ["terraform fmt -check"],
};
