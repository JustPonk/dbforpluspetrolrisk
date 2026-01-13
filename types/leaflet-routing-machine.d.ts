declare module 'leaflet-routing-machine' {
  import * as L from 'leaflet';

  namespace Routing {
    interface RoutingControlOptions {
      waypoints?: L.LatLng[];
      router?: any;
      plan?: any;
      geocoder?: any;
      fitSelectedRoutes?: boolean;
      lineOptions?: {
        styles?: Array<{ color?: string; opacity?: number; weight?: number }>;
        extendToWaypoints?: boolean;
        missingRouteTolerance?: number;
      };
      routeLine?: (route: any, options: any) => L.Polyline;
      autoRoute?: boolean;
      routeWhileDragging?: boolean;
      routeDragInterval?: number;
      waypointMode?: string;
      useZoomParameter?: boolean;
      showAlternatives?: boolean;
      altLineOptions?: any;
      createMarker?: ((i: number, waypoint: any, n: number) => L.Marker | null) | null;
      addWaypoints?: boolean;
      draggableWaypoints?: boolean;
      collapsible?: boolean;
      show?: boolean;
      containerClassName?: string;
      units?: string;
      serviceUrl?: string;
      timeout?: number;
    }

    interface IControl extends L.Control {
      new(options?: RoutingControlOptions): IControl;
      setWaypoints(waypoints: L.LatLng[]): IControl;
      spliceWaypoints(index: number, waypointsToRemove: number, ...waypoints: L.LatLng[]): IControl;
      getPlan(): any;
      getRouter(): any;
      getWaypoints(): L.LatLng[];
      route(): void;
      on(event: string, handler: Function): IControl;
      off(event: string, handler: Function): IControl;
    }

    function control(options?: RoutingControlOptions): IControl;
  }

  export default Routing;
  export = Routing;
}
