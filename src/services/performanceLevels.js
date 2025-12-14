/**
 * ==========================================
 * 🎓 NUCLEUS Performance Levels System
 * Basado en el Marco de Referencia ICFES 2026
 * Diseño Centrado en Evidencias (DCE)
 * ==========================================
 * 
 * Sistema de niveles de desempeño alineado con la metodología
 * oficial del ICFES. Cada nivel describe competencias específicas
 * y evidencias observables según la Guía de Orientación Saber 11° 2026.
 */

// Configuración de niveles por área según ICFES
export const PERFORMANCE_LEVELS = {
    matematicas: {
        name: 'Matemáticas',
        icon: '🔢',
        color: 'from-rose-500 via-pink-500 to-fuchsia-600',
        totalQuestions: 50,
        competencies: {
            'Interpretación y Representación': '34%',
            'Formulación y Ejecución': '43%',
            'Argumentación': '23%'
        },
        levels: {
            1: {
                range: [0, 35],
                title: 'Nivel 1 - Interpretación Básica',
                badge: 'Básico',
                color: 'red',
                description: 'Comprende y transforma información cuantitativa básica presentada en formatos simples',
                competencies: [
                    'Lee datos explícitos en tablas, gráficas y esquemas simples',
                    'Realiza operaciones aritméticas básicas con números racionales',
                    'Reconoce figuras geométricas básicas (triángulos, círculos, paralelogramos)',
                    'Identifica relaciones lineales y afines en contextos cotidianos'
                ],
                syllabus: {
                    'Estadística': [
                        'Lectura directa de datos en tablas y gráficas',
                        'Promedio y rango estadístico',
                        'Conteos simples (suma y multiplicación)',
                        'Representación básica de datos'
                    ],
                    'Geometría': [
                        'Figuras básicas: triángulos, círculos, paralelogramos',
                        'Medidas básicas: perímetro y área por conteo',
                        'Sistemas de coordenadas cartesianas 2D',
                        'Paralelismo y ortogonalidad'
                    ],
                    'Álgebra y Cálculo': [
                        'Números racionales (fracciones, decimales, porcentajes)',
                        'Operaciones aritméticas básicas',
                        'Relaciones lineales simples',
                        'Razones de cambio básicas (velocidad)'
                    ]
                },
                recommendations: [
                    'Practicar lectura de tablas y gráficas de una sola entrada',
                    'Dominar operaciones con fracciones, decimales y porcentajes',
                    'Resolver problemas cotidianos de proporcionalidad directa',
                    'Calcular perímetros y áreas de figuras básicas por conteo'
                ]
            },
            2: {
                range: [36, 50],
                title: 'Nivel 2 - Transformación de Información',
                badge: 'Intermedio',
                color: 'amber',
                description: 'Transforma representaciones y ejecuta procedimientos rutinarios en contextos familiares',
                competencies: [
                    'Transforma información entre diferentes representaciones (tabla ↔ gráfica)',
                    'Comprende intersección, unión y contenencia de conjuntos',
                    'Aplica proporcionalidad directa y regla de tres simple',
                    'Calcula medidas de tendencia central (promedio, moda)'
                ],
                syllabus: {
                    'Estadística': [
                        'Transformación entre tablas y gráficas',
                        'Intersección, unión y contenencia de conjuntos',
                        'Medidas de tendencia central: promedio, moda',
                        'Noción de población, muestra e inferencia básica'
                    ],
                    'Geometría': [
                        'Diferenciación entre perímetro y área',
                        'Volúmenes de sólidos básicos (cubos, cilindros)',
                        'Desigualdad triangular',
                        'Transformaciones básicas (traslación)'
                    ],
                    'Álgebra y Cálculo': [
                        'Proporcionalidad directa e inversa',
                        'Regla de tres simple',
                        'Porcentajes y razones',
                        'Tasas de interés simples'
                    ]
                },
                recommendations: [
                    'Practicar conversión entre diferentes representaciones de datos',
                    'Resolver problemas de proporcionalidad en contextos reales',
                    'Dominar cálculo de promedios y análisis de frecuencias',
                    'Aplicar regla de tres en situaciones cotidianas'
                ]
            },
            3: {
                range: [51, 70],
                title: 'Nivel 3 - Formulación y Ejecución',
                badge: 'Satisfactorio',
                color: 'cyan',
                description: 'Plantea e implementa estrategias de solución para problemas que requieren múltiples pasos',
                competencies: [
                    'Diseña planes de solución para problemas complejos',
                    'Ejecuta procedimientos algorítmicos correctamente',
                    'Aplica teoremas clásicos (Pitágoras, Tales)',
                    'Interpreta y usa funciones en contextos diversos'
                ],
                syllabus: {
                    'Estadística': [
                        'Varianza y desviación estándar',
                        'Percentiles y mediana',
                        'Correlación básica',
                        'Combinaciones y permutaciones simples'
                    ],
                    'Geometría': [
                        'Teorema de Pitágoras y aplicaciones',
                        'Teorema de Tales',
                        'Congruencia y semejanza',
                        'Sólidos complejos (pirámides)',
                        'Transformaciones rígidas (rotación, reflexión)'
                    ],
                    'Álgebra y Cálculo': [
                        'Expresiones algebraicas',
                        'Ecuaciones lineales y sistemas 2x2',
                        'Funciones lineales y cuadráticas',
                        'Propiedades de funciones (dominio, rango)'
                    ]
                },
                recommendations: [
                    'Estudiar y aplicar el Teorema de Pitágoras en problemas reales',
                    'Practicar resolución de ecuaciones y sistemas lineales',
                    'Analizar funciones lineales y cuadráticas (gráficas y algebraicamente)',
                    'Resolver problemas de combinatoria básica'
                ]
            },
            4: {
                range: [71, 100],
                title: 'Nivel 4 - Argumentación y Validación',
                badge: 'Avanzado',
                color: 'emerald',
                description: 'Valida procedimientos, argumenta soluciones y trabaja con conceptos matemáticos avanzados',
                competencies: [
                    'Argumenta a favor o en contra de procedimientos matemáticos',
                    'Establece la validez de soluciones propuestas',
                    'Trabaja con funciones complejas (exponenciales, logarítmicas, trigonométricas)',
                    'Aplica técnicas avanzadas de conteo y probabilidad'
                ],
                syllabus: {
                    'Estadística': [
                        'Estimación del error estadístico',
                        'Análisis de correlación avanzada',
                        'Permutaciones y combinaciones complejas',
                        'Probabilidad condicional'
                    ],
                    'Geometría': [
                        'Coordenadas polares y tridimensionales',
                        'Transformaciones complejas (homotecia)',
                        'Geometría analítica avanzada',
                        'Polígonos complejos (n > 4 lados)'
                    ],
                    'Álgebra y Cálculo': [
                        'Funciones exponenciales y logarítmicas',
                        'Funciones trigonométricas y sus propiedades',
                        'Funciones racionales y polinomiales',
                        'Sucesiones y límites',
                        'Periodicidad y comportamiento asintótico'
                    ]
                },
                recommendations: [
                    'Estudiar propiedades de funciones exponenciales y logarítmicas',
                    'Dominar trigonometría y sus aplicaciones',
                    'Practicar análisis de validez de argumentos matemáticos',
                    'Resolver problemas de probabilidad condicional y conteo avanzado'
                ]
            }
        }
    },
    'lectura critica': {
        name: 'Lectura Crítica',
        icon: '📖',
        color: 'from-sky-500 via-blue-500 to-indigo-600',
        totalQuestions: 41,
        competencies: {
            'Identificar información local': '25%',
            'Relacionar e interpretar': '42%',
            'Evaluar y reflexionar': '33%'
        },
        textTypes: {
            'Continuos Literarios': '24%',
            'Continuos Filosóficos': '30%',
            'Continuos Informativos': '30%',
            'Discontinuos': '16%'
        },
        levels: {
            1: {
                range: [0, 35],
                title: 'Nivel 1 - Lectura Literal',
                badge: 'Básico',
                color: 'red',
                description: 'Identifica y entiende contenidos locales explícitos en el texto',
                competencies: [
                    'Entiende el significado de palabras y expresiones en contexto',
                    'Identifica eventos narrados explícitamente',
                    'Reconoce personajes, lugares y tiempos mencionados directamente',
                    'Responde preguntas de "quién", "cuándo", "dónde" textuales'
                ],
                syllabus: {
                    'Comprensión Literal': [
                        'Vocabulario de uso frecuente (500-1000 palabras)',
                        'Identificación de información explícita',
                        'Reconocimiento de personajes y eventos',
                        'Secuencia cronológica básica'
                    ],
                    'Tipos de Texto': [
                        'Textos narrativos simples (cuentos cortos)',
                        'Avisos y carteles',
                        'Instrucciones básicas',
                        'Textos informativos breves'
                    ]
                },
                recommendations: [
                    'Ampliar vocabulario con las 1000 palabras más frecuentes del español',
                    'Practicar extracción de datos explícitos en textos cortos',
                    'Leer textos narrativos simples identificando personajes y eventos',
                    'Ejercicios de comprensión literal con preguntas directas'
                ]
            },
            2: {
                range: [36, 50],
                title: 'Nivel 2 - Comprensión Global',
                badge: 'Intermedio',
                color: 'amber',
                description: 'Comprende la estructura formal y las relaciones entre partes del texto',
                competencies: [
                    'Comprende la función de párrafos y títulos',
                    'Identifica voces y situaciones en el texto (polifonía)',
                    'Comprende relaciones causa-efecto y oposición',
                    'Diferencia entre idea principal e ideas secundarias'
                ],
                syllabus: {
                    'Estructura Textual': [
                        'Función de párrafos y títulos',
                        'Conectores lógicos (adición, contraste, causa)',
                        'Referencia anafórica (pronombres)',
                        'Orden lógico de la oración (S-V-P)'
                    ],
                    'Comprensión Inferencial Básica': [
                        'Relaciones causa-efecto explícitas',
                        'Relaciones de oposición',
                        'Identificación de idea principal',
                        'Síntesis de párrafos'
                    ],
                    'Tipos de Texto': [
                        'Textos expositivos',
                        'Artículos periodísticos',
                        'Textos discontinuos (tablas, gráficas simples)',
                        'Narrativa de complejidad media'
                    ]
                },
                recommendations: [
                    'Analizar la función de conectores en textos expositivos',
                    'Practicar identificación de idea principal en párrafos',
                    'Estudiar estructura sintáctica y su efecto en el significado',
                    'Ejercicios de cohesión textual y referencia'
                ]
            },
            3: {
                range: [51, 65],
                title: 'Nivel 3 - Lectura Inferencial',
                badge: 'Satisfactorio',
                color: 'cyan',
                description: 'Relaciona e interpreta información implícita, identifica tesis y argumentos',
                competencies: [
                    'Identifica tesis y argumentos en textos expositivos',
                    'Relaciona elementos en textos discontinuos complejos',
                    'Deduce la intención comunicativa del autor',
                    'Reconoce el tono y la voz del narrador'
                ],
                syllabus: {
                    'Argumentación': [
                        'Identificación de tesis y argumentos',
                        'Estructura argumentativa básica',
                        'Tipos de argumentos (autoridad, ejemplificación)',
                        'Diferenciación entre hecho y opinión'
                    ],
                    'Inferencia': [
                        'Deducción de intenciones (informar, persuadir, entretener)',
                        'Interpretación de información implícita',
                        'Relaciones complejas entre partes del texto',
                        'Integración de textos discontinuos con continuos'
                    ],
                    'Tipos de Texto': [
                        'Columnas de opinión',
                        'Ensayos académicos',
                        'Textos filosóficos introductorios',
                        'Infografías complejas',
                        'Caricaturas políticas'
                    ]
                },
                recommendations: [
                    'Analizar columnas de opinión identificando tesis y argumentos',
                    'Practicar deducción de intenciones comunicativas',
                    'Interpretar mensajes implícitos en infografías y caricaturas',
                    'Estudiar diferencias entre narrador objetivo y subjetivo'
                ]
            },
            4: {
                range: [66, 100],
                title: 'Nivel 4 - Lectura Crítica e Intertextual',
                badge: 'Avanzado',
                color: 'emerald',
                description: 'Evalúa validez de argumentos, reconoce sesgos y establece relaciones intertextuales',
                competencies: [
                    'Establece validez e implicaciones de enunciados',
                    'Relaciona el texto con otros textos o marcos culturales',
                    'Reconoce contenidos valorativos y sesgos ideológicos',
                    'Identifica estrategias discursivas (ironía, sarcasmo)'
                ],
                syllabus: {
                    'Evaluación Crítica': [
                        'Falacias argumentativas (ad hominem, hombre de paja, generalización)',
                        'Validez de argumentos',
                        'Suficiencia de evidencia',
                        'Contraargumentos'
                    ],
                    'Intertextualidad': [
                        'Comparación de perspectivas entre textos',
                        'Relación con marcos culturales e históricos',
                        'Diálogo entre textos',
                        'Contextualización histórica y social'
                    ],
                    'Análisis Discursivo': [
                        'Estrategias retóricas (ironía, sarcasmo, metáfora)',
                        'Sesgos ideológicos',
                        'Intencionalidad oculta',
                        'Análisis de fuentes primarias y secundarias'
                    ],
                    'Filosofía': [
                        'Conceptos epistemológicos básicos',
                        'Conceptos éticos fundamentales',
                        'Estructura de argumentos filosóficos',
                        'Análisis de textos filosóficos densos'
                    ]
                },
                recommendations: [
                    'Estudiar falacias argumentativas comunes',
                    'Comparar textos con posturas opuestas sobre un tema',
                    'Aplicar conceptos filosóficos (ética, epistemología) a situaciones',
                    'Analizar cómo el contexto del autor influye en su discurso'
                ]
            }
        }
    },
    'ciencias naturales': {
        name: 'Ciencias Naturales',
        icon: '🔬',
        color: 'from-emerald-500 via-teal-500 to-cyan-600',
        totalQuestions: 58,
        competencies: {
            'Uso Comprensivo del Conocimiento': '30%',
            'Explicación de Fenómenos': '30%',
            'Indagación': '40%'
        },
        components: {
            'Biológico': '~25%',
            'Físico': '~25%',
            'Químico': '~25%',
            'CTS': '~25%'
        },
        levels: {
            1: {
                range: [0, 40],
                title: 'Nivel 1 - Reconocimiento de Datos',
                badge: 'Básico',
                color: 'red',
                description: 'Reconoce información explícita en formatos sencillos y asocia conceptos cotidianos',
                competencies: [
                    'Lee datos en tablas simples (temperatura, medidas)',
                    'Reconoce uso básico de instrumentos (balanza, termómetro)',
                    'Identifica conceptos cotidianos (ciclo del agua, partes de la planta)',
                    'Tiene noción intuitiva de fuerza y movimiento'
                ],
                syllabus: {
                    'Biológico': [
                        'Partes básicas de plantas y animales',
                        'Ciclo del agua',
                        'Funciones vitales básicas (respiración, nutrición)',
                        'Clasificación simple de seres vivos'
                    ],
                    'Físico': [
                        'Noción intuitiva de fuerza',
                        'Movimiento básico (rápido/lento)',
                        'Estados de la materia (sólido, líquido, gas)',
                        'Fuentes de energía cotidianas'
                    ],
                    'Químico': [
                        'Cambios de estado observables',
                        'Mezclas cotidianas',
                        'Propiedades observables (color, olor, textura)',
                        'Materiales comunes'
                    ],
                    'CTS': [
                        'Problemas ambientales obvios (basura, contaminación)',
                        'Recursos naturales básicos',
                        'Impacto humano visible en el ambiente'
                    ]
                },
                recommendations: [
                    'Practicar lectura de instrumentos básicos (termómetro, balanza)',
                    'Estudiar el ciclo del agua y la fotosíntesis básica',
                    'Identificar partes de plantas y animales',
                    'Ejercicios de observación y registro de datos simples'
                ]
            },
            2: {
                range: [41, 55],
                title: 'Nivel 2 - Asociación y Patrones',
                badge: 'Intermedio',
                color: 'amber',
                description: 'Identifica patrones, clasifica organismos y establece relaciones causa-efecto lineales',
                competencies: [
                    'Clasifica seres vivos en reinos básicos',
                    'Identifica cadenas tróficas simples (productor-consumidor)',
                    'Diferencia entre mezcla y sustancia pura',
                    'Comprende relación distancia-tiempo básica'
                ],
                syllabus: {
                    'Biológico': [
                        'Clasificación de seres vivos (reinos)',
                        'Cadenas tróficas simples',
                        'Funciones vitales (respiración, fotosíntesis)',
                        'Adaptaciones básicas de organismos'
                    ],
                    'Físico': [
                        'Relación distancia-tiempo',
                        'Concepto de fuerza como empuje o halón',
                        'Circuitos eléctricos simples (pila y bombillo)',
                        'Tipos de energía (cinética, potencial)'
                    ],
                    'Químico': [
                        'Estados de la materia y cambios de estado',
                        'Diferencia entre mezcla y sustancia pura',
                        'Métodos de separación (filtración, decantación)',
                        'Propiedades de la materia (masa, volumen)'
                    ],
                    'CTS': [
                        'Problemas ambientales locales',
                        'Reciclaje y manejo de residuos',
                        'Conservación de recursos',
                        'Tecnologías cotidianas'
                    ]
                },
                recommendations: [
                    'Estudiar clasificación de seres vivos y cadenas tróficas',
                    'Practicar métodos de separación de mezclas',
                    'Armar circuitos eléctricos simples',
                    'Analizar problemas ambientales locales'
                ]
            },
            3: {
                range: [56, 70],
                title: 'Nivel 3 - Explicación Teórica',
                badge: 'Satisfactorio',
                color: 'cyan',
                description: 'Usa teorías científicas para explicar fenómenos y relaciona múltiples variables',
                competencies: [
                    'Aplica genética Mendeliana (Cuadros de Punnett)',
                    'Usa la tabla periódica y comprende enlaces químicos',
                    'Aplica las Leyes de Newton a situaciones reales',
                    'Formula hipótesis a partir de datos experimentales'
                ],
                syllabus: {
                    'Biológico': [
                        'Genética Mendeliana (Cuadros de Punnett)',
                        'Dinámica de poblaciones y ecosistemas',
                        'Sistemas del cuerpo humano y homeostasis',
                        'Evolución y selección natural',
                        'Relaciones ecológicas (competencia, depredación)'
                    ],
                    'Físico': [
                        'Leyes de Newton (Dinámica)',
                        'Conservación de la energía mecánica',
                        'Termodinámica básica (calor vs temperatura)',
                        'Ondas y sonido',
                        'Cinemática (MRU, MRUA)'
                    ],
                    'Químico': [
                        'Tabla periódica y propiedades periódicas',
                        'Enlaces químicos (iónico, covalente, metálico)',
                        'Estequiometría básica (balanceo de ecuaciones)',
                        'Soluciones y pH',
                        'Reacciones químicas básicas'
                    ],
                    'Indagación': [
                        'Formulación de hipótesis',
                        'Interpretación de gráficas de tendencias',
                        'Diferenciación entre evidencia y conclusión',
                        'Variables dependientes e independientes'
                    ]
                },
                recommendations: [
                    'Resolver problemas de genética con cuadros de Punnett',
                    'Balancear ecuaciones químicas y calcular estequiometría',
                    'Aplicar las tres Leyes de Newton a situaciones cotidianas',
                    'Diseñar experimentos simples identificando variables'
                ]
            },
            4: {
                range: [71, 100],
                title: 'Nivel 4 - Modelación Experimental',
                badge: 'Avanzado',
                color: 'emerald',
                description: 'Diseña experimentos, analiza validez de conclusiones y aplica modelos complejos',
                competencies: [
                    'Controla variables experimentales (dependiente, independiente, controlada)',
                    'Aplica equilibrio químico (Principio de Le Chatelier)',
                    'Comprende mecánica de fluidos (Arquímedes, Pascal)',
                    'Evalúa impacto ambiental de tecnologías desde múltiples perspectivas'
                ],
                syllabus: {
                    'Biológico': [
                        'Genética avanzada (herencia ligada al sexo, codominancia)',
                        'Biotecnología y transgénicos',
                        'Evolución molecular',
                        'Ecología de ecosistemas complejos',
                        'Conservación de energía en sistemas vivos'
                    ],
                    'Físico': [
                        'Mecánica de fluidos (Arquímedes, Pascal)',
                        'Electromagnetismo (Inducción, campos)',
                        'Óptica geométrica',
                        'Termodinámica avanzada',
                        'Campo gravitacional'
                    ],
                    'Químico': [
                        'Equilibrio químico (Principio de Le Chatelier)',
                        'Cinética química',
                        'Gases ideales (Ley de los gases)',
                        'Química orgánica básica (grupos funcionales)',
                        'Estequiometría avanzada'
                    ],
                    'Indagación Avanzada': [
                        'Diseño experimental completo',
                        'Control de variables',
                        'Análisis de error experimental',
                        'Evaluación de suficiencia de datos',
                        'Comunicación de resultados científicos'
                    ],
                    'CTS Crítico': [
                        'Evaluación de impacto ambiental de tecnologías',
                        'Análisis costo-beneficio de intervenciones',
                        'Perspectivas múltiples (económica, social, ambiental)',
                        'Dilemas éticos en ciencia (transgénicos, clonación)'
                    ]
                },
                recommendations: [
                    'Diseñar experimentos controlando todas las variables',
                    'Aplicar el Principio de Le Chatelier a equilibrios químicos',
                    'Estudiar inducción electromagnética y sus aplicaciones',
                    'Analizar impacto de tecnologías desde perspectivas múltiples'
                ]
            }
        }
    },
    'sociales y ciudadanas': {
        name: 'Sociales y Ciudadanas',
        icon: '🌍',
        color: 'from-amber-500 via-orange-500 to-red-600',
        totalQuestions: 50,
        competencies: {
            'Pensamiento Social': '30%',
            'Interpretación y Análisis de Perspectivas': '40%',
            'Pensamiento Reflexivo y Sistémico': '30%'
        },
        levels: {
            1: {
                range: [0, 40],
                title: 'Nivel 1 - Nociones Básicas',
                badge: 'Básico',
                color: 'red',
                description: 'Reconoce derechos fundamentales, normas básicas y ubicación geográfica',
                competencies: [
                    'Identifica derechos fundamentales (vida, libertad, igualdad)',
                    'Conoce normas de convivencia básicas',
                    'Ubica a Colombia geográficamente (departamentos, límites)',
                    'Reconoce símbolos patrios y fechas cívicas'
                ],
                syllabus: {
                    'Constitución': [
                        'Derechos fundamentales básicos',
                        'Deberes ciudadanos',
                        'Normas de convivencia escolar',
                        'Normas de tránsito básicas'
                    ],
                    'Geografía': [
                        'Ubicación de Colombia en el mundo',
                        'Departamentos y capitales',
                        'Límites geográficos',
                        'Regiones naturales básicas'
                    ],
                    'Historia': [
                        'Fechas cívicas importantes',
                        'Símbolos patrios',
                        'Personajes históricos básicos',
                        'Eventos históricos fundamentales'
                    ]
                },
                recommendations: [
                    'Estudiar la Declaración Universal de Derechos Humanos',
                    'Memorizar mapa político de Colombia',
                    'Revisar manual de convivencia escolar',
                    'Identificar derechos y deberes ciudadanos básicos'
                ]
            },
            2: {
                range: [41, 55],
                title: 'Nivel 2 - Institucionalidad',
                badge: 'Intermedio',
                color: 'amber',
                description: 'Comprende la estructura del Estado y conceptos sociales básicos',
                competencies: [
                    'Conoce las ramas del poder público (Ejecutiva, Legislativa, Judicial)',
                    'Identifica mecanismos de participación (Tutela, Voto, Referendo)',
                    'Comprende conceptos básicos (inflación, PIB, democracia)',
                    'Relaciona eventos históricos con su contexto temporal'
                ],
                syllabus: {
                    'Constitución de 1991': [
                        'Ramas del poder público',
                        'Organismos de control (Procuraduría, Contraloría)',
                        'Mecanismos de participación ciudadana',
                        'Estado Social de Derecho'
                    ],
                    'Historia de Colombia S. XIX': [
                        'Independencia de Colombia',
                        'Formación de partidos políticos',
                        'Guerras civiles del S. XIX',
                        'Constituciones históricas'
                    ],
                    'Geografía Física': [
                        'Pisos térmicos',
                        'Regiones naturales y sus recursos',
                        'Hidrografía colombiana',
                        'Relieve y clima'
                    ],
                    'Conceptos Económicos': [
                        'Inflación básica',
                        'PIB (concepto)',
                        'Sectores económicos',
                        'Recursos renovables y no renovables'
                    ]
                },
                recommendations: [
                    'Estudiar la Constitución de 1991 (estructura básica)',
                    'Conocer funciones de las tres ramas del poder',
                    'Repasar proceso de Independencia de Colombia',
                    'Identificar recursos naturales por región'
                ]
            },
            3: {
                range: [56, 70],
                title: 'Nivel 3 - Contextualización y Análisis',
                badge: 'Satisfactorio',
                color: 'cyan',
                description: 'Analiza problemáticas reconociendo actores, intereses y contextos históricos',
                competencies: [
                    'Analiza conflictos identificando actores e intereses',
                    'Contextualiza fuentes primarias en su época',
                    'Evalúa sesgos y limitaciones de fuentes',
                    'Comprende perspectivas de diferentes actores sociales'
                ],
                syllabus: {
                    'Historia de Colombia S. XX': [
                        'Hegemonía conservadora',
                        'República Liberal',
                        'La Violencia (1948-1958)',
                        'Frente Nacional',
                        'Narcotráfico y conflicto armado',
                        'Constituyente de 1991'
                    ],
                    'Historia Universal': [
                        'Revoluciones Industriales',
                        'Guerras Mundiales (causas y consecuencias)',
                        'Guerra Fría',
                        'Dictaduras en América Latina',
                        'Globalización'
                    ],
                    'Competencias Ciudadanas': [
                        'Análisis de conflictos (identificar intereses)',
                        'Discriminación y exclusión social',
                        'Participación democrática',
                        'Resolución pacífica de conflictos'
                    ],
                    'Geografía Humana': [
                        'Demografía y migración',
                        'Urbanización',
                        'Sectores económicos',
                        'Desarrollo regional'
                    ],
                    'Análisis de Fuentes': [
                        'Fuentes primarias vs secundarias',
                        'Contextualización histórica',
                        'Identificación de sesgos',
                        'Evaluación de credibilidad'
                    ]
                },
                recommendations: [
                    'Analizar causas y consecuencias del Frente Nacional',
                    'Estudiar impacto de la Guerra Fría en América Latina',
                    'Identificar actores en conflictos sociales actuales',
                    'Practicar análisis de fuentes históricas'
                ]
            },
            4: {
                range: [71, 100],
                title: 'Nivel 4 - Pensamiento Sistémico',
                badge: 'Avanzado',
                color: 'emerald',
                description: 'Evalúa soluciones, analiza modelos conceptuales y comprende interdependencia dimensional',
                competencies: [
                    'Analiza problemas desde dimensiones múltiples (política, económica, ambiental)',
                    'Evalúa efectos no intencionados de políticas públicas',
                    'Comprende modelos conceptuales (Neoliberalismo, Globalización)',
                    'Identifica sesgos ideológicos en discursos'
                ],
                syllabus: {
                    'Pensamiento Sistémico': [
                        'Análisis multidimensional de problemas',
                        'Efectos no intencionados de políticas',
                        'Relaciones entre dimensiones (política-economía-ambiente)',
                        'Pensamiento complejo'
                    ],
                    'Modelos Conceptuales': [
                        'Estado Social de Derecho (profundización)',
                        'Neoliberalismo vs Proteccionismo',
                        'Globalización y sus efectos',
                        'Desarrollo Sostenible',
                        'Modelos económicos comparados'
                    ],
                    'Evaluación Crítica de Fuentes': [
                        'Contrastación de fuentes múltiples',
                        'Identificación de sesgos ideológicos',
                        'Análisis de propaganda política',
                        'Evaluación de argumentos en debates públicos'
                    ],
                    'Problemas Contemporáneos': [
                        'Desigualdad y pobreza',
                        'Cambio climático y política ambiental',
                        'Conflictos armados contemporáneos',
                        'Migración y refugiados',
                        'Derechos humanos en contextos complejos'
                    ],
                    'Análisis de Políticas': [
                        'Evaluación costo-beneficio',
                        'Impacto social de políticas económicas',
                        'Políticas ambientales',
                        'Reformas institucionales'
                    ]
                },
                recommendations: [
                    'Analizar políticas públicas desde dimensiones múltiples',
                    'Estudiar modelos económicos y sus implicaciones sociales',
                    'Contrastar fuentes primarias y secundarias sobre eventos',
                    'Identificar sesgos ideológicos en discursos políticos'
                ]
            }
        }
    },
    ingles: {
        name: 'Inglés',
        icon: '🌐',
        color: 'from-purple-500 via-violet-500 to-indigo-600',
        totalQuestions: 55,
        framework: 'Marco Común Europeo de Referencia (MCER)',
        parts: {
            'Parte 1': { questions: 6, level: 'Pre-A1/A1', skill: 'Vocabulario básico' },
            'Parte 2': { questions: 6, level: 'A1', skill: 'Pragmática contextual' },
            'Parte 3': { questions: 6, level: 'A1-A2', skill: 'Funciones comunicativas' },
            'Parte 4': { questions: 10, level: 'A2', skill: 'Gramática básica' },
            'Parte 5': { questions: 9, level: 'A2-B1', skill: 'Lectura literal' },
            'Parte 6': { questions: 6, level: 'B1', skill: 'Lectura inferencial' },
            'Parte 7': { questions: 12, level: 'B1+', skill: 'Gramática/Léxico avanzado' }
        },
        levels: {
            1: {
                range: [0, 47],
                title: 'Pre-A1 / A1 - Acceso Léxico',
                badge: 'Básico',
                color: 'red',
                description: 'Vocabulario temático básico y comprensión de avisos simples',
                competencies: [
                    'Vocabulario temático: familia, ropa, alimentos, cuerpo humano',
                    'Asociación pragmática de avisos con lugares',
                    'Descripciones simples (definición-palabra)',
                    'Presente simple (to be, to have)'
                ],
                syllabus: {
                    'Vocabulario Temático': [
                        'Familia y relaciones',
                        'Ropa y accesorios',
                        'Alimentos y bebidas',
                        'Cuerpo humano',
                        'Casa y muebles',
                        'Escuela y útiles',
                        'Profesiones básicas',
                        'Transporte',
                        'Colores, números, días, meses'
                    ],
                    'Gramática Básica': [
                        'Presente simple (to be, to have)',
                        'Artículos (a, an, the)',
                        'Pronombres personales',
                        'Imperativos',
                        'Preposiciones de lugar (in, on, at)',
                        'Singular y plural'
                    ],
                    'Funciones': [
                        'Saludos y despedidas',
                        'Presentarse',
                        'Dar información personal básica',
                        'Pedir y dar direcciones simples'
                    ]
                },
                recommendations: [
                    'Memorizar vocabulario temático básico (500-1000 palabras)',
                    'Practicar asociación de avisos con lugares',
                    'Estudiar presente simple y sus usos',
                    'Ejercicios de preposiciones de lugar'
                ]
            },
            2: {
                range: [48, 57],
                title: 'A2 - Interacción Cotidiana',
                badge: 'Intermedio',
                color: 'amber',
                description: 'Conversaciones de supervivencia y lectura literal de textos cortos',
                competencies: [
                    'Estructura pregunta-respuesta en diálogos cotidianos',
                    'Presente continuo y pasado simple',
                    'Comparativos y superlativos',
                    'Lectura de textos descriptivos cortos'
                ],
                syllabus: {
                    'Gramática Intermedia': [
                        'Presente continuo',
                        'Pasado simple (regulares e irregulares)',
                        'Futuro (going to / will)',
                        'Comparativos y superlativos',
                        'Modales básicos (can, must, should)',
                        'There is / There are'
                    ],
                    'Vocabulario Expandido': [
                        'Actividades de tiempo libre',
                        'Viajes y turismo',
                        'Salud y medicina básica',
                        'Compras y dinero',
                        'Clima y estaciones',
                        'Tecnología cotidiana'
                    ],
                    'Funciones Comunicativas': [
                        'Hacer invitaciones',
                        'Dar y pedir consejos',
                        'Expresar preferencias',
                        'Hablar de experiencias pasadas',
                        'Hacer planes futuros'
                    ],
                    'Lectura': [
                        'Textos descriptivos cortos',
                        'Narrativas simples',
                        'Anuncios y avisos',
                        'Correos electrónicos básicos'
                    ]
                },
                recommendations: [
                    'Practicar diálogos de situaciones cotidianas',
                    'Dominar verbos irregulares en pasado (top 100)',
                    'Estudiar modales básicos y sus usos',
                    'Leer textos cortos con preguntas literales'
                ]
            },
            3: {
                range: [58, 67],
                title: 'B1 - Independencia',
                badge: 'Satisfactorio',
                color: 'cyan',
                description: 'Lectura inferencial y gramática intermedia-alta',
                competencies: [
                    'Comprende textos de mayor longitud y complejidad',
                    'Identifica actitud, tono e intención del autor',
                    'Presente perfecto y pasado perfecto',
                    'Voz pasiva y condicionales (0, 1, 2)'
                ],
                syllabus: {
                    'Gramática Avanzada': [
                        'Presente perfecto vs pasado simple',
                        'Pasado perfecto',
                        'Voz pasiva (presente y pasado)',
                        'Condicionales tipo 0, 1, 2',
                        'Relative clauses (who, which, that)',
                        'Used to / Would (hábitos pasados)'
                    ],
                    'Vocabulario Académico': [
                        'Educación y aprendizaje',
                        'Medio ambiente',
                        'Ciencia y tecnología',
                        'Cultura y sociedad',
                        'Phrasal verbs comunes (50-100)'
                    ],
                    'Lectura Inferencial': [
                        'Artículos de revistas',
                        'Textos informativos complejos',
                        'Narrativas con estructura compleja',
                        'Identificación de tono y actitud',
                        'Inferencia de significados'
                    ],
                    'Conectores': [
                        'Adición (moreover, furthermore)',
                        'Contraste (however, although)',
                        'Causa-efecto (therefore, because of)',
                        'Secuencia (firstly, finally)'
                    ]
                },
                recommendations: [
                    'Leer artículos de revistas juveniles en inglés',
                    'Practicar presente perfecto vs pasado simple',
                    'Estudiar voz pasiva en diferentes tiempos',
                    'Dominar condicionales tipo 0, 1 y 2'
                ]
            },
            4: {
                range: [68, 78],
                title: 'B1+ - Competencia Intermedia Alta',
                badge: 'Intermedio-Alto',
                color: 'blue',
                description: 'Gramática avanzada y vocabulario académico amplio',
                competencies: [
                    'Condicional tipo 3 y mixtos',
                    'Estilo indirecto (reported speech)',
                    'Conectores lógicos complejos',
                    'Vocabulario académico especializado'
                ],
                syllabus: {
                    'Gramática Compleja': [
                        'Condicional tipo 3',
                        'Condicionales mixtos',
                        'Reported speech (cambios de tiempo)',
                        'Wish / If only',
                        'Inversión (Rarely, Never)',
                        'Subjuntivo básico'
                    ],
                    'Vocabulario Avanzado': [
                        'Términos técnicos por campos',
                        'Phrasal verbs avanzados (100+)',
                        'Expresiones idiomáticas',
                        'Colocaciones académicas',
                        'Vocabulario abstracto'
                    ],
                    'Conectores Complejos': [
                        'Although, even though, despite',
                        'However, nevertheless, nonetheless',
                        'Unless, provided that, as long as',
                        'In order to, so as to, so that'
                    ],
                    'Lectura Avanzada': [
                        'Textos académicos',
                        'Artículos de opinión',
                        'Ensayos argumentativos',
                        'Textos científicos divulgativos'
                    ]
                },
                recommendations: [
                    'Practicar reported speech con todos los cambios de tiempo',
                    'Estudiar conectores complejos y su uso apropiado',
                    'Ampliar vocabulario con términos técnicos',
                    'Dominar phrasal verbs más comunes (top 150)'
                ]
            },
            5: {
                range: [79, 100],
                title: 'B+ - Competencia Avanzada',
                badge: 'Avanzado',
                color: 'emerald',
                description: 'Lectura de textos auténticos académicos y dominio gramatical completo',
                competencies: [
                    'Comprende textos académicos complejos',
                    'Analiza críticamente argumentos en inglés',
                    'Domina todas las estructuras gramaticales',
                    'Vocabulario extenso y especializado (3000+ palabras)'
                ],
                syllabus: {
                    'Gramática Completa': [
                        'Todas las estructuras de B1+',
                        'Matices de modales (may/might/could)',
                        'Estructuras enfáticas',
                        'Cleft sentences',
                        'Inversión completa',
                        'Subjuntivo avanzado'
                    ],
                    'Vocabulario Especializado': [
                        'Vocabulario académico (AWL - Academic Word List)',
                        'Términos técnicos por disciplinas',
                        'Expresiones idiomáticas avanzadas',
                        'Colocaciones complejas',
                        'Registro formal vs informal'
                    ],
                    'Lectura Crítica': [
                        'Artículos científicos',
                        'Ensayos filosóficos',
                        'Literatura contemporánea',
                        'Análisis de argumentos',
                        'Evaluación de fuentes'
                    ],
                    'Escritura Académica': [
                        'Estructura de ensayos',
                        'Argumentación en inglés',
                        'Citación y paráfrasis',
                        'Registro académico'
                    ]
                },
                recommendations: [
                    'Leer artículos científicos y ensayos académicos en inglés',
                    'Practicar análisis crítico de textos argumentativos',
                    'Dominar estructuras gramaticales avanzadas',
                    'Ampliar vocabulario especializado por campos de interés'
                ]
            }
        }
    }
};

