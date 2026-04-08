// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// OpenZeppelin v5 imports
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Token is ERC20, Ownable, Pausable {

    uint256 public maxSupply;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _maxSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        maxSupply = _maxSupply;

        _mint(msg.sender, initialSupply);
    }

    // 🔥 Mint (only owner)
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= maxSupply, "Max supply exceeded");
        _mint(to, amount);
    }

    // 🔥 Burn (user burns own tokens)
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    // 🔥 Pause contract
    function pause() public onlyOwner {
        _pause();
    }

    // 🔥 Unpause contract
    function unpause() public onlyOwner {
        _unpause();
    }

    // 🔥 Override transfer logic (NEW way in OZ v5)
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._update(from, to, amount);
    }
}