// @flow

import React, {Component} from 'react'
import { ControlLabel, FormControl } from 'react-bootstrap'
import moment from 'moment'

type Props = {
  routes: any,
  stop: any
}

type State = {
  index: number
}

export default class TransferPerformance extends Component<Props, State> {
  state = {
    index: 0
  }

  renderTransferPerformanceResult (transferPerformance: ?any) {
    if (!transferPerformance) {
      return <p>No se encontraron transferencias</p>
    }
    return (
      <ul className='list-unstyled' style={{marginTop: '5px'}}>
        <li><strong>Caso típico: {moment.duration(transferPerformance.typicalCase, 'seconds').humanize()}</strong></li>
        <li>Mejor caso: {moment.duration(transferPerformance.bestCase, 'seconds').humanize()}</li>
        <li>Peor caso: {moment.duration(transferPerformance.worstCase, 'seconds').humanize()}</li>
      </ul>
    )
  }

  _onChangeSelect = (evt: any) => {
    const index = +evt.target.value
    this.setState({index})
  }

  render () {
    const { stop, routes } = this.props
    return stop.transferPerformance && stop.transferPerformance.length
      ? <div>
        <ControlLabel>Rendimiento de transferencia</ControlLabel>
        <FormControl
          componentClass='select'
          defaultValue={0}
          onChange={this._onChangeSelect}>
          {stop.transferPerformance
            .map((summary, index) => {
              const fromRoute = routes.find(r => r.route_id === summary.fromRoute)
              const toRoute = routes.find(r => r.route_id === summary.toRoute)
              return (
                <option
                  key={index}
                  value={index}>
                  {fromRoute.route_short_name} to {toRoute.route_short_name}
                </option>
              )
            })
          }
        </FormControl>
        {this.renderTransferPerformanceResult(stop.transferPerformance[this.state.index])}
      </div>
      : <p>No se encontraron transferencias</p>
  }
}
