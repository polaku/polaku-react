import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie'

import { Paper, Button } from '@material-ui/core';

import { userLogout, fetchDataUserDetail } from '../store/action';

class Profil extends Component {

  componentDidMount() {
    // this.props.userId
    if(this.props.userId){
      this.props.fetchDataUserDetail(this.props.userId)
    }
  }
  

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.userId !== this.props.userId) {
      console.log("MASUK")
      await this.props.fetchDataUserDetail(this.props.userId)
      console.log(this.props.dataUserDetail)
    }
  }

  logout = () => {
    Cookies.remove('POLAGROUP')
    this.props.history.push('/login')
    this.props.userLogout()
  }

  render() {
    return (
      <div>
        {
          this.props.dataUserDetail && <>
            <Paper style={{ padding: '40px 30px 20px 30px', backgroundColor: 'white', borderRadius: 0, width: 400, margin: '50px auto', display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center' }}>
              {
                this.props.dataUserDetail.tbl_account_detail && <>
                  <img src={this.props.dataUserDetail.tbl_account_detail.avatar} alt="avatar_user" style={{ width: 150, height: 150, borderRadius: 5, marginBottom: 15 }} />
                  <p style={{ fontWeight: 'bold', margin: 0, fontSize: 18  }}>{this.props.dataUserDetail.tbl_account_detail.fullname}</p>
                  <p style={{ margin: 0, fontSize: 14  }}>NIK : {this.props.dataUserDetail.tbl_account_detail.nik ? this.props.dataUserDetail.tbl_account_detail.nik : "-"}</p>
                  {
                    this.props.dataUserDetail.email && <p style={{ margin: 0, fontSize: 13, color: 'gray'  }}>{this.props.dataUserDetail.email}</p>
                  }
                </>
              }
              <Button color="secondary" style={{ marginTop: 10 }} onClick={this.logout}>
                Logout
              </Button>
            </Paper>

          </>
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  userLogout,
  fetchDataUserDetail
}

const mapStateToProps = ({ userId, dataUserDetail, loading }) => {
  return {
    loading,
    userId,
    dataUserDetail
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profil)