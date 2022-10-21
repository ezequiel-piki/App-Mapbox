import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
           `
          .mapa-container{width:100%;
          height:100%}
          .row{
            background-color:white;
            bottom:50px;
            left:50px;
            padding:10px;
            width: 400px;
            border-radius:5px;
            position:fixed;
            z-index:999;
          }
           ` ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('mapito') divMapito!:ElementRef;
  mapito!:mapboxgl.Map;
  zoomLevel : number = 10;
  centro: [number,number]= [-58.381571412099845 , -34.60367009136747]
  
  constructor() {}

  ngAfterViewInit(): void {  
  
    this.mapito = new mapboxgl.Map({

      container: this.divMapito.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',  
      center: this.centro,
      zoom:this.zoomLevel
    });

    this.mapito.on('zoom',(ev)=>{
      this.zoomLevel = this.mapito.getZoom();
    })

    this.mapito.on('zoomend',(ev)=>{
    if(this.mapito.getZoom() > 18 ){
      this.mapito.zoomTo( 18 )
    }    
    })

    /* Movimiento del Mapa */

    this.mapito.on('move',(event)=>{
      const target = event.target;
      const {lng,lat} = target.getCenter()
      this.centro = [lng,lat];
        })

  }

  ngOnDestroy(): void {
    this.mapito.off('zoom',()=>{})
    this.mapito.off('zoomend',()=>{})
    this.mapito.off('move',()=>{})
  
  }

  zoomIn(){

    this.mapito.zoomIn()
  }

  zoomOut(){
    this.mapito.zoomOut()
  
  }

  zoomCambio(valor:string){
  this.mapito.zoomTo(Number(valor))

  }

}
