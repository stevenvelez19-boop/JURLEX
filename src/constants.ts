import { LegalResource, HistoricalEra } from './types';

export const NICARAGUA_RESOURCES: LegalResource[] = [
  {
    id: 'ni-const',
    title: 'Constitución Política',
    description: '1987 (reformas 1995, 2000, 2005, 2014)',
    type: 'Constitution',
    content: 'Ley suprema del Estado nicaragüense. Establece la organización del Estado, los derechos y garantías de los ciudadanos...',
    importantArticles: [
      { number: 'Art. 1', summary: 'La independencia, la soberanía y la autodeterminación nacional son derechos irrenunciables del pueblo.' },
      { number: 'Art. 2', summary: 'El poder soberano reside en el pueblo, quien lo ejerce a través de la democracia directa y representativa.' },
      { number: 'Art. 23', summary: 'El derecho a la vida es inviolable. No hay pena de muerte en Nicaragua.' },
      { number: 'Art. 26', summary: 'Toda persona tiene derecho a su vida privada, a la de su familia, a la inviolabilidad de su domicilio y correspondencia.' },
      { number: 'Art. 33', summary: 'Derecho a la libertad individual. Nadie puede ser detenido arbitrariamente.' },
      { number: 'Art. 34', summary: 'Derecho a las garantías mínimas del debido proceso y presunción de inocencia.' },
      { number: 'Art. 129', summary: 'Los Poderes Legislativo, Ejecutivo, Judicial y Electoral son independientes entre sí.' }
    ]
  },
  {
    id: 'ni-cc',
    title: 'Código Civil',
    description: '1904 (vigente con reformas)',
    type: 'Code',
    content: 'Cuerpo normativo que regula las relaciones jurídicas entre personas, propiedad, contratos y sucesiones...',
    importantArticles: [
      { number: 'Art. 1', summary: 'La ley es obligatoria para todos los habitantes de la República.' },
      { number: 'Art. 18', summary: 'La existencia de las personas termina con la muerte.' },
      { number: 'Art. 610', summary: 'El dominio es el derecho de poseer exclusivamente una cosa y disponer de ella.' },
      { number: 'Art. 2435', summary: 'La hipoteca es un derecho real constituido sobre bienes inmuebles.' },
      { number: 'Art. 2483', summary: 'El contrato es una convención por la cual una o muchas personas se obligan.' }
    ]
  },
  {
    id: 'ni-cp',
    title: 'Código Penal',
    description: 'Ley 641 (2007, vigente con reformas)',
    type: 'Code',
    content: 'Define los delitos, las penas y las medidas de seguridad aplicables en Nicaragua...',
    importantArticles: [
      { number: 'Art. 1', summary: 'Principio de Legalidad: Nadie podrá ser condenado por acciones u omisiones que no estén previstas como delitos.' },
      { number: 'Art. 24', summary: 'Son responsables criminalmente de los delitos los autores y los cómplices.' },
      { number: 'Art. 109', summary: 'Homicidio simple: El que prive de la vida a otro será sancionado con pena de diez a quince años.' },
      { number: 'Art. 212', summary: 'Robo con intimidación en las personas.' }
    ]
  },
  {
    id: 'ni-cpc',
    title: 'Código Procesal Civil',
    description: 'Ley 902 (2015, vigente)',
    type: 'Procedural',
    content: 'Regula el proceso civil nicaragüense. Establece los procedimientos para litigios de carácter civil...',
    importantArticles: [
      { number: 'Art. 1', summary: 'Derecho de acceso a los juzgados y tribunales para la defensa de derechos e intereses legítimos.' },
      { number: 'Art. 13', summary: 'Principio de oralidad: Las actuaciones procesales se realizarán predominantemente de forma oral.' },
      { number: 'Art. 391', summary: 'Tipos de procesos: Proceso ordinario y proceso sumario.' }
    ]
  },
  {
    id: 'ni-ct',
    title: 'Código del Trabajo',
    description: 'Ley 185 (1996, vigente)',
    type: 'Code',
    content: 'Regula las relaciones laborales en Nicaragua. Establece los derechos y deberes de trabajadores y empleadores...',
    importantArticles: [
      { number: 'Art. 1', summary: 'El Código del Trabajo es de orden público y de aplicación obligatoria.' },
      { number: 'Art. 17', summary: 'El contrato de trabajo puede ser verbal o escrito.' },
      { number: 'Art. 45', summary: 'El empleador puede rescindir el contrato de trabajo por tiempo indeterminado pagando la indemnización.' },
      { number: 'Art. 76', summary: 'Derecho al décimo tercer mes o aguinaldo.' }
    ]
  },
  {
    id: 'ni-transito',
    title: 'Ley de Tránsito',
    description: 'Ley 431 (Ley para el Régimen de Circulación Vehicular)',
    type: 'Code',
    content: 'Regula la circulación de vehículos, peatones y pasajeros en las vías públicas de Nicaragua...',
    importantArticles: [
      { number: 'Art. 26', summary: 'Prohibición de conducir bajo los efectos del alcohol o sustancias psicotrópicas.' },
      { number: 'Art. 107', summary: 'Obligatoriedad del uso del cinturón de seguridad y casco protector para motociclistas.' },
      { number: 'Art. 131', summary: 'Clasificación de las infracciones de tránsito: Peligrosas, Muy Graves, Graves y Leves.' }
    ]
  },
  {
    id: 'ni-familia',
    title: 'Código de Familia',
    description: 'Ley 870 (2014, vigente)',
    type: 'Code',
    content: 'Regula las relaciones familiares, matrimonio, unión de hecho, parentesco y protección de menores...',
    importantArticles: [
      { number: 'Art. 1', summary: 'Protección de la familia como núcleo fundamental de la sociedad.' },
      { number: 'Art. 83', summary: 'Unión de hecho estable: Produce los mismos efectos que el matrimonio.' },
      { number: 'Art. 306', summary: 'Pensión alimenticia: Obligación de proporcionar sustento, habitación, vestido, educación y salud.' }
    ]
  }
];

