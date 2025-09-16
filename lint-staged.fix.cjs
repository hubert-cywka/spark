module.exports = {
    "*.{js,jsx,ts,tsx}": ["prettier --write --config .prettierrc.json", "eslint --fix"],
    "*.{tf,tfvars}": ["terraform fmt"],
};
