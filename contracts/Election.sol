pragma solidity ^0.5.0;

contract Election
{
    // Read/write candidate
    string public candidate;

    struct Candidate
    {
        uint id;
        string name;
        uint voteCount;
    }

    // Mapping from Aadhaar to account ID
    mapping(uint => uint) private accounts;
    uint private accountsCount = 0;

    mapping(uint => Candidate) public candidates;
    uint public candidatesCount = 0;

    mapping(address => bool) public voters;

    // Constructor
    constructor() public
    {
        addCandidate("Bryson");
        addCandidate("Siddartha");
    }

    function addCandidate (string memory _name) private
    {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function addAccount (uint _aadhaar) public returns (uint)
    {
        accountsCount++;
        accounts[_aadhaar] = accountsCount;
        return accountsCount;
    }

    function getAccount (uint _aadhaar) public view returns (uint)
    {
        return accounts[_aadhaar];
    }

    function vote (uint _candidateId) public
    {
        // require that they haven't voted before
        require(!voters[msg.sender], "Voter has already cast his vote");

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount++;
    }
}