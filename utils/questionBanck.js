/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */

const MongoLib = require('../lib/mongoDB');
const chalk = require('chalk');
const debug = require('debug')('app:scripts:questions');

const uploadQuestion = [
  {
    pregunta: 'Ilustrar, dibujar y animar digitalmente.',
    area: 'arte y creatividad',
    numPregunta: 4,
  },
  {
    pregunta: 'Tocar un instrumento y componer música.',
    area: 'arte y creatividad',
    numPregunta: 9,
  },
  {
    pregunta: 'Diseñar logotipos y portadas de una revista.',
    area: 'arte y creatividad',
    numPregunta: 12,
  },
  {
    pregunta: 'Pintar, hacer esculturas, ilustrar libros de arte, etcétera.',
    area: 'arte y creatividad',
    numPregunta: 20,
  },

  {
    pregunta: 'Prepararse para ser modelo profesional.',
    area: 'arte y creatividad',
    numPregunta: 28,
  },
  {
    pregunta: 'Diseñar juegos interactivos electrónicos para computadora.',
    area: 'arte y creatividad',
    numPregunta: 31,
  },
  {
    pregunta: 'Redactar guiones y libretos para un programa de televisión.',
    area: 'arte y creatividad',
    numPregunta: 35,
  },
  {
    pregunta: 'Crear campañas publicitarias.',
    area: 'arte y creatividad',
    numPregunta: 39,
  },
  // area Ciencias sociales
  {
    pregunta: 'Realizar excavaciones para descubrir restos del pasado.',
    area: 'ciencias sociales',
    numPregunta: 6,
  },
  {
    pregunta: 'Organizar eventos y atender a sus asistentes.',
    area: 'ciencias sociales',
    numPregunta: 13,
  },
  {
    pregunta:
      'Defender a clientes individuales o empresas en juicios de diferente naturaleza.',
    area: 'ciencias sociales',
    numPregunta: 23,
  },
  {
    pregunta: 'Investigar las causas y efectos de los trastornos emocionales.',
    area: 'ciencias sociales',
    numPregunta: 25,
  },
  {
    pregunta: 'Escribir artículos periodísticos, cuentos, novelas y otros.',
    area: 'ciencias sociales',
    numPregunta: 34,
  },
  {
    pregunta: 'Estudiar la diversidad cultural en el ámbito rural y urbano.',
    area: 'ciencias sociales',
    numPregunta: 37,
  },
  {
    pregunta:
      'Gestionar y evaluar convenios internacionales de cooperación para el desarrollo social.',
    area: 'ciencias sociales',
    numPregunta: 38,
  },
  {
    pregunta:
      'Gestionar y evaluar proyectos de desarrollo en una institución educativa y/o fundación.',
    area: 'ciencias sociales',
    numPregunta: 42,
  },
  // económica,administrativa y financiera
  {
    pregunta:
      'Seleccionar, capacitar y motivar al personal de una organización o empresa.',
    area: 'económica,administrativa y financiera',
    numPregunta: 5,
  },
  {
    pregunta:
      'Planificar cuáles son las metas de una organización pública o privada a mediano y largo plazo.',
    area: 'económica,administrativa y financiera',
    numPregunta: 10,
  },
  {
    pregunta:
      'Controlar ingresos y egresos de fondos y presentar el balance final de una institución.',
    area: 'económica,administrativa y financiera',
    numPregunta: 15,
  },
  {
    pregunta:
      'Hacer propuestas y formular estrategias para aprovechar las relaciones económicas entre dos países.',
    area: 'económica,administrativa y financiera',
    numPregunta: 19,
  },
  {
    pregunta: 'Elaborar campañas para introducir un nuevo producto al mercado.',
    area: 'económica,administrativa y financiera',
    numPregunta: 21,
  },
  {
    pregunta: 'Supervisar las ventas de un centro comercial.',
    area: 'económica,administrativa y financiera',
    numPregunta: 26,
  },
  {
    pregunta: 'Aconsejar a las personas sobre planes de ahorro e inversiones.',
    area: 'económica,administrativa y financiera',
    numPregunta: 29,
  },
  {
    pregunta: 'Tener un negocio propio de tipo comercial.',
    area: 'económica,administrativa y financiera',
    numPregunta: 33,
  },
  // ciencia y tecnología
  {
    pregunta:
      'Diseñar programas de computación y explorar nuevas aplicaciones tecnológicas para uso del internet.',
    area: 'ciencia y tecnología',
    numPregunta: 1,
  },
  {
    pregunta: 'Resolver problemas de cálculo para construir un puente.',
    area: 'ciencia y tecnología',
    numPregunta: 7,
  },
  {
    pregunta:
      'Diseñar y planificar la producción masiva de artículos como muebles,autos, equipos de oficina, empaques y envases para alimentos y otros.',
    area: 'ciencia y tecnología',
    numPregunta: 11,
  },
  {
    pregunta: 'Concebir planos para viviendas, edificios y ciudadelas.',
    area: 'ciencia y tecnología',
    numPregunta: 17,
  },
  {
    pregunta: 'Investigar y probar nuevos productos farmacéuticos.',
    area: 'ciencia y tecnología',
    numPregunta: 18,
  },
  {
    pregunta: 'Diseñar máquinas que puedan simular actividades humanas.',
    area: 'ciencia y tecnología',
    numPregunta: 24,
  },
  {
    pregunta:
      'Elaborar mapas, planos e imágenes para el estudio y análisis de datos geográficos.',
    area: 'ciencia y tecnología',
    numPregunta: 30,
  },
  {
    pregunta: 'Dedicarse a fabricar productos alimenticios de consumo masivo.',
    area: 'ciencia y tecnología',
    numPregunta: 41,
  },
  // ciencias ecológicas,biológicas y de salud
  {
    pregunta: 'Criar, cuidar y tratar animales domésticos y de campo.',
    area: 'ciencias ecológicas,biológicas y de salud',
    numPregunta: 2,
  },
  {
    pregunta:
      'Investigar sobre áreas verdes, medioambiente y cambios climáticos.',
    area: 'ciencias ecológicas,biológicas y de salud',
    numPregunta: 3,
  },
  {
    pregunta:
      'Diseñar cursos para enseñar a la gente sobre temas de salud e higiene.',
    area: 'ciencias ecológicas,biológicas y de salud',
    numPregunta: 8,
  },
  {
    pregunta: 'Hacer experimentos con plantas (frutas, árboles, flores).',
    area: 'ciencias ecológicas,biológicas y de salud',
    numPregunta: 16,
  },
  {
    pregunta: 'Examinar y tratar los problemas visuales.',
    area: 'ciencias ecológicas,biológicas y de salud',
    numPregunta: 22,
  },
  {
    pregunta:
      'Atender y realizar ejercicios a personas que tienen limitaciones físicas, problemas de lenguaje, etc.',
    area: 'ciencias ecológicas,biológicas y de salud',
    numPregunta: 27,
  },
  {
    pregunta: 'Realizar el control de calidad de los alimentos.',
    area: 'ciencias ecológicas,biológicas y de salud',
    numPregunta: 32,
  },
];

const createQuestion = async (mongoDB, question) => {
  const { pregunta, area, numPregunta } = question;
  const questionId = await mongoDB.create('questionBank', {
    pregunta,
    area,
    numPregunta,
  });

  return questionId;
};

const seedQuestions = async () => {
  try {
    const mongoDB = new MongoLib();
    const promises = uploadQuestion.map(async (question) => {
      const questionId = await createQuestion(mongoDB, question);
      debug(chalk.green(`Se subio todo hdp, id :${questionId}`));
    });
    await Promise.all(promises);
    return process.exit(0);
  } catch (error) {
    debug(chalk.red(error));
    process.exit(1);
  }
};

seedQuestions();