/**
 * Obtiene el nivel de desempeño para un área y puntaje dado
 */
export function getPerformanceLevel(areaName, score) {
    if (!areaName) return null;

    // 1. Normalize Area Name
    const normalizedName = areaName.toLowerCase();
    const configKey = Object.keys(PERFORMANCE_LEVELS).find(k =>
        k.toLowerCase() === normalizedName ||
        PERFORMANCE_LEVELS[k].name.toLowerCase() === normalizedName
    );

    const areaConfig = PERFORMANCE_LEVELS[configKey];
    if (!areaConfig) return null;

    const numericScore = parseFloat(score);

    // 2. Find Level
    // Sort levels to check in order (just in case)
    const levels = Object.entries(areaConfig.levels).sort((a, b) => Number(a[0]) - Number(b[0]));

    for (const [levelNum, levelData] of levels) {
        const [min, max] = levelData.range;

        // Standard Range Check
        if (numericScore >= min && numericScore <= max) {
            return {
                level: parseInt(levelNum),
                ...levelData,
                areaName: areaConfig.name,
                areaIcon: areaConfig.icon,
                areaColor: areaConfig.color,
                totalQuestions: areaConfig.totalQuestions,
                competencies: areaConfig.competencies
            };
        }
    }

    // 3. Handle Edge Cases (Score > Max Range, e.g. 100+)
    // If no level matched, checking if score is higher than max of last level
    const lastLevelEntry = levels[levels.length - 1];
    if (lastLevelEntry) {
        const [lastLevelNum, lastLevelData] = lastLevelEntry;
        const [_, max] = lastLevelData.range;

        if (numericScore > max) {
            return {
                level: parseInt(lastLevelNum),
                ...lastLevelData,
                areaName: areaConfig.name,
                areaIcon: areaConfig.icon,
                areaColor: areaConfig.color,
                totalQuestions: areaConfig.totalQuestions,
                competencies: areaConfig.competencies
            };
        }
    }

    return null;
}

