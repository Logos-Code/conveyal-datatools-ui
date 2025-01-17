// @flow

import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import { ButtonGroup, Tooltip, OverlayTrigger, Button } from 'react-bootstrap'

import * as activeActions from '../actions/active'
import * as editorActions from '../actions/editor'
import * as snapshotActions from '../actions/snapshots'
import {componentToText, entityIsNew} from '../util/objects'
import type {Entity, Feed} from '../../types'
import type {EditorTables} from '../../types/reducers'
import type {ImmutableList} from '../selectors/index'

import BulkEditorModal from './BulkEditorModal'

type State = {
  showBulkEditor: boolean
}

type Props = {
  activeComponent: string,
  activeEntity: Entity,
  approveGtfsDisabled: boolean,
  cloneGtfsEntity: typeof editorActions.cloneGtfsEntity,
  createSnapshot: typeof snapshotActions.createSnapshot,
  deleteGtfsEntity: typeof activeActions.deleteGtfsEntity,
  entities: Array<Entity>,
  feedSource: Feed,
  fromIndex: ?number,
  list: ImmutableList,
  newGtfsEntity: typeof editorActions.newGtfsEntity,
  patchTable: typeof editorActions.patchTable,
  setActiveEntity: typeof activeActions.setActiveEntity,
  showConfirmModal: ({body: string, onConfirm: () => void, title: string}) => void,
  tableData: EditorTables,
  toIndex: ?number,
  updateIndexes: (?number, ?number) => void
}

export default class EntityListButtons extends Component<Props, State> {
  state = {
    showBulkEditor: false
  }

  _onClickBulk = () => this.setState({showBulkEditor: true})

  _onCloseBulk = () => this.setState({showBulkEditor: false})

  _onClickClone = () => {
    const {activeComponent, activeEntity, cloneGtfsEntity, feedSource} = this.props
    if (activeEntity.id) {
      cloneGtfsEntity(feedSource.id, activeComponent, activeEntity.id)
    } else {
      console.warn('unable to clone entity since the activeEntity id is not defined')
    }
  }

  _onClickDelete = () => {
    const {
      activeComponent,
      activeEntity,
      deleteGtfsEntity,
      feedSource,
      fromIndex,
      list,
      setActiveEntity,
      showConfirmModal,
      toIndex,
      updateIndexes
    } = this.props
    // let fromIndex, toIndex
    const type = componentToText(activeComponent)
    if (activeEntity) {
      // Show modal and delete on confirmation
      showConfirmModal({
        title: `Eliminar ${type}?`,
        body: `¿Estás seguro de que quieres eliminar ${type}?`,
        onConfirm: () => {
          if (activeEntity.id) {
            deleteGtfsEntity(feedSource.id, activeComponent, activeEntity.id)
          } else {
            console.warn('unable to delete entity since the activeEntity id is not defined')
          }
          updateIndexes(fromIndex, toIndex)
          setActiveEntity(feedSource.id, activeComponent)
        }
      })
    } else if (typeof fromIndex === 'number' && typeof toIndex === 'number') {
      showConfirmModal({
        // FIXME: fix plural component text
        title: `Eliminar ${+toIndex - +fromIndex} ${type}s?`,
        body: `¿Estás seguro de que quieres eliminar ${toIndex - fromIndex} ${type}s?`,
        onConfirm: () => {
          for (var i = 0; i < list.length; i++) {
            if (list[i].isSelected) {
              // Delete selected entity
              deleteGtfsEntity(feedSource.id, activeComponent, list[i].id)
            }
          }
          updateIndexes(fromIndex, toIndex)
          setActiveEntity(feedSource.id, activeComponent)
        }
      })
    }
  }

  _onClickNew = () => {
    const {activeComponent, feedSource, newGtfsEntity} = this.props
    newGtfsEntity(feedSource.id, activeComponent)
  }

  render () {
    const {
      activeComponent,
      activeEntity,
      entities,
      feedSource,
      fromIndex,
      tableData
    } = this.props
    return (
      <div>
        <ButtonGroup
          className='pull-right'>
          <Button
            bsSize='small'
            // TODO: Enable for schedule exceptions?
            disabled={activeComponent === 'scheduleexception'}
            title={`Edición masiva de registros ${activeComponent}`}
            data-test-id={`bulk-${activeComponent}-button`}
            onClick={this._onClickBulk}>
            <Icon type='pencil' />
          </Button>
          <OverlayTrigger
            placement='bottom'
            overlay={
              <Tooltip id={`duplicate-${activeComponent}`}>
                Duplicar {componentToText(activeComponent)}
              </Tooltip>
            }>
            <Button
              bsSize='small'
              data-test-id={`clone-${activeComponent}-button`}
              disabled={!activeEntity}
              onClick={this._onClickClone}>
              <Icon type='clone' />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement='bottom'
            overlay={
              <Tooltip id={`delete-${activeComponent}`}>
                Eliminar {componentToText(activeComponent)}
              </Tooltip>
            }>
            <Button
              bsSize='small'
              data-test-id={`delete-${activeComponent}-button`}
              disabled={!activeEntity && typeof fromIndex === 'undefined'}
              onClick={this._onClickDelete}>
              <Icon type='trash' />
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
        {activeComponent === 'stop'
          ? <span className='small'>Haga clic con el botón derecho en el mapa para una nueva parada</span>
          : <Button
            bsSize='small'
            data-test-id={`new-${activeComponent}-button`}
            disabled={entities && entities.findIndex(entityIsNew) !== -1}
            onClick={this._onClickNew}
            // Setting the max width based on the width of the 'New Calendar' button
            // so the button does not move to a new line in deployed systems.
            // Note the width of the button text varies depending on the font used.
            style={{maxWidth: '95.375px'}}>
            Nuevo {componentToText(activeComponent)}
          </Button>
        }
        <BulkEditorModal
          activeComponent={activeComponent}
          approveGtfsDisabled={this.props.approveGtfsDisabled}
          createSnapshot={this.props.createSnapshot}
          feedSource={feedSource}
          onClose={this._onCloseBulk}
          patchTable={this.props.patchTable}
          show={this.state.showBulkEditor}
          tableData={tableData} />
      </div>
    )
  }
}
