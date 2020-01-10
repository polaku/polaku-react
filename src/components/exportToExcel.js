import React from "react";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class exportToExcel extends React.Component {
  state = {
    data: []
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log("MASUK")

  //   if (prevProps.data !== this.props.data) {
  //     console.log("MASUK")
  //     this.setState({
  //       data: this.props.data
  //     })
  //     console.log(this.props.data)
  //   }
  // }

  render() {
    return (
      <ExcelFile element={<p style={{ cursor: 'pointer', fontWeight: 'bold', marign:0 }}>download report</p>}>
        <ExcelSheet data={this.props.data} name={this.props.nameSheet}>
          {
            this.props.labelValue.map((el, index) => (
              <ExcelColumn label={el.label} value={el.value} key={index} />
            ))
          }
        </ExcelSheet>
      </ExcelFile>
    );
  }
}