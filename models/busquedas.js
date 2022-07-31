import axios from 'axios';
import fs, { readFileSync } from 'fs'

class Busquedas {
    historial = []
    dbPath = './db/database.json'

    constructor(){
        this.leerDB();
    }

    get historialCapitalizado() {
        
        // capitalizar cada palabra
        const historialCapitalicado = this.historial.map( busqueda => {
            let palabras = busqueda.split(' ')
            busqueda = palabras.map( p =>  p[0].toUpperCase() + p.slice(1)  )
            // console.log(busqueda);
            return busqueda.join(' ')
        })


        return historialCapitalicado
    }

    get paramsLocationiq() {
        return {
            'key': process.env.LOCATIONIQ_KEY,
            'limit': 5,
            'accept-language': 'es',
            'format': 'json'
        }
    }

    get paramsOpenWeather() {
        return {
            units: 'metric',
            lang: 'es',
            appid: process.env.OPENWEATHER_KEY
        }
    }

    async ciudad( lugar = '' ){

        try {
            // peticion http
            const instanceLocation = axios.create({
                baseURL: `https://us1.locationiq.com/v1/search.php?q=${ lugar }`,
                params: this.paramsLocationiq
            })

            const { data } = await instanceLocation.get();
    
            return data.map( lugar => ({
                id: lugar.place_id,
                nombre: lugar.display_name,
                lng: lugar.lon,
                lat: lugar.lat
            })) // regresa un arreglo de objetos
            // console.log(data);
            
            
        } catch (error) {
            return [];
        }

    }

    async climaLugar(lat, lon){
        try {
            

            const instanceWeather = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon},
            })

            const {data} = await instanceWeather.get()
            // resp.data

            return {
                desc: data.weather[0].description,
                min: data.main.temp_min,
                max: data.main.temp_max,
                temp: data.main.temp,
            }

        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial( lugar = '' ) {

        if ( this.historial.includes( lugar.toLocaleLowerCase() )) return 

        this.historial = this.historial.splice(0, 5)

        this.historial.unshift( lugar.toLocaleLowerCase() );

        // guardar en DB
        this.guardarDB()

    }

    guardarDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync( this.dbPath, JSON.stringify(payload) )
    }

    leerDB() {

        // 1. Debe de existir la base de datos

        if ( !fs.existsSync( this.dbPath ) ) return
        // 2. Cargar la info si existe
        const info =  readFileSync( this.dbPath,'utf-8')
        const { historial } = JSON.parse(info)
        this.historial = historial 

        // const info readfileSync path encoding: 'utf-9
        // fs.readFileSync( this.dbPath)

        // const data = JSON.parse(info)

        // this.historial = ...historial de la data

    }
}



export {
    Busquedas
} 