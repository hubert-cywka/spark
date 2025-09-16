module.exports = {
    "*.{js,jsx,ts,tsx}": ["prettier --check --config .prettierrc.json", "eslint"],
    "*.{tf,tfvars}": ["terraform fmt -check"],
};
