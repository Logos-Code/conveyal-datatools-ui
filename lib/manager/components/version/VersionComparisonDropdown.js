// @flow

import React, {Component} from 'react'
import {MenuItem} from 'react-bootstrap'
import {connect} from 'react-redux'

import * as versionsActions from '../../actions/versions'
import type {Feed, FeedVersion, FeedVersionSummary} from '../../../types'

import VersionSelectorDropdown, {DefaultItemFormatter} from './VersionSelectorDropdown'

type Props = {
  comparedVersion?: FeedVersion,
  feedSource: Feed,
  setComparedVersion: typeof versionsActions.setComparedVersion,
  version: FeedVersion,
  versionSummaries: Array<FeedVersionSummary>
}

/**
 * Renders a dropdown selector for choosing a version with which to compare the
 * active version.
 */
class VersionComparisonDropdown extends Component<Props> {
  _onSelectComparedVersion = (index: number) => {
    const {comparedVersion, feedSource, setComparedVersion} = this.props
    const comparedVersionIndex = comparedVersion ? comparedVersion.version : -1
    // Note: index is 1-based (the menu item at index 0 is a caption).
    if (index !== comparedVersionIndex) {
      setComparedVersion(feedSource, index)
    }
  }

  _onClearComparedVersion = () => {
    this.props.setComparedVersion(this.props.feedSource, -1)
  }

  /**
   * This custom formatter adds and hides the active version in the list to
   * preserve version indexes.
   */
  itemFormatter = (itemVersion: FeedVersionSummary, activeVersion: ?FeedVersionSummary) => (
    this.props.version && itemVersion.id === this.props.version.id
      ? <MenuItem key={itemVersion.id} style={{display: 'none'}} />
      : DefaultItemFormatter(itemVersion, activeVersion)
  )

  render () {
    const {
      comparedVersion,
      versionSummaries
    } = this.props
    const title = comparedVersion
      ? `Comparando con la versión ${comparedVersion.version}`
      : 'Comparar versiones'

    return (
      <VersionSelectorDropdown
        dropdownProps={{
          id: 'prevVersionSelector',
          onSelect: this._onSelectComparedVersion
        }}
        extraOptions={comparedVersion && [{
          onClick: this._onClearComparedVersion,
          text: 'Salir del modo de comparación'
        }]}
        header={versionSummaries.length < 2
          ? 'Cargar otra versión para habilitar la comparación'
          : 'Seleccione una versión para comparar'
        }
        itemFormatter={this.itemFormatter}
        title={title}
        version={comparedVersion}
        versions={versionSummaries}
      />
    )
  }
}

const mapDispatchToProps = {
  setComparedVersion: versionsActions.setComparedVersion
}

export default connect(null, mapDispatchToProps)(VersionComparisonDropdown)
