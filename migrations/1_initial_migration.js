const Migrations = artifacts.require("Migrations");

module.exports = function(deployer, network, accounts) {
  console.log(accounts);
  deployer.deploy(Migrations);
};
