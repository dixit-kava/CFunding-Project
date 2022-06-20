const funding = artifacts.require("funding");

module.exports = function (deployer) {
  deployer.deploy(funding);
};
