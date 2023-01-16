// @flow

export type GtfsIcon = {
  addable: boolean,
  hideSidebar?: boolean,
  icon: string,
  id: string,
  label: string,
  tableName: string,
  title: string
}

export const GTFS_ICONS = [
  {
    id: 'feedinfo',
    tableName: 'feedinfo',
    icon: 'info',
    addable: false,
    title: 'Editar información de feed',
    label: 'Información de Feed',
    idName: 'informaciónDeFeed'
  },
  {
    id: 'agency',
    tableName: 'agency',
    icon: 'building',
    addable: true,
    title: 'Editar agencias',
    label: 'Agencias',
    idName: 'agencia'
  },
  {
    id: 'route',
    tableName: 'routes',
    icon: 'bus',
    addable: true,
    title: 'Editar rutas',
    label: 'Rutas',
    idName: 'ruta'
  },
  {
    id: 'stop',
    tableName: 'stops',
    icon: 'map-marker',
    addable: true,
    title: 'Editar paradas',
    label: 'Paradas',
    idName: 'parada'
  },
  {
    id: 'calendar',
    tableName: 'calendar',
    icon: 'calendar',
    addable: true,
    title: 'Editar calendarios',
    label: 'Calendarios',
    idName: 'calendario'
  },
  {
    id: 'scheduleexception',
    tableName: 'scheduleexception',
    icon: 'ban',
    addable: true,
    hideSidebar: true,
    title: 'Editar excepciones de calendario',
    label: 'Excepciones de calendario',
    idName: 'excepcionDeCalendario'
  },
  {
    id: 'fare',
    tableName: 'fare',
    icon: 'ticket',
    addable: true,
    title: 'Editar tarifas',
    label: 'Tarifas',
    idName: 'tarifa'
  }
]