/**
 * Obtiene recomendaciones personalizadas según el nivel actual
 */
export function getPersonalizedRecommendations(areaName, currentScore) {
    const currentLevel = getPerformanceLevel(areaName, currentScore);
    if (!currentLevel) return [];

    const recommendations = [...currentLevel.recommendations];

    // Si no está en el nivel máximo, agregar recomendaciones del siguiente nivel
    const areaConfig = PERFORMANCE_LEVELS[areaName];
    const nextLevel = areaConfig.levels[currentLevel.level + 1];

    if (nextLevel) {
        recommendations.push({
            type: 'next_level',
            title: `Para alcanzar ${nextLevel.title}:`,
            items: nextLevel.competencies.slice(0, 2)
        });
    }

    return recommendations;
}

/**
 * Calcula el puntaje global según la ponderación ICFES oficial
 */
export function calculateGlobalScore(scores) {
    // Ponderación oficial ICFES 2026
    const weights = {
        'matematicas': 0.30,
        'lectura critica': 0.30,
        'sociales y ciudadanas': 0.175,
        'ciencias naturales': 0.175,
        'ingles': 0.05
    };

    let weightedSum = 0;
    let totalWeight = 0;

    for (const [area, weight] of Object.entries(weights)) {
        if (scores[area] !== undefined) {
            weightedSum += scores[area] * weight;
            totalWeight += weight;
        }
    }

    // Escala de 0-100 a 0-500
    const normalizedScore = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
    return Math.round(normalizedScore * 5);
}

