// @flow

import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Button} from 'react-bootstrap'
import Select from 'react-select'

import {getGtfsSpec, getGtfsPlusSpec, isModuleEnabled} from '../../../common/util/config'
import {getTransformationName, getTransformationPlaceholder} from '../../util/transform'
import type {
  Feed,
  FeedTransformation as FeedTransformationType,
  ReactSelectOption
} from '../../../types'

import NormalizeField from './NormalizeField'
import ReplaceFileFromString from './ReplaceFileFromString'
import ReplaceFileFromVersion from './ReplaceFileFromVersion'

type Props = {
  feedSource: Feed,
  index: number,
  onChange: (any, number) => void,
  onRemove: (number) => void,
  transformation: FeedTransformationType
}

// An index of UI components and validation checks for different transformation types.
// (All transformation types should be listed, but component and/or getValidationIssues for each are optional.)
const transformationTypes = {
  DeleteRecordsTransformation: {},
  NormalizeFieldTransformation: {
    component: NormalizeField
  },
  ReplaceFileFromStringTransformation: {
    component: ReplaceFileFromString
  },
  ReplaceFileFromVersionTransformation: {
    component: ReplaceFileFromVersion
  }
}

const TABLE_MUST_BE_DEFINED_ERROR = 'Table must be defined'

/**
 * Component that renders fields for one feed transformation
 * (e.g., ReplaceFileFromStringTransformation).
 */
export default class FeedTransformation extends Component<Props, {errors: Array<string>}> {
  state = {
    errors: []
  }

  componentDidUpdate (prevProps: Props) {
    // Update error state if props.transformation.table changed
    // and 'Table must be defined' no longer applies.
    const { table } = this.props.transformation
    if (table && prevProps.transformation.table !== table) {
      this.setState({ errors: this.state.errors.filter(e => e !== TABLE_MUST_BE_DEFINED_ERROR) })
    }
  }

  _getFieldsForType = (type: string) => {
    const {feedSource, index, onChange, transformation} = this.props
    const FieldsComponent = transformationTypes[type].component
    return FieldsComponent && (
      <FieldsComponent
        feedSource={feedSource}
        index={index}
        onSave={onChange}
        onValidationErrors={this._onValidationErrors}
        transformation={transformation}
      />
    )
  }

  _onValidationErrors = (errors: Array<string>) => {
    const issues: Array<string> = []
    if (!this.props.transformation.table) {
      issues.push(TABLE_MUST_BE_DEFINED_ERROR)
    }
    this.setState({ errors: issues.concat(errors) })
  }

  _onRemoveTransformation = () => {
    this.props.onRemove(this.props.index)
  }

  _onSelectTable = (tableOption: ReactSelectOption) => {
    // Set the table name, and also reset the fieldName of NormalizeFieldTransformations
    // to force the user to pick the table field.
    this.props.onChange({fieldName: null, table: tableOption.value}, this.props.index)
  }

  render () {
    const {feedSource, index, transformation} = this.props
    const tables = [...getGtfsSpec()].filter(t => !t.datatools)
    if (isModuleEnabled('gtfsplus')) tables.push(...getGtfsPlusSpec())
    const transformationType = transformation['@type']
    const {errors: validationIssues} = this.state
    const backgroundColor = validationIssues.length === 0
      ? '#f7f7f7'
      : '#ffdf68'

    return (
      <div style={{
        backgroundColor,
        padding: '2px 10px 10px 10px',
        marginBottom: '10px',
        border: '#ccc 1px solid',
        borderRadius: '10px'
      }}>
        <h5>
          <Button
            bsSize='xsmall'
            className='pull-right'
            onClick={this._onRemoveTransformation}>
            Eliminar paso
          </Button>
          Paso {index + 1} - {getTransformationName(transformationType, transformation, feedSource.feedVersionSummaries)}
        </h5>
        <div className='feed-transformation-body'>
          <Select
            style={{margin: '10px 0px', width: '230px'}}
            clearable={false}
            placeholder={getTransformationPlaceholder(transformationType, 'filePlaceholder')}
            options={tables.map(table => ({value: table.name.split('.txt')[0], label: table.name}))}
            value={transformation.table}
            onChange={this._onSelectTable} />
          {this._getFieldsForType(transformationType)}
          {validationIssues.length > 0
            ? <ul className='list-unstyled'>
              <Icon type='exclamation-triangle' /> <strong>Problemas de validación</strong>
              {validationIssues.map((issue, i) => {
                return (
                  <li style={{marginLeft: '10px'}} key={`issue-${i}`}>
                    {issue}
                  </li>
                )
              })}
            </ul>
            : null
          }
        </div>
      </div>
    )
  }
}
