pragma solidity >=0.4.21 <0.7.0;

import "./CrowdSale.sol";
import "./KycContract.sol";
contract MyTokenSale is Crowdsale {
    KycContract kyc;
    constructor(
        uint256 rate, // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    ) public Crowdsale(rate, wallet, token) {
        kyc = _kyc;
    }
    function _preValidatePurchase(address beneficiary, uint256 weiAmount)
        internal
        view
        override
    {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(
            kyc.kycCompleted(beneficiary),
            "KYC not completed yet, aborting"
        );
    }
}
