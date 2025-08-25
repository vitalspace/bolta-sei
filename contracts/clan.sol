// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClanManager {
    
    struct Clan {
        string name;
        string acronym;
        address leader;
        address[] members;
        uint256 creationTime;
        uint256 joinPrice; // Price to join the clan in wei
        string logoUrl; // URL for clan logo
        bool exists;
    }
    
    mapping(string => Clan) public clans;
    mapping(address => string) public playerInClan;
    
    string[] public clansList;
    
    event ClanCreated(string name, string acronym, address leader);
    event MemberAdded(string clan, address member);
    event MemberRemoved(string clan, address member);
    event ClanDissolved(string clan);
    event JoinPriceChanged(string clan, uint256 newPrice);
    event MemberJoinedByPayment(string clan, address member, uint256 price);
    event ClanLogoUpdated(string clan, string newLogoUrl);
    
    modifier onlyClanLeader(string memory clanName) {
        require(clans[clanName].leader == msg.sender, "Only clan leader can do this");
        _;
    }
    
    modifier clanExists(string memory clanName) {
        require(clans[clanName].exists, "Clan does not exist");
        _;
    }
    
    modifier playerWithoutClan() {
        require(bytes(playerInClan[msg.sender]).length == 0, "You are already in a clan");
        _;
    }
    
    // Create a new clan
    function createClan(string memory _name, string memory _acronym, string memory _logoUrl) external playerWithoutClan {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_acronym).length > 0 && bytes(_acronym).length <= 5, "Acronym must be 1-5 characters");
        require(!clans[_name].exists, "Clan already exists");
        
        // Create the clan
        clans[_name].name = _name;
        clans[_name].acronym = _acronym;
        clans[_name].leader = msg.sender;
        clans[_name].members.push(msg.sender);
        clans[_name].creationTime = block.timestamp;
        clans[_name].joinPrice = 0; // Default is free
        clans[_name].logoUrl = _logoUrl;
        clans[_name].exists = true;
        
        // Update mappings
        playerInClan[msg.sender] = _name;
        clansList.push(_name);
        
        emit ClanCreated(_name, _acronym, msg.sender);
    }
    
    // Set join price for clan (leader only)
    function setJoinPrice(string memory _clanName, uint256 _price) 
        external 
        onlyClanLeader(_clanName) 
        clanExists(_clanName) 
    {
        clans[_clanName].joinPrice = _price;
        emit JoinPriceChanged(_clanName, _price);
    }
    
    // Join clan by paying the required price
    function joinClan(string memory _clanName) 
        external 
        payable 
        clanExists(_clanName) 
        playerWithoutClan() 
    {
        require(msg.value >= clans[_clanName].joinPrice, "Insufficient payment to join clan");
        
        // Add member to clan
        clans[_clanName].members.push(msg.sender);
        playerInClan[msg.sender] = _clanName;
        
        // Transfer payment to clan leader
        if (msg.value > 0) {
            payable(clans[_clanName].leader).transfer(msg.value);
        }
        
        emit MemberJoinedByPayment(_clanName, msg.sender, msg.value);
    }
    
    // Add member to clan
    function addMember(string memory _clanName, address _newMember) 
        external 
        onlyClanLeader(_clanName) 
        clanExists(_clanName) 
    {
        require(bytes(playerInClan[_newMember]).length == 0, "Player is already in a clan");
        
        clans[_clanName].members.push(_newMember);
        playerInClan[_newMember] = _clanName;
        
        emit MemberAdded(_clanName, _newMember);
    }
    
    // Remove member from clan
    function removeMember(string memory _clanName, address _member) 
        external 
        onlyClanLeader(_clanName) 
        clanExists(_clanName) 
    {
        require(_member != clans[_clanName].leader, "Leader cannot be removed");
        
        // Find and remove member
        address[] storage members = clans[_clanName].members;
        for (uint i = 0; i < members.length; i++) {
            if (members[i] == _member) {
                members[i] = members[members.length - 1];
                members.pop();
                break;
            }
        }
        
        delete playerInClan[_member];
        
        emit MemberRemoved(_clanName, _member);
    }
    
    // Leave clan (for members)
    function leaveClan() external {
        string memory clanName = playerInClan[msg.sender];
        require(bytes(clanName).length > 0, "You are not in any clan");
        require(clans[clanName].leader != msg.sender, "Leader must dissolve the clan");
        
        // Remove from members list
        address[] storage members = clans[clanName].members;
        for (uint i = 0; i < members.length; i++) {
            if (members[i] == msg.sender) {
                members[i] = members[members.length - 1];
                members.pop();
                break;
            }
        }
        
        delete playerInClan[msg.sender];
        
        emit MemberRemoved(clanName, msg.sender);
    }
    
    // Dissolve clan (leader only)
    function dissolveClan(string memory _clanName) 
        external 
        onlyClanLeader(_clanName) 
        clanExists(_clanName) 
    {
        // Remove all members from mapping
        for (uint i = 0; i < clans[_clanName].members.length; i++) {
            delete playerInClan[clans[_clanName].members[i]];
        }
        
        // Remove from clans list
        for (uint i = 0; i < clansList.length; i++) {
            if (keccak256(bytes(clansList[i])) == keccak256(bytes(_clanName))) {
                clansList[i] = clansList[clansList.length - 1];
                clansList.pop();
                break;
            }
        }
        
        delete clans[_clanName];
        
        emit ClanDissolved(_clanName);
    }
    
    // Get clan information
    function getClan(string memory _clanName) 
        external 
        view 
        clanExists(_clanName) 
        returns (string memory name, string memory acronym, address leader, address[] memory members, uint256 creationTime, uint256 joinPrice) 
    {
        Clan memory clan = clans[_clanName];
        return (clan.name, clan.acronym, clan.leader, clan.members, clan.creationTime, clan.joinPrice);
    }
    
    // Get player's clan
    function getPlayerClan(address _player) external view returns (string memory) {
        return playerInClan[_player];
    }
    
    // Get number of members in clan
    function getMemberCount(string memory _clanName) 
        external 
        view 
        clanExists(_clanName) 
        returns (uint256) 
    {
        return clans[_clanName].members.length;
    }
    
    // Get all clans
    function getAllClans() external view returns (string[] memory) {
        return clansList;
    }
    
    // Get clan join price
    function getClanJoinPrice(string memory _clanName) 
        external 
        view 
        clanExists(_clanName) 
        returns (uint256) 
    {
        return clans[_clanName].joinPrice;
    }
}