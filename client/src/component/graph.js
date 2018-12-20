import React, {Component} from 'react'
import * as d3 from 'd3'

class BarChart extends Component {
  constructor(props) {
    super(props)
    this.createBar = this.createBar.bind(this)
  }
  componentDidMount() {
    this.createBar()
  }

  componentDidUpdate() {
    this.createBar()
  }

  createBar() {
    const { category } = this.props
    const node = this.node
    const margin = 20
    const height = this.props.size[1] - 2 * margin
    const width = this.props.size[0] - 2 * margin
    let yAxisLabel = ' '

    switch (category) {
      case 'totalScore':
        yAxisLabel = 'Score'
        break
      case 'puttsGreen':
        yAxisLabel = 'Putts'
        break
      default:
        yAxisLabel = 'Yards'
        break
    }
    const svg = d3.select(node)
      .attr('transform', `translate(${margin}, ${margin})`)
    const data = this.props.data.finalStat
    let dataMax = 0
    if (category === 'totalScore') {
      dataMax = Math.max.apply(null, this.props.data.finalStat.map(stat => stat.totalScore))
    }
    else {
      dataMax = Math.max.apply(null, this.props.data.finalStat.map(stat => stat.averageStat[category]))
    }
    const padding = 45
    const yScale = d3.scaleLinear()
      .domain([0, dataMax])
      .range([height, padding])

    svg.append('g')
      .attr('transform', `translate(${padding}, 0)`)
      .attr('fill', 'white')
      .call(d3.axisLeft(yScale))

    const makeYlines = () => d3.axisLeft()
      .scale(yScale)

    const xScale = d3.scaleBand()
      .range([padding, width - padding])
      .domain(data.map((d) => d.date))
      .padding(0.2)

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('fill', 'white')
      .call(d3.axisBottom(xScale))

    svg.append('g')
      .attr('class', 'grid')
      .attr('fill', 'white')
      .attr('transform', `translate(${padding}, 0)`)
      .call(makeYlines()
        .tickSize(-width, 0, 0)
        .tickFormat(''))

    const bar = svg.selectAll()
      .data(data)
      .enter()
      .append('g')

    const t = d3.transition()
      .duration(1000)
      .ease(d3.easeBounceOut)

    bar
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.date))
      .attr('width', xScale.bandwidth() + 5)
      .transition(t)
      .delay((d, i) => i * 100)
      .attr('y', d => {
        return category === 'totalScore' ? yScale(d.totalScore) : yScale(d.averageStat[category])
      })
      .attr('height', d => {
        return category === 'totalScore' ? height - yScale(d.totalScore) : height - yScale(d.averageStat[category])
      })

    bar
      .on('mouseenter', function (actual, i) {
        d3.selectAll('.value')
          .attr('opacity', 0)
        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.6)
          .attr('x', (d) => {
            return (xScale(d.date) - 5)
          })
          .attr('width', xScale.bandwidth() + 10)
        const actualData = category === 'totalScore' ? actual.totalScore : actual.averageStat[category]
        const y = yScale(actualData)

        svg.append('line')
          .attr('id', 'limit')
          .attr('x1', 0)
          .attr('y1', y)
          .attr('x2', width)
          .attr('y2', y)

        bar.append('text')
          .attr('class', 'divergence')
          .attr('x', (d) => xScale(d.date) + xScale.bandwidth() / 2)
          .attr('y', d => {
            return category === 'totalScore' ? yScale(d.totalScore) + 30 : yScale(d.averageStat[category]) + 30
          })
          .attr('fill', '#2F4A6D')
          .attr('text-anchor', 'middle')
          .text((d, idx) => {
            const divergence = category === 'totalScore' ? (d.totalScore - actualData).toFixed(1) : (d.averageStat[category] - actualData).toFixed(1)

            let text = ''
            if (divergence > 0) {
              text += '+'
            }
            text += `${divergence}`

            return idx !== i ? text : ''
          })

      })
      .on('mouseleave', function (actual, i) {
        d3.selectAll('.value')
          .attr('opacity', 1)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('x', (d) => xScale(d.date))
          .attr('width', xScale.bandwidth())

        svg.selectAll('#limit').remove()
        svg.selectAll('.divergence').remove()
      })

    bar
      .append('text')
      .attr('class', 'value')
      .attr('x', (d) => xScale(d.date) + xScale.bandwidth() / 2)
      .attr('y', d => {
        return category === 'totalScore' ? yScale(d.totalScore) + 30 : yScale(d.averageStat[category]) + 30
      })
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .text(d => {
        return category === 'totalScore' ? d.totalScore : d.averageStat[category]
      })

    svg
      .append('text')
      .attr('class', 'label')
      .attr('x', (-height / 2) - margin)
      .attr('y', margin / 1.9)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(yAxisLabel)

    svg
      .append('text')
      .attr('fill', 'white')
      .attr('class', 'chartTitle')
      .attr('x', width / 2 + margin)
      .attr('y', 18)
      .attr('text-anchor', 'middle')
      .text(category)

  }

  render() {
    return (
      <svg style={{ margin: 'auto', width: `${this.props.size[0]}` }} ref={node => {
        this.node = node
      }} ></svg>

    )
  }

}

export default BarChart
