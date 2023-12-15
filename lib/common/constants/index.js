// @flow

const SECURE: string = 'secure/'
export const API_PREFIX: string = `/api/manager/`
export const SECURE_API_PREFIX: string = `${API_PREFIX}${SECURE}`
export const GTFS_GRAPHQL_PREFIX: string = `${SECURE_API_PREFIX}gtfs/graphql`
export const EDITOR_PREFIX: string = `/api/editor/`
export const SECURE_EDITOR_PREFIX: string = `${EDITOR_PREFIX}${SECURE}`
export const DEFAULT_DESCRIPTION = 'Un centro de comando para administrar, editar, validar e implementar GTFS.'
export const DEFAULT_LOGO = 'https://d3oufy0f4ylur0.cloudfront.net/assets/img/wri-logo-512.png'
export const DEFAULT_LOGO_SMALL = 'https://d3oufy0f4ylur0.cloudfront.net/assets/img/wri-logo-128.png'
export const DEFAULT_TITLE = 'WRI - CONVEYAL - GTFS'

export const AUTO_DEPLOY_TYPES = Object.freeze({
  ON_FEED_FETCH: 'ON_FEED_FETCH',
  ON_PROCESS_FEED: 'ON_PROCESS_FEED'
})

export const FETCH_FREQUENCIES = Object.freeze({
  MINUTES: 'MINUTES',
  HOURS: 'HOURS',
  DAYS: 'DAYS'
})

export const FREQUENCY_INTERVALS = Object.freeze({
  [FETCH_FREQUENCIES.MINUTES]: [5, 10, 15, 30],
  [FETCH_FREQUENCIES.HOURS]: [1, 6, 12],
  [FETCH_FREQUENCIES.DAYS]: [1, 2, 7, 14]
})

export const RETRIEVAL_METHODS = Object.freeze({
  MANUALLY_UPLOADED: 'MANUALLY_UPLOADED',
  FETCHED_AUTOMATICALLY: 'FETCHED_AUTOMATICALLY',
  PRODUCED_IN_HOUSE: 'PRODUCED_IN_HOUSE',
  PRODUCED_IN_HOUSE_GTFS_PLUS: 'PRODUCED_IN_HOUSE_GTFS_PLUS',
  SERVICE_PERIOD_MERGE: 'SERVICE_PERIOD_MERGE',
  REGIONAL_MERGE: 'REGIONAL_MERGE',
  VERSION_CLONE: 'VERSION_CLONE'
})

export const FEED_TRANSFORMATION_TYPES = Object.freeze({
  DELETE_RECORDS: 'DeleteRecordsTransformation',
  NORMALIZE_FIELD: 'NormalizeFieldTransformation',
  REPLACE_FILE_FROM_STRING: 'ReplaceFileFromStringTransformation',
  REPLACE_FILE_FROM_VERSION: 'ReplaceFileFromVersionTransformation'
})
