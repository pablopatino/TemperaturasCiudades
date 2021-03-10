
const fs = require('fs')
const axios = require('axios');


class Busqueda{

    historial = []
    dbPath = './db/database.json'

    constructor(){
        this.leerBD();
    }

    get paramMapBox(){
        return {         
                'access_token': process.env.MAPBOX_KEY,
                'limit': 5,
                'language': 'es'      
        }

    }

    get getHistorialCapitalizado(){

        return this.historial.map( ciudad => {

            let palabra = ciudad.split(' ');
            palabra = palabra.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabra.join(' ')

        })  

    }


    get paramWeather(){
        return {       
                appid: process.env.WHETERMAP_KEY,
                units: 'metric',
                lang: 'es'
        }
    }

    async Buscarciudad( ciudad = '' ){

        try {
            
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ ciudad }.json`,
                params: this.paramMapBox

            })

            const resp = await intance.get();
            
            return resp.data.features.map( lugar => ({

                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                ltn: lugar.center[1]
                
            }));


             
         
        } catch (error) {
            throw error   
        }
        

    }

    async buscarClima( lat = '', lon='' ) {

    

        try {

            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramWeather, lat, lon}
            })
        
            const resp = await intance.get();

            const { temp, temp_min, temp_max } = resp.data.main
            

            return {
                temp,
                temp_min,
                temp_max
            }
            
        } catch (error) {
            console.log(error)
        }


    }

    agregarHistorial ( lugar = '' ){
    
        if (this.historial.includes( lugar.toLocaleLowerCase() )) {
            return
        }

        this.historial.unshift( lugar.toLocaleLowerCase() );

        this.guardarDB()

    }

    guardarDB(){

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) )

    }

    leerBD(){

        if (!fs.existsSync( this.dbPath )) {
            return;
        }
 
        const info = fs.readFileSync( this.dbPath, { encoding:'utf-8' } )
        const data = JSON.parse( info )

        this.historial = data.historial 

    }

}



module.exports = Busqueda