import inquirer from 'inquirer';
import chalk from 'chalk';
import gradient from 'gradient-string'

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Que Desea hacer?',
        choices: [
            {
                value: 1,
                name: `${ chalk.yellow('1.') } Buscar ciudad`
            },
            {
                value: 2,
                name: `${ chalk.yellow('2.') } Historial`
            },
            {
                value: 0,
                name: `${ chalk.green('0.') } Salir`
            },
        ]
    }
]

const editarPreguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Que Desea hacer?',
        choices: [
            {
                value: 0,
                name: `${ '0.'.green } Cancelar`
            },
            {
                value: 1,
                name: `${ '1.'.yellow } Completar tarea(s)`
            },
            {
                value: 2,
                name: `${ '2.'.yellow } Eliminar Tarea`
            },
            {
                value: 3,
                name: `${ '3.'.yellow } Modificar Tarea`
            },
        ]
    }
];

const inquirerMenu = async () => {

    console.clear();
    const orange = chalk.rgb(230, 126, 34)
    console.log(orange('======================='));
    console.log(gradient.cristal('      Clima App        '));
    console.log(orange('======================='));
    // const gray = chalk.rgb(149, 165, 166)
    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;
}

const editarMenu = async () => {

    console.clear();
    console.log('======================='.green);
    console.log(' Selecione una opcion '.white);
    console.log('=======================\n'.green);
    const { opcion } = await inquirer.prompt(editarPreguntas);

    return opcion;
}

const pausa = async () => {

    await inquirer.prompt({
        type: 'input',
        name: 'enter',
        message: `Presione ${ chalk.magentaBright('ENTER') } para continuar`, 
    })

}

const leerInput = async ( message ) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if ( value.length === 0 ){
                    return chalk.red('Por favor ingrese un valor')
                }
                return true; 
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async ( lugares = [] ) => {

    const choices = lugares.map( (lugar, i )=>  {

        const idx = chalk.yellow(`${ i + 1 }.`)

        return {
            value: lugar.id,
            name: `${idx} ${ lugar.nombre }` 
        }
       
    });

    choices.unshift({
        value: 0,
        name: chalk.green(`0.`) + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione el lugar:',
            choices
        }
    ]
    
    const { id } = await inquirer.prompt(preguntas);

    return id;
}

const listadoTareasModificar = async ( tareas = [] ) => {

    const choices = tareas.map( (tarea, i )=>  {

        const idx = `${ i + 1 }.`.yellow

        return {
            value: tarea.id,
            name: `${idx} ${ tarea.desc}` 
        }
       
    });

    choices.unshift({
        value: 0,
        name: `0.`.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Modificar',
            choices
        }
    ]
    
    const { id } = await inquirer.prompt(preguntas);

    return id;
}

const confirmar = async ( message ) => {

    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt(pregunta);

    return ok;

}

const tareasCheckList = async ( tareas = [] ) => {

    const choices = tareas.map( (tarea, i ) =>  {

        const idx = `${ i + 1 }.`.yellow

        return {
            value: tarea.id,
            name: `${idx} ${ tarea.desc}`,
            checked: ( tarea.completadoEn ) ? true : false
        }
       
    });


    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ]
    
    const { ids } = await inquirer.prompt(pregunta);

    return ids;
}



export {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    tareasCheckList,
    editarMenu,
    listadoTareasModificar
}