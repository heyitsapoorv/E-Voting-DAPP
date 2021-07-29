import React, { Component } from 'react';
import Web3 from 'web3';
import Election from '../../build/Election.json'

// const myStryle ={
//     color:"black",
//     marginLeft:"20px",
// }
//
// const divStyle = {
//     backgroundColor:"lightblue" ,
//     marginTop :"10px",
//     borderRadius:"10px"
// }
//
//
// const buttonStyle ={
//     marginLeft:"20px",
//     marginBottom:"10px",
//     borderRadius:"10px"
// }

class NewCandidate extends Component{

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockChain()
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


    handleInputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    async loadBlockChain(){
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = Election.networks[networkId]
        if(networkData) {
            const election = new web3.eth.Contract(Election.abi, networkData.address)
            this.setState({ election })
        } else {
            window.alert('Election contract not deployed to detected network.')
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.addCandidates();
    }

    addCandidates() {
        console.log(this.state);
        this.setState({ loading: true })
        this.state.election.methods.addCandidate(this.state.candidate_name, this.state.candidate_details, this.state.id).send({ from: this.state.account })
        .once('receipt', (receipt) => {
            console.log(receipt);
          this.setState({ loading: false })
          window.location.assign("/elections");
        })
    }

    constructor(props) {
        super(props)
        this.state = {
          account: '',
          election: null,
          candidate_name: null,
          candidate_details: null,
          id: null
        }
        this.addCandidates = this.addCandidates.bind(this)
    }

    componentDidMount(){
        let id = this.props.match.params.id;
        this.setState({
            id: id,
        })
    }

    render(){
        return(
            <div class="container-fluid">
            <div class="row">
              <div class="col-lg-6 login-section-wrapper">

                <div class="login-wrapper my-auto">
                  <h1 class="login-title">Add New Candidate</h1>
            {/* <div className="container" style={divStyle}> */}
                <form onSubmit={this.handleSubmit}>
                <div class="form-group">
                <label htmlFor="name" >Candidate Name</label><br></br>
                    <input type="text" id="candidate_name" name="candidate_name" class="form-control" placeholder="Name" onChange={this.handleInputChange} required/>
                    <br />
                    <label htmlFor="name">Candidate details</label>
                    <br />
                    <input type="text" id="candidate_details" name="candidate_details" class="form-control" placeholder="Party Name" onChange={this.handleInputChange} required/>
                    <br />
                    <br />
                    <button  class="btn btn-warning " type="submit" name="action">Submit</button>
                    </div>
                </form>
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

export default NewCandidate;
