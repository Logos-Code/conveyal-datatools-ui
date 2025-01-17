// @flow

import { Browser } from 'leaflet'

import type {TileLayerProps, MapLayer} from '../../types'

const DEFAULT_MAP_ID = 'mapbox/streets-v8'

/**
 * Default map layers for the GTFS editor. (Note: this is defined in the common
 * util file in order to keep all refs to mapbox IDs in a single file.)
 */
export const EDITOR_MAP_LAYERS: Array<MapLayer> = [
  {
    name: 'Streets',
    id: DEFAULT_MAP_ID
  },
  {
    name: 'Light',
    id: 'mapbox/light-v10'
  },
  {
    name: 'Dark',
    id: 'mapbox/dark-v10'
  },
  {
    name: 'Satellite',
    id: 'mapbox/satellite-streets-v11'
  }
]

/**
 * Get the default Mapbox tile URL used for use in a leaflet map. Optionally
 * takes a map ID (e.g., mapbox/outdoors-v11).
 */
export function defaultTileLayerProps (mapId: ?string): TileLayerProps {
  // If no mapId is provided, default to id defined in env.yml or, ultimately,
  // fall back on default value.
  const id = mapId || process.env.MAPBOX_MAP_ID || DEFAULT_MAP_ID
  const attribution = process.env.MAPBOX_ATTRIBUTION || `<a href="https://www.mapbox.com/about/maps/" target="_blank">&copy; Mapbox &copy; OpenStreetMap</a> <a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a>`
  const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error('Mapbox token not defined')
  }
  const url = `https://api.mapbox.com/styles/v1/${id}/tiles/{z}/{x}/{y}${Browser.retina ? '@2x' : ''}?access_token=${MAPBOX_ACCESS_TOKEN}`
  const retinaProps = Browser.retina
    ? {tileSize: 512, zoomOffset: -1}
    : {}
  return {
    attribution,
    url,
    maxZoom: 22
  }
}