export const HISTORICAL_ERAS: HistoricalEra[] = [
  {
    id: 'hist-meso',
    name: 'Mesopotamia',
    period: '2100 - 1750 a.C.',
    description: 'Surgimiento de las primeras leyes escritas en la historia de la humanidad.',
    keyContribution: 'Código de Hammurabi: Primer código de leyes escrito. Introdujo la Ley del Talión y la presunción de inocencia.',
    detailedInfo: 'En Mesopotamia, el derecho surgió de la necesidad de regular la vida en las primeras ciudades-estado. El Código de Hammurabi es un conjunto de 282 leyes inscritas en una estela de basalto. No solo regulaba delitos, sino también contratos comerciales, salarios y relaciones familiares.',
    legacy: ['Escritura de la ley', 'Ley del Talión (Ojo por ojo)', 'Responsabilidad profesional', 'Regulación del comercio']
  },
  {
    id: 'hist-egipto',
    name: 'Egipto Antiguo',
    period: '3100 - 30 a.C.',
    description: 'Derecho basado en la Maat (justicia, orden y verdad).',
    keyContribution: 'Concepto de Maat y la justicia divina administrada por el Faraón.',
    detailedInfo: 'El derecho egipcio era teocrático. El Faraón era la fuente de toda ley. Se centraba en la armonía social y el orden cósmico. Existían contratos de matrimonio, testamentos y registros de propiedad muy avanzados para su época.',
    legacy: ['Registros de propiedad', 'Contratos matrimoniales', 'Igualdad jurídica relativa de la mujer']
  },
  {
    id: 'hist-roma',
    name: 'Roma',
    period: '753 a.C. - 565 d.C.',
    description: 'La cuna del derecho occidental moderno y la jurisprudencia.',
    keyContribution: 'Ley de las XII Tablas y el Corpus Iuris Civilis de Justiniano.',
    detailedInfo: 'El derecho romano es la base de la mayoría de los sistemas jurídicos continentales. Evolucionó desde leyes consuetudinarias hasta un sistema complejo de jurisprudencia. Los romanos distinguieron entre el Ius Publicum (derecho público) y el Ius Privatum (derecho privado).',
    legacy: ['Persona jurídica', 'Contratos modernos', 'Derecho de propiedad', 'Debido proceso', 'Derecho de gentes (Ius Gentium)']
  },
  {
    id: 'hist-grecia',
    name: 'Grecia Antigua',
    period: '800 - 146 a.C.',
    description: 'Nacimiento de la democracia y el concepto de ley ciudadana.',
    keyContribution: 'Leyes de Solón y Dracón. Desarrollo de la retórica forense.',
    detailedInfo: 'En Atenas, la ley dejó de ser una imposición divina para ser un acuerdo entre ciudadanos. Se introdujo el juicio por jurado y la igualdad ante la ley (isonomía). Dracón escribió el primer código ateniense, famoso por su severidad.',
    legacy: ['Democracia directa', 'Juicio por jurado', 'Igualdad ante la ley', 'Retórica y argumentación jurídica']
  },
  {
    id: 'hist-francia',
    name: 'Francia (Napoleónico)',
    period: '1804',
    description: 'La codificación moderna que influyó en todo el mundo hispano.',
    keyContribution: 'Código Civil Francés (Código Napoleónico).',
    detailedInfo: 'Napoleón Bonaparte impulsó la creación de un código civil que unificara las leyes de Francia. Eliminó los privilegios feudales, garantizó la libertad individual y la propiedad privada. Es el modelo directo del Código Civil de Nicaragua.',
    legacy: ['Codificación sistemática', 'Laicismo jurídico', 'Libertad contractual']
  },
  {
    id: 'hist-china',
    name: 'China Imperial',
    period: '221 a.C. - 1912 d.C.',
    description: 'Sistema basado en el confucianismo y el legalismo.',
    keyContribution: 'Código Tang, considerado la obra maestra de la codificación china.',
    detailedInfo: 'El derecho chino imperial combinaba la moral confuciana con leyes estrictas (legalismo). El Código Tang influyó en todo el este de Asia, estableciendo una estructura jerárquica y una administración burocrática muy eficiente.',
    legacy: ['Administración burocrática', 'Derecho administrativo', 'Jerarquía familiar']
  },
  {
    id: 'hist-islam',
    name: 'Derecho Islámico (Sharia)',
    period: 'Siglo VII - Presente',
    description: 'Derecho basado en el Corán y la Sunna.',
    keyContribution: 'Desarrollo de contratos financieros y principios de justicia social.',
    detailedInfo: 'La Sharia abarca todos los aspectos de la vida, incluyendo el derecho civil y penal. Ha influido profundamente en el derecho comercial, introduciendo conceptos de equidad y prohibición de la usura.',
    legacy: ['Justicia social', 'Derecho comercial', 'Equidad contractual']
  }
];

