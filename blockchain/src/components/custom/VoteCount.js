import React, { Component } from 'react';
import Web3 from 'web3';
import Election from '../../build/Election.json'
// import { Link } from 'react-router-dom'


// const divStyle = {
//     backgroundColor:"lightblue" ,
//     marginTop :"10px",
//     borderRadius:"10px"
// }

class VoteCount extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
      }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        console.log(accounts)
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = Election.networks[networkId]
        if(networkData) {
            const election = new web3.eth.Contract(Election.abi, networkData.address)
            this.setState({ election })
            const candCount = await election.methods.candidatesCount().call()
            this.setState({ candCount })
            for (var i = 1; i <= candCount; i++) {
                const candidates = await election.methods.candidates(i).call()
                if(candidates.election_id === this.state.id){
                    this.setState({
                        candidates: [...this.state.candidates, candidates]
                    })
                }
            }
            console.log(this.state.candidates)
        } else {
            window.alert('Election contract not deployed to detected network.')
        }
    }

    handleInputChange = (e) => {
        console.log(e.target.id)
        this.setState({
            selectedId: e.target.id,
        })
        this.vote(e.target.id);
    }


    vote(id) {
        console.log(this.state.selectedId)
        this.setState({ loading: true })
        this.state.election.methods.vote(id).send({ from: this.state.account })
        .once('receipt', (receipt) => {
            this.setState({ loading: false })
            window.location.assign("/");
        })
    }

    componentDidMount(){
        let id = this.props.match.params.id;
        this.setState({
            id: id,
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            id: null,
            account: '',
            election: null,
            candCount: 0,
            candidates: [],
            loading: true,
            selectedId: null
        }
    }

    render(){
        const electionList = this.state.candidates.map(candidates => {
            return (

                <div className="contact" key={candidates.id}>
                    <li className="collection-item avatar" >
                        {/* <i className="material-icons circle blue darken-2">ballot</i> */}
                        <p><b>Candidate Name : {candidates.name}</b></p>
                        <p><b>Party Name : {candidates.details}</b></p>
                        <p className="secondary-content"><b>Votes : {candidates.voteCount}</b></p>
                    </li>
                </div>
            )
        })
        return(
            <div class="container-fluid" >
            <div class="row">
              <div class="col-lg-6 login-section-wrapper">

                <div class="login-wrapper my-auto">
                  {/* <h1 class="login-title">Create New Election</h1> */}
            <div className="container">
            <p className="title"><h1>Candidates</h1></p>
                <ul className="collection">

                        {electionList}
                </ul>
            </div>
            </div>
              </div>
              <div class="col-lg-6 px-0 ">
               <img src="http://www.tmbtimes.com/wp-content/uploads/2020/11/5fa14e822900001d22c6b35a-768x512.jpeg"  alt="login image" class="login-img"/>
           </div>
        </div>
        </div>
        )
    }
}

export default VoteCount;
