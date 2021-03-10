require('dotenv').config()
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busqueda = require("./models/busqueda");

const main =  async () => {

    /* console.clear(); */

    const busqueda = new Busqueda();

    let opc = 0
    
    do {
        
    opc = await inquirerMenu();
    
    switch ( opc ) {
        case 1:

            const ciudadaBuscar = await leerInput('Ciudad: ')
            const ciudades = await busqueda.Buscarciudad(ciudadaBuscar)
            const id = await listarLugares( ciudades )
            if (id === '0') { continue }

            const lugarSel = ciudades.find( lugar => lugar.id === id );
            
            busqueda.agregarHistorial( lugarSel.nombre )
        
            
            const buscarClima = await busqueda.buscarClima( lugarSel.ltn, lugarSel.lng )
        
            console.log('Informacion de la ciudad')
            console.log(`Ciudad: ${lugarSel.nombre} `)
            console.log(`Lat: ${ lugarSel.ltn }`)
            console.log(`Lng: ${ lugarSel.lng } `)
            console.log(`Temperatura: ${ buscarClima.temp } Grados`)
            console.log(`Temperatura Max: ${ buscarClima.temp_max } Grados`)
            console.log(`Temperatura Min: ${ buscarClima.temp_min } Grados`)

        break;

        case 2:
            busqueda.getHistorialCapitalizado.forEach( (lugar, i ) => {

                console.log(`${ lugar }`)
            })
        break;

        case 0:
            break;
        default:
            break;
        }

        await pausa()
        
    } while ( opc !== 0 );
    

}


main()