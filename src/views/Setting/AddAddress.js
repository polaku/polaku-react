import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import { Grid, Button, Select, MenuItem, FormControl, FormControlLabel, Checkbox } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import CardAddAddress from '../../components/setting/cardAddAddress';
import Loading from '../../components/Loading';

import swal from 'sweetalert';

import { fetchDataCompanies, fetchDataAddress } from '../../store/action';

import { API } from '../../config/API';

class AddAddress extends Component {
  state = {
    alamat: [false],
    statusSubmit: false,
    companyId: '',
    disableCompanyId: false,
    data: [],
    indexMainAddress: null,
    dataForEdit: [],
    tempDataForEdit: [],
    proses: false,
    dataBuilding: [],
    optionCompany: []
  }

  async componentDidMount() {
    await this.fetchBuilding()
    if (this.props.location.state) {
      if (this.props.location.state.data) {
        let data = [this.props.location.state.data]
        data.push()
        this.setState({ companyId: this.props.location.state.data.company_id, disableCompanyId: true, dataForEdit: data })
      } else {
        this.setState({ disableCompanyId: false })
      }
    }

    await this.props.fetchDataCompanies()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.dataCompanies !== prevProps.dataCompanies || this.props.admin !== prevProps.admin) {
      let optionCompany = []
      if (this.props.isAdminsuper) {
        this.setState({ optionCompany: [...optionCompany, ...this.props.dataCompanies] })
      } else {
        let idCompany = []
        await this.props.admin.forEach(el => {
          if (idCompany.indexOf(el.company_id) === -1) {
            let check = this.props.dataCompanies.find(element => el.company_id === element.company_id)
            if (check) {
              idCompany.push(el.company_id)
              optionCompany.push(check)
            }
          }
        })

        this.setState({ optionCompany })
      }
      if (optionCompany.length === 1) {
        this.setState({ companyId: optionCompany[0].company_id })
      }
    }
  }


  fetchBuilding = async () => {
    try {
      let { data } = await API.get('/building')
      this.setState({ dataBuilding: data.data })
    } catch (err) {
      swal('please refresh this page !')
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  navigateBack = () => {
    this.props.history.push('/setting/setting-perusahaan', this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
    )
  }

  addAlamat = () => {
    let listAlamat = this.state.alamat
    listAlamat.push(false)
    this.setState({ alamat: listAlamat })
  }

  deleteAddress = (index) => {
    let listAlamat = this.state.alamat;

    listAlamat.splice(index, 1);
    this.setState({
      alamat: listAlamat
    });
  }

  submit = () => {
    this.setState({ statusSubmit: true })
  }

  sendData = async (args) => {
    if (this.state.companyId !== '') {
      if (this.props.location.state && this.props.location.state.data) {
        let newData = this.state.tempDataForEdit
        newData.push(args)
        let token = Cookies.get('POLAGROUP'), promises = []

        if (newData.length === this.state.dataForEdit.length) {
          this.setState({ proses: true })
          if (newData.length === 1) {
            API.put(`/address/${newData[0].get('addressId')}`, newData[0], {
              headers: {
                token,
                ip: this.props.ip
              },
              // 'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
            })
              .then(async ({ data }) => {
                this.setState({ data: [], proses: false })
                await this.props.fetchDataAddress()
                swal('Ubah alamat sukses', '', 'success')
                this.props.history.push('/setting/setting-perusahaan', this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
                )
              })
              .catch(err => {
                // console.log(err)
                this.setState({ proses: false })
                swal('Ubah alamat gagal', '', 'error')
              })
          } else {
            newData.forEach(async (data, index) => {
              if (this.state.indexMainAddress !== null) {
                if (index === this.state.indexMainAddress) {
                  data.append('isMainAddress', true)
                } else {
                  data.append('isMainAddress', false)
                }
              }
              promises.push(API.put(`/address/${data.get('addressId')}`, data, {
                headers: {
                  token,
                  ip: this.props.ip
                },
                'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
              }))
            })
            Promise.all(promises)
              .then(async ({ data }) => {
                this.setState({ data: [], proses: false })
                await this.props.fetchDataAddress()
                swal('Ubah alamat sukses', '', 'success')
                this.props.history.push('/setting/setting-perusahaan', this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
                )
              })
              .catch(err => {
                // console.log(err)
                this.setState({ proses: false })
                swal('Ubah alamat gagal', '', 'error')
              })
          }
        } else {
          this.setState({ tempDataForEdit: newData })
        }
      } else {
        let newData = this.state.data
        newData.push(args)
        this.setState({ proses: true })
        let token = Cookies.get('POLAGROUP'), promises = []

        if (newData.length === this.state.alamat.length) {
          newData.forEach(async (data, index) => {
            if (this.state.indexMainAddress !== null) {
              if (index === this.state.indexMainAddress) {
                data.append('isMainAddress', true)
              } else {
                data.append('isMainAddress', false)
              }
            }
            promises.push(API.post('/address', data, {
              headers: {
                token,
                // ip: this.props.ip
              }
            }))
          })
          Promise.all(promises)
            .then(async ({ data }) => {
              this.setState({ data: [], proses: false })
              await this.props.fetchDataAddress()
              swal('Tambah alamat sukses', '', 'success')
              this.props.history.push('/setting/setting-perusahaan', this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
              )
            })
            .catch(err => {
              this.setState({ proses: false })
              swal('Tambah alamat gagal', '', 'error')
            })
        } else {
          this.setState({ data: newData })
        }
      }
    } else {
      swal('Perusahaan belum dipilih', '', 'warning')
    }
  }

  handleMainAddress = index => event => {
    let newAlamat = this.state.alamat

    newAlamat[newAlamat.indexOf(true)] = !event.target.checked
    newAlamat[index] = event.target.checked

    this.setState({
      indexMainAddress: index,
      alamat: newAlamat
    })
  }

  render() {
    return (
      <Grid>
        {
          this.state.proses && <Loading loading={this.state.proses} />
        }
        <Grid style={{ display: 'flex' }}>
          <img src={process.env.PUBLIC_URL + '/location.png'} alt="Logo" style={{ width: 60, maxHeight: 60, alignSelf: 'center', marginBottom: 20 }} />
          <Grid style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px' }}>
            <b style={{ fontSize: 20 }}>Tambah alamat perusahaan baru</b>
            <p style={{ margin: '5px 0px' }}>Pastikan alamat dan hari kerja sudah benar</p>
            <p style={{ margin: 0, fontSize: 12, color: '#d71149', cursor: 'pointer' }} onClick={this.navigateBack}>{'<'} kembali ke pengaturan</p>
          </Grid>
        </Grid>
        <Grid style={{ display: 'flex', alignItems: 'center' }}>
          <b style={{ fontSize: 17, marginRight: 20, marginLeft: 10 }}>Perusahaan</b>
          <FormControl variant="outlined" size="small" style={{ margin: '10px 0 5px 0' }}>
            <Select
              value={this.state.companyId}
              onChange={this.handleChange('companyId')}
              disabled={this.state.proses || this.state.disableCompanyId}
              style={{ width: 130 }}
            >
              {
                this.state.optionCompany.map((company, index) =>
                  <MenuItem value={company.company_id} key={index}>{company.acronym}</MenuItem>
                )
              }
            </Select>
          </FormControl>
        </Grid>
        {
          this.state.alamat.map((alamat, index) =>
            <Grid style={{ margin: '10px 0px' }} key={index}>
              <Grid style={{ margin: '20px 0px 0px 10px', display: 'flex', alignItems: 'center' }}>
                {
                  this.state.alamat.length > 1 && <>
                    <b style={{ margin: 0, fontSize: 16 }}>Alamat {index + 1}</b>
                    <CloseIcon style={{ backgroundColor: 'red', color: 'white', borderRadius: 15, marginLeft: 5, marginRight: 15, cursor: 'pointer' }} onClick={() => this.deleteAddress(index)} />
                  </>
                }
                {/*  */}
                <FormControlLabel
                  control={<Checkbox checked={alamat || (this.state.dataForEdit.length > 0 && this.state.dataForEdit[index].is_main_address)} onChange={this.handleMainAddress(index)} size="small" name={'isMainAddress' + index} />}
                  label={<p style={{ margin: 0, fontSize: 13 }}>Jadikan alamat pusat</p>}
                />
              </Grid>
              <CardAddAddress statusSubmit={this.state.statusSubmit} companyId={this.state.companyId} sendData={this.sendData} data={this.state.dataForEdit[index]} proses={this.state.proses} dataBuilding={this.state.dataBuilding} />
            </Grid>
          )
        }
        {
          this.state.dataForEdit.length === 0 && <p style={{ margin: 0, color: '#d91b51', cursor: 'pointer' }} onClick={this.addAlamat} disabled={this.state.proses}>+ tambah alamat baru</p>
        }

        <Button variant="outlined" color="secondary" style={{ width: 150, margin: 10 }} onClick={() => this.props.history.push('/setting/setting-perusahaan', this.props.history.push('/setting/setting-perusahaan', { index: this.props.location.state.index })
        )} disabled={this.state.proses}>batalkan</Button>
        <Button variant="contained" color="secondary" style={{ width: 150, margin: 10 }} onClick={this.submit} disabled={this.state.proses}>simpan</Button>
      </Grid>
    )
  }
}



const mapDispatchToProps = {
  fetchDataCompanies,
  fetchDataAddress
}

const mapStateToProps = ({ dataCompanies, isAdminsuper, ip, admin }) => {
  return {
    dataCompanies,
    isAdminsuper,
    ip,
    admin
    // dinas,
    // PIC,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAddress)