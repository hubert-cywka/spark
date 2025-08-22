module.exports = {
    "*.{js,jsx,ts,tsx}": ["prettier --write --editorconfig", "eslint --fix"],
    "*.{tf,tfvars}": ["terraform fmt"],
};
