## Decentralized Electronic Voting

We plan on tackling three major issues with our decentralized voting app: 
- Universal Applicability: Ensures that even remote constituencies without internet can be covered during voting.
- Automatic updation of valid voters list: Ensures that there are no missing names from the voters list and makes it convenient as it removes the requirement of a Voter ID card
- Security: Making sure that the entire voting workflow is resilient to both internal crashes as well as external attacks, thus rendering it impossible to rig the elections.

## Implementation

  Microsoft Azure Blockchain Service runs on the Ethereum protocol. Our DApp models the activity of voting as a transaction between the voter and the candidate. Each voter is modelled as an “Externally Owned Account”, while “Contract Accounts” act as the constituencies. 
 
  Since India has been slowly moving towards automation using Aadhar card, we want to integrate our voting application with Aadhar. This takes care of the Voter’s list problem because every Aadhar card owner who becomes eligible for voting has an “Externally Owned Account” automatically created for him. This makes sure that no eligible voters are missed from the Voters list.
    
  For each voter to cast a vote, the person first has to pass through a security layer to verify their identity. Using the fingerprint data associated with Aadhar ensures authentication and that each person cast his vote and send a transaction from their own account. This allows for people not living in their constituency to also cast a vote.

  Once all the transactions have taken place, they will need to be processed and verified so that they can be added to the blockchain. This verification is needed to remove fake transactions and ensuring that all transactions taking place in remote areas (Areas without internet) are still valid. Because of lower Block times on Ethereum (15 seconds), the results can be declared immediately.

  The use of Ethereum itself inherently guarantees that the data is not centralized in one location, this prevents anyone from changing the data and even if they want to change the data they would need trust from 51 percent of all nodes, which is impossible. 

  In addition to this we want to integrate our DApp with a Machine Learning model trained on the datasets provided to provide insight into each of the candidates, to help the voters decide the best candidate.
