import chalk from 'chalk';
import * as dotenv from 'dotenv'
import gradient from 'gradient-string';
dotenv.config()

import { inquirerMenu, leerInput, listarLugares, pausa } from './helpers/inquirer.js'
import { Busquedas } from './models/busquedas.js';

const orange = chalk.rgb(255, 192, 72)

const main = async () => {

    const busquedas = new Busquedas();
    
    let opt;

    while ( opt !== 0 ){

        opt = await inquirerMenu();
        
        const opciones = {
            1: buscarCiudad,
            2: mostrarHistorial
        }

        if ( opt !== 0 ) {
                await opciones[ opt ]( busquedas )
            }
        await pausa();

    }   

}

const buscarCiudad = async ( busquedas ) => {
    // mostrar mensajes

    // buscar los lugares lugar
    const term = await leerInput('Ciudad:')
    // seleccionar el lugar
    const lugares = await busquedas.ciudad( term )
    const id = await listarLugares( lugares )

    if (id === 0 ) return 


    
    const lugar = lugares.find( l => l.id === id )

    // Guardar en DB

    busquedas.agregarHistorial( lugar.nombre )

    // clima
    const clima = await busquedas.climaLugar(lugar.lat, lugar.lng)

    console.clear();
    console.log(gradient.pastel('Informacion de la ciudad\n'));
    console.log(chalk.cyan(`Ciudad: ${ orange( lugar.nombre ) }`));
    console.log(chalk.cyan(`Lat: ${ orange( lugar.lat ) }`));
    console.log(chalk.cyan(`Lng: ${ orange( lugar.lng ) }`));
    console.log(chalk.cyan(`Temperatura: ${ orange( clima.temp ) }`));
    console.log(chalk.cyan(`Minima: ${ orange( clima.min ) }`));
    console.log(chalk.cyan(`Maxima: ${ orange( clima.max ) }`));
    console.log(chalk.cyan(`Como esta el clima: ${ orange( clima.desc ) }`));
    console.log();

} 

const mostrarHistorial = async ( busquedas ) => {
    
    console.clear();
    console.log(gradient.morning('Historial\n'));
    // busquedas.historialCapitalicado.forEach( ( lugar, i) => {
    const history = busquedas.historialCapitalizado
    // console.log(history);
    
    history.forEach( ( lugar, i) => {
        const idx = chalk.green(`${ i + 1 }`)
        console.log(`${ idx }. ${ lugar }`);
    });
    // busquedas.historial.forEach( ( lugar, i) => {
    //     const idx = chalk.green(`${ i + 1 }`)
    //     console.log(`${ idx }. ${ lugar }`);
    // });
    console.log();

}

main();