/**
 * Obtiene el rango de desempeño global según ICFES
 */
export function getGlobalPerformanceRange(globalScore) {
    if (globalScore >= 0 && globalScore <= 200) {
        return {
            range: '0-200',
            title: 'Rango Crítico',
            color: 'red',
            description: 'Vacíos fundamentales en lectura y operaciones básicas. Riesgo de no comprender enunciados.',
            focus: '60% Lectura Transversal / 20% Matemáticas Fundamentales / 20% Vocabulario Inglés',
            priority: [
                'Entrenamiento intensivo en lectura literal: extracción de datos explícitos en textos cortos',
                'Refuerzo de operaciones básicas: suma, resta, multiplicación, división, fracciones y porcentajes',
                'Memorización de las 500 palabras más frecuentes del inglés'
            ]
        };
    } else if (globalScore >= 201 && globalScore <= 300) {
        return {
            range: '201-300',
            title: 'Rango de Desarrollo',
            color: 'amber',
            description: 'Nociones básicas presentes pero carece de profundidad conceptual o habilidades inferenciales.',
            focus: '40% Conceptos Disciplinares (Ciencias/Sociales) / 30% Inferencia Lectora / 30% Resolución de Problemas',
            priority: [
                'Estudio de temas nucleares de Ciencias y Sociales (ver Niveles 2 y 3)',
                'Práctica de lectura inferencial: identificar tesis, argumentos e intenciones',
                'Dominio de regla de tres, geometría básica y lectura de gráficas estadísticas'
            ]
        };
    } else if (globalScore >= 301 && globalScore <= 380) {
        return {
            range: '301-380',
            title: 'Rango de Consolidación',
            color: 'cyan',
            description: 'Buen nivel de competencia. Errores asociados a detalles finos, conceptos complejos o gestión del tiempo.',
            focus: '50% Nivel 4 en todas las áreas / 30% Inglés Gramatical / 20% Velocidad',
            priority: [
                'Estudio de temas filtro: Probabilidad condicional, Física mecánica, Química estequiométrica, Filosofía',
                'Refinamiento de gramática inglesa (Tiempos perfectos, voz pasiva, condicionales)',
                'Simulacros con tiempo reducido para mejorar la velocidad de respuesta'
            ]
        };
    } else {
        return {
            range: '381-500',
            title: 'Rango de Excelencia',
            color: 'emerald',
            description: 'Dominio conceptual alto. Búsqueda de perfección y becas de alto nivel.',
            focus: 'Perfeccionamiento de habilidades de pensamiento crítico y sistémico',
            priority: [
                'Análisis de textos filosóficos densos y gráficas científicas atípicas',
                'Resolución de problemas de modelación matemática avanzada',
                'Análisis intertextual y evaluación crítica de fuentes en Sociales',
                'Inglés nivel B+ (Lectura de textos auténticos académicos)'
            ]
        };
    }
}
