// @flow

import React, {Component} from 'react'
import {
  Col,
  ListGroup,
  ListGroupItem,
  Panel,
  Row
} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

import * as feedsActions from '../actions/feeds'
import {isExtensionEnabled} from '../../common/util/config'
import toSentenceCase from '../../common/util/to-sentence-case'
import type {Feed, Project} from '../../types'
import type {ManagerUserState} from '../../types/reducers'

import AutoPublishSettings from './AutoPublishSettings'
import ExternalPropertiesTable from './ExternalPropertiesTable'
import FeedTransformationSettings from './transform/FeedTransformationSettings'
import GeneralSettings from './GeneralSettings'

type Props = {
  activeComponent: string,
  activeSubComponent: string,
  confirmDeleteFeedSource: () => void,
  feedSource: Feed,
  project: Project,
  updateExternalFeedResource: typeof feedsActions.updateExternalFeedResource,
  updateFeedSource: typeof feedsActions.updateFeedSource,
  user: ManagerUserState
}

export default class FeedSourceSettings extends Component<Props> {
  render () {
    const {
      activeComponent,
      activeSubComponent,
      feedSource,
      project,
      updateExternalFeedResource,
      user
    } = this.props
    const disabled = user.permissions && !user.permissions.hasFeedPermission(
      project.organizationId, project.id, feedSource.id, 'manage-feed'
    )
    const isProjectAdmin = user.permissions && user.permissions.isProjectAdmin(
      project.id, project.organizationId
    )
    const resourceType = (activeComponent === 'settings' && activeSubComponent && activeSubComponent.toLowerCase()) || ''

    if (disabled) {
      return (
        <Row>
          <Col xs={6} mdOffset={3}>
            <p className='lead text-center'><strong>Advertencia!</strong> No tienes permiso para editar los detalles de este Feed source.</p>
          </Col>
        </Row>
      )
    }

    const tabs = [
      {
        condition: true,
        render: () => (
          <GeneralSettings
            confirmDeleteFeedSource={this.props.confirmDeleteFeedSource}
            disabled={disabled}
            feedSource={feedSource}
            project={project}
            updateFeedSource={this.props.updateFeedSource}
            user={user}
          />
        ),
        subPath: '',
        title: 'General'
      },
      {
        condition: true,
        render: () => (
          <FeedTransformationSettings
            disabled={disabled}
            feedSource={feedSource}
            project={project}
            updateFeedSource={this.props.updateFeedSource}
            user={user}
          />
        ),
        subPath: 'transformations',
        title: 'Feed Transformations'
      },
      {
        condition: isExtensionEnabled('mtc'),
        render: () => (
          <AutoPublishSettings
            disabled={disabled}
            feedSource={feedSource}
            updateFeedSource={this.props.updateFeedSource}
          />
        ),
        subPath: 'autopublish',
        title: 'Publicación automática'
      },
      ...Object.keys(feedSource.externalProperties || {}).map(resourceType => {
        const resourceLowerCase = resourceType.toLowerCase()
        return {
          condition: true,
          render: () => (
            <Col xs={7}>
              <ExternalPropertiesTable
                editingIsDisabled={disabled}
                feedSource={feedSource}
                isProjectAdmin={isProjectAdmin}
                resourceProps={feedSource.externalProperties
                  ? feedSource.externalProperties[resourceType]
                  : {}
                }
                resourceType={resourceType.toUpperCase()}
                updateExternalFeedResource={updateExternalFeedResource} />
            </Col>
          ),
          subPath: resourceLowerCase,
          title: `${toSentenceCase(resourceType)} propiedades`
        }
      })
    ]

    const activeTab = tabs.find(tab => resourceType === tab.subPath) || tabs[0]

    return (
      <Row>
        <Col xs={3}>
          {/* Side panel */}
          <Panel>
            <ListGroup fill>
              {tabs.map((tab, index) => {
                return (
                  <LinkContainer
                    active={resourceType === tab.subPath}
                    key={index}
                    to={`/feed/${feedSource.id}/settings${tab.subPath === '' ? '' : `/${tab.subPath}`}`}
                  >
                    <ListGroupItem>{tab.title}</ListGroupItem>
                  </LinkContainer>
                )
              })}
            </ListGroup>
          </Panel>
        </Col>
        <Col xs={6} />

        {activeTab.render()}
      </Row>
    )
  }
}
