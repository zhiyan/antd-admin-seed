import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Collapse, Alert } from 'antd';
import { getChart } from '../../actions/chart'
import { bindActionCreators } from 'redux'
const Panel = Collapse.Panel;

import PanelBox from '../../components/PanelBox';

import {Line,Pie,Doughnut} from 'react-chartjs';

import './index.scss'

class Home extends React.Component {
  constructor () {
    super()
  }

  componentWillMount () {
    this.props.getChart()
  }

  componentDidUpdate(){
    if(this.props.chart.data.equipChart.length){
      const option = {
        tooltip: {
            trigger: 'item'
        },
        series: [
          {
            name: '销量分布',
            type: 'map',
            mapType: 'china',
            roam: false,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            data:this.props.chart.data.equipChart
          }
        ]
      }

      const myChart = echarts.init(document.getElementById('map-chart'))
      myChart.setOption(option)
    }
  }

  callback() {

  }

  render () {
    const style1 = {
      fillColor: "rgba(220,220,220,0.2)",
      strokeColor: "rgba(220,220,220,1)",
      pointColor: "rgba(220,220,220,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(220,220,220,1)"
    }

    const style2 = {
      fillColor: "rgba(151,187,205,0.2)",
      strokeColor: "rgba(151,187,205,1)",
      pointColor: "rgba(151,187,205,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(151,187,205,1)",
    }

    const chartOption = {
      responsive: true
    }

    const stepData = {
      labels: this.props.chart.data.userByDate.map(res => res.createDate),
      datasets: [
        Object.assign({}, style1, {
          label: "新增用户",
          data: this.props.chart.data.userByDate.map(res => res.userCount)
        }),
        Object.assign({}, style2, {
          label: "用户总量",
          data: this.props.chart.data.userByDate.map(res => res.sumCount)
        })
      ]
    }

    const volumeData = {
      labels: this.props.chart.data.thisMonth.map(res => res.createDate),
      datasets: [
        Object.assign({}, style1, {
          label: "本月",
          data: this.props.chart.data.thisMonth.map(res => res.inVolume)
        }),
        Object.assign({}, style2, {
          label: "上月",
          data: this.props.chart.data.lastMonth.map(res => res.inVolume)
        })
      ]
    }

    const saveData = {
      labels: this.props.chart.data.thisMonth.map(res => res.createDate),
      datasets: [
        Object.assign({}, style1, {
          label: "本月",
          data: this.props.chart.data.thisMonth.map(res => res.saveVolume)
        }),
        Object.assign({}, style2, {
          label: "上月",
          data: this.props.chart.data.lastMonth.map(res => res.saveVolume)
        })
      ]
    }

    return (
      <div>
        <div className="home-header">
          <h2>关键指标</h2>
          <table>
            <tbody>
            <tr>
              <th></th>
              <th>新增用户</th>
              <th>制水量(m<sup>3</sup>)</th>
              <th>废水节约量(m<sup>3</sup>)</th>
            </tr>
            <tr>
              <td>今日</td>
              <td>{this.props.chart.data.todayCount}</td>
              <td>{this.props.chart.data.todaySave}</td>
              <td>{this.props.chart.data.todayVolume}</td>
            </tr>
            <tr>
              <td>昨日</td>
              <td>{this.props.chart.data.yesterdayCount}</td>
              <td>{this.props.chart.data.yesterdayVolume}</td>
              <td>{this.props.chart.data.yesterdaySave}</td>
            </tr>
            <tr>
              <td>最近七天</td>
              <td>{this.props.chart.data.sevenCount}</td>
              <td>{this.props.chart.data.sevenVolume}</td>
              <td>{this.props.chart.data.sevenSave}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className="chart-list">
          <div className="chart-item chart-left-item">
            <h6>趋势图</h6>
            <Line data={stepData} options={chartOption} />
          </div>
          <div className="chart-item">
            <h6>制水量(m<sup>3</sup>)</h6>
            <Line data={volumeData} options={chartOption} />
          </div>
          <div className="chart-item chart-left-item">
            <h6>水资源节约量(m<sup>3</sup>)</h6>
            <Line data={saveData} options={chartOption} />
          </div>
          <div className="chart-item">
            <h6>地域分布</h6>
            <div id="map-chart" style={{width: '100%', height:'272px'}}></div>
          </div>
        </div>
      </div>
        
    )
  }
}


Home.propTypes = {
}

Home.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const {chart}  = state
  return {
    chart: chart
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getChart: bindActionCreators(getChart, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)


