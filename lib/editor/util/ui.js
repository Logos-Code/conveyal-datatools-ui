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
    label: 'Información de Feed'
  },
  {
    id: 'agencia',
    tableName: 'agency',
    icon: 'building',
    addable: true,
    title: 'Editar agencias',
    label: 'Agencias'
  },
  {
    id: 'ruta',
    tableName: 'routes',
    icon: 'bus',
    addable: true,
    title: 'Editar rutas',
    label: 'Rutas'
  },
  {
    id: 'parada',
    tableName: 'stops',
    icon: 'map-marker',
    addable: true,
    title: 'Editar paradas',
    label: 'Paradas'
  },
  {
    id: 'calendario',
    tableName: 'calendar',
    icon: 'calendar',
    addable: true,
    title: 'Editar calendarios',
    label: 'Calendarios'
  },
  {
    id: 'excepcionDeCalendario',
    tableName: 'scheduleexception',
    icon: 'ban',
    addable: true,
    hideSidebar: true,
    title: 'Editar excepciones de calendario',
    label: 'Excepciones de calendario'
  },
  {
    id: 'tarifa',
    tableName: 'fare',
    icon: 'ticket',
    addable: true,
    title: 'Editar tarifas',
    label: 'Tarifas'
  }
]