export const NICARAGUA_ORGANIZATIONS = [
  {
    name: 'DIRAC',
    fullName: 'Dirección de Resolución Alterna de Conflictos',
    description: 'Órgano especializado del Poder Judicial encargado de promover la mediación y el arbitraje.',
    importance: 'Fundamental para descongestionar el sistema judicial mediante acuerdos extrajudiciales.'
  },
  {
    name: 'CSJ',
    fullName: 'Corte Suprema de Justicia',
    description: 'Máximo tribunal de justicia en Nicaragua, encargado de la administración del Poder Judicial.',
    importance: 'Ejerce el control constitucional y la casación en última instancia.'
  },
  {
    name: 'PGR',
    fullName: 'Procuraduría General de la República',
    description: 'Representante legal del Estado de Nicaragua en defensa de sus intereses y bienes.',
    importance: 'Vela por la legalidad de los actos del Estado y la recuperación de bienes estatales.'
  },
  {
    name: 'CGR',
    fullName: 'Contraloría General de la República',
    description: 'Órgano rector del sistema de control de la administración pública y fiscalización de bienes.',
    importance: 'Asegura la transparencia en el uso de los recursos públicos.'
  },
  {
    name: 'CSE',
    fullName: 'Consejo Supremo Electoral',
    description: 'Cuarto Poder del Estado, encargado de organizar y supervisar los procesos electorales.',
    importance: 'Garantiza el ejercicio del sufragio y la democracia representativa.'
  },
  {
    name: 'MIFAMILIA',
    fullName: 'Ministerio de la Familia, Adolescencia y Niñez',
    description: 'Institución encargada de la protección y promoción de los derechos de la familia y niñez.',
    importance: 'Ejecuta políticas públicas para la protección integral de la familia.'
  }
];

export const NICARAGUA_TERMINOLOGY = [
  {
    term: 'DIRAC',
    definition: 'Dirección de Resolución Alterna de Conflictos. Órgano del Poder Judicial para mediación.',
    context: 'Se menciona frecuentemente en procesos civiles y penales antes de llegar a juicio.'
  },
  {
    term: 'Escritura Pública',
    definition: 'Documento matriz extendido por un Notario Público en su protocolo.',
    context: 'Esencial para la compraventa de bienes inmuebles y constitución de sociedades.'
  },
  {
    term: 'Protocolo',
    definition: 'Libro o serie de libros donde el Notario asienta las escrituras públicas.',
    context: 'Propiedad del Estado, custodiado por el Notario bajo estricta responsabilidad.'
  },
  {
    term: 'Testimonio',
    definition: 'Copia fiel de la escritura matriz que el Notario entrega a los interesados.',
    context: 'Es el documento que se presenta ante los registros públicos para su inscripción.'
  },
  {
    term: 'Cartular',
    definition: 'Acción de ejercer el notariado, extendiendo documentos públicos.',
    context: 'Término muy común en el gremio de abogados nicaragüenses.'
  },
  {
    term: 'Quinquenio',
    definition: 'Período de cinco años, comúnmente referido a la vigencia del protocolo notarial.',
    context: 'Al finalizar, el Notario debe entregar sus protocolos al índice de la CSJ.'
  },
  {
    term: 'Gaceta',
    definition: 'La Gaceta, Diario Oficial de la República de Nicaragua.',
    context: 'Medio oficial donde se publican las leyes para que entren en vigencia.'
  },
  {
    term: 'Auto de Vista',
    definition: 'Resolución judicial que ordena la continuación del proceso tras una fase.',
    context: 'Se utiliza en procedimientos civiles para avanzar a la etapa probatoria.'
  },
  {
    term: 'Cédula Hipotecaria',
    definition: 'Título valor emitido por una entidad financiera garantizado con hipoteca.',
    context: 'Instrumento financiero regulado en el ámbito mercantil y bancario.'
  },
  {
    term: 'Medida Cautelar',
    definition: 'Acción judicial para asegurar la eficacia de una sentencia futura.',
    context: 'Común en procesos penales (prisión preventiva) y civiles (embargo preventivo).'
  }
];
