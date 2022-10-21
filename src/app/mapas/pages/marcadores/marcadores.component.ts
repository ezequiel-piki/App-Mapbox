import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'

interface MarcadorColor{
  color  :string;
  marker?:mapboxgl.Marker;
  centro?:[number,number]
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
  .mapa-container{
    width:100%;
    height:100%;
    }
  .list-group{
    position:fixed;
    top:20px;
    right:20px;
    z-index:99;
  }  

  li{
    cursor:pointer;
  }
    
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapito') divMapito!:ElementRef;
  mapito!:mapboxgl.Map;
  zoomLevel : number = 15;
  centro: [number,number]= [-58.381571412099845 , -34.60367009136747]
  marcadores : MarcadorColor[]=[]
  constructor() { }

  ngAfterViewInit(): void {
    this.mapito = new mapboxgl.Map({

      container: this.divMapito.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',  
      center: this.centro,
      zoom:this.zoomLevel
    });
    
    /* const markerHtml : HTMLElement = document.createElement('div');
    markerHtml.innerHTML = 'Hola mundo'   */

   /*  new mapboxgl.Marker()
    .setLngLat(this.centro)
    .addTo(this.mapito) */
  this.leerLocalStorage();
    
  }

  irMarcador(marcador:mapboxgl.Marker){
    
    this.mapito.flyTo({ 
                        center:marcador.getLngLat()            
                       })
  }

  guardarMarcadoresLocalStorage(){
  const lngLatArr : MarcadorColor[] = [];

  
    this.marcadores.forEach((marcador)=>{
  const color =marcador.color;
  const {lng,lat} = marcador.marker!.getLngLat()
   
  lngLatArr.push({
    color:marcador.color,
    centro: [lng,lat],

  })

  })

  localStorage.setItem('marcadores',JSON.stringify(lngLatArr) )

  }

  leerLocalStorage(){
    if(!localStorage.getItem('marcadores')){
      return;
    }
    const lngLatArr :MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!)

    lngLatArr.forEach(m =>{
      const newMarker = new mapboxgl.Marker({
      color:m.color,
      draggable:true
      })
        .setLngLat(m.centro!)
        .addTo(this.mapito)

        this.marcadores.push({
          marker:newMarker,
          color:m.color
        });

        newMarker.on('dragend',
        () => {
               
                this.guardarMarcadoresLocalStorage();
        
              })


    });



    


  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    
    console.log(color);

    const nuevoMarcador = new mapboxgl.Marker({
                                               draggable:true,
                                               color
                                              })
                                                .setLngLat(this.centro)
                                                .addTo(this.mapito)

    this.marcadores.push({
                          color,
                          marker:nuevoMarcador
                         })

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
               
                                       this.guardarMarcadoresLocalStorage();
        
                                       })

  }

  borrarMarcador(i:number){
   this.marcadores[i].marker?.remove();
   this.marcadores.splice(i,1);
   this.guardarMarcadoresLocalStorage();
  }

}
