import React, { Component } from 'react'
import { Link } from 'react-router-dom';




class AdminPannel extends Component {
    render(){

        return (

            <div class="container-fluid">
            <div class="row">
              <div class="col-sm-4 login-section-wrapper">

                <div class="login-wrapper my-auto">
                  {/* <h1 class="login-title"></h1> */}
                  <ul>
                  <Link to={"/newElection"} className="title" ><button  class="btn btn-warning btn-lg ">Add New Election</button></Link>
                  <br />
                  <br />
                  <Link to={"/elections"} className="title" ><button  class="btn btn-warning btn-lg">Election List</button></Link>

                  {/* <li className="collection-item" ><h4 >Add New Election       <Link to="/newElection" className="secondary-content"><i className="material-icons">send</i></Link></h4></li>
                  <li className="collection-item" ><h4 >Election List                <Link to="/elections" className="secondary-content"><i className="material-icons">send</i></Link></h4></li> */}

                  </ul>
                </div>
              </div>
              <div class="col-sm-8 px-0 d-none d-sm-block">
                 {/* https://images.cnbctv18.com/wp-content/uploads/2019/03/General-Elections-20198-1019x573.jpg */}
                <img src="large.jpg"  alt="login image" class="login-img"/>
              </div>
            </div>
          </div>
        )
    }
}

export default AdminPannel;
