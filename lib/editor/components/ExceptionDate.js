// @flow

import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Button, FormGroup} from 'react-bootstrap'
import DateTimeField from 'react-bootstrap-datetimepicker'
import moment from 'moment'
import {toast} from 'react-toastify'

import {updateActiveGtfsEntity} from '../actions/active'
import type {ScheduleException} from '../../types'

type Props = {
  activeComponent: string,
  activeEntity: ScheduleException,
  date: number | string,
  index: number,
  updateActiveGtfsEntity: typeof updateActiveGtfsEntity,
  validationState: string
}

type State = {
    isDeleted: boolean,
    isDuplicate: boolean
}

export const inputStyleProps = {
  padding: 0,
  textAlign: 'center'
}

export default class ExceptionDate extends Component<Props, State> {
  _addRange = () => {
    const {activeComponent, activeEntity, index, updateActiveGtfsEntity} = this.props
    const dates = [...activeEntity.dates]

    const currentDate = dates[index]

    // A default range of 1 day is created
    dates.push(moment(currentDate).add(1, 'days').format('YYYYMMDD'))

    dates.sort((a, b) => moment(a).diff(moment(b))) // Sort before update for maintaining indices
    updateActiveGtfsEntity({
      component: activeComponent,
      entity: activeEntity,
      props: {dates}
    })
  }

  _onDateChange = (millis: number) => {
    const {activeComponent, activeEntity, index, updateActiveGtfsEntity} = this.props
    const dates = [...activeEntity.dates]
    const newDate = moment(+millis).format('YYYYMMDD')

    // Check if the date selected is already in an existing range.
    // Invalid date results from typing in the Datetimepicker component (which is valid as long as it resolves to a date)
    if (dates.some(date => date === newDate && date !== 'Invalid date')) {
      dates.splice(index, 1)
      toast.warn(
        `ⓘ Se ha eliminado la fecha. ¡La fecha ingresada ya está incluida en un rango existente o en una sola fecha!`,
        {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        }
      )
    } else dates[index] = newDate

    dates.sort((a, b) => moment(a).diff(moment(b)))
    updateActiveGtfsEntity({
      component: activeComponent,
      entity: activeEntity,
      props: {dates}
    })
  }

  _onRemoveDate = () => {
    const {activeComponent, activeEntity, index, updateActiveGtfsEntity} = this.props
    const dates = [...activeEntity.dates]
    dates.splice(index, 1)
    updateActiveGtfsEntity({
      component: activeComponent,
      entity: activeEntity,
      props: {dates: dates}
    })
  }

  render () {
    const {date, index, validationState} = this.props
    const dateTimeProps = {
      mode: 'date',
      dateTime: date ? +moment(date) : undefined,
      onChange: this._onDateChange,
      defaultText: undefined,
      size: 'sm'
    }

    if (!date) {
      dateTimeProps.defaultText = 'Seleccionar fecha'
    }
    return (
      <FormGroup
        className='exception-date-picker'
        key={index}
        style={{
          alignItems: 'center',
          display: 'grid',
          gap: 5,
          gridTemplateColumns: 'repeat(12, 1fr)',
          justifyContent: 'center',
          marginBottom: '5px',
          position: 'relative',
          textAlign: 'center'
        }}
        validationState={validationState}
      >
        <div style={{gridColumn: 'span 5'}}>
          <DateTimeField
            inputProps={{style: inputStyleProps}}
            key={`date-${index}`}
            mode='date'
            {...dateTimeProps}
          />
        </div>

        <Button
          data-test-id='exception-add-range'
          disabled={!date}
          onClick={this._addRange}
          style={{
            gridColumn: '7 / 12',
            height: '100%',
            lineHeight: 0,
            padding: '4'
          }}
        >
            Add range
        </Button>
        <Button
          bsStyle='danger'
          className='pull-right'
          key={`date-remove-${index}`}
          onClick={this._onRemoveDate}
          style={{
            alignSelf: 'center',
            gridColumn: '12',
            height: '100%',
            justifySelf: 'center',
            padding: '2px 7.5px'
          }}>
          <Icon type='times' />
        </Button>
        {validationState === 'error' && date
          ? <small style={{gridColumn: 'span 12'}}>
            {moment(date).format('MM/DD/YYYY')} aparece en otra excepción de horario. Por favor elige otra fecha.
          </small>
          : null
        }
      </FormGroup>
    )
  }
}
