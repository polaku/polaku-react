import React from "react";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class exportToExcel extends React.Component {
  state = {
    data: []
  }

  render() {
    if (this.props.report === "ijin") {
      return (
        <ExcelFile element={<p style={{ cursor: 'pointer', fontWeight: 'bold', marign: 0 }}>{this.props.title}</p>}>
          <ExcelSheet data={this.props.data} name={this.props.nameSheet}>
            {
              this.props.labelValue.length > 0 && this.props.labelValue.map((el, index) => (
                <ExcelColumn label={el.label} value={el.value} key={index} />
              ))
            }
          </ExcelSheet>
        </ExcelFile>
      );
    } 
    
    else if (this.props.report === "kpim") {
      if (this.props.title === "semua") {
        return (
          <ExcelFile element={<p style={{ cursor: 'pointer', marign: 0 }}>{this.props.title}</p>}>
            <ExcelSheet data={this.props.data} name="report nilai">
              {
                this.props.labelValueReportNilai.length > 0 && this.props.labelValueReportNilai.map((el, index) => (
                  <ExcelColumn label={el.label} value={el.value} key={index} />
                ))
              }
            </ExcelSheet>
            <ExcelSheet data={this.props.dataKPIM} name="report KPIM">
              {
                this.props.labelValueKPIM.length > 0 && this.props.labelValueKPIM.map((el, index) => (
                  <ExcelColumn label={el.label} value={el.value} key={index} />
                ))
              }
            </ExcelSheet>
            <ExcelSheet data={this.props.dataTAL} name="report TAL">
              {
                this.props.labelValueTAL.length > 0 && this.props.labelValueTAL.map((el, index) => (
                  <ExcelColumn label={el.label} value={el.value} key={index} />
                ))
              }
            </ExcelSheet>
          </ExcelFile>
        )
      } else if (this.props.title === "KPIM") {
        return (
          <ExcelFile element={<p style={{ cursor: 'pointer', marign: 0 }}>{this.props.title}</p>}>
            <ExcelSheet data={this.props.dataKPIM} name="report KPIM">
              {
                this.props.labelValueKPIM.length > 0 && this.props.labelValueKPIM.map((el, index) => (
                  <ExcelColumn label={el.label} value={el.value} key={index} />
                ))
              }
            </ExcelSheet>
          </ExcelFile>
        );
      } else if (this.props.title === "TAL") {
        return (
          <ExcelFile element={<p style={{ cursor: 'pointer', marign: 0 }}>{this.props.title}</p>}>
            <ExcelSheet data={this.props.dataTAL} name="report TAL">
              {
                this.props.labelValueTAL.length > 0 && this.props.labelValueTAL.map((el, index) => (
                  <ExcelColumn label={el.label} value={el.value} key={index} />
                ))
              }
            </ExcelSheet>
          </ExcelFile>
        );
      }
    }
    
    
    
    else {
      return (
        <ExcelFile element={<p style={{ cursor: 'pointer', fontWeight: 'bold', marign: 0 }}>{this.props.title}</p>}>
          <ExcelSheet data={this.props.data} name={this.props.nameSheet}>
            {
              this.props.labelValue.length > 0 && this.props.labelValue.map((el, index) => (
                <ExcelColumn label={el.label} value={el.value} key={index} />
              ))
            }
          </ExcelSheet>
        </ExcelFile>
      );
    }
  }
}
