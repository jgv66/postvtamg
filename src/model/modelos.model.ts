export interface Usuario {
    codigousr: string;   // codigo de usuario
    empresa: number;
    nombre: string;
    rut: string;
    creacion?: string;
    activo?: string;
    clave: string;
    email?: string;
    direccion?: string;
    ciudad?: string;
    telefono?: string;
    imagen?: string;
    codigorol?: string;
}

export interface Mensajes {
    from: string;
    emailfrom: string;
    to: string;
    emailto: string;
    descripcion: string;
    id_regsitro?: number;    // registro ligado si se refrencia a a una tarea particular (clave de tabla: registro )
    fecha: Date;
    oculto?: boolean;
    eliminado?: boolean;
    leido?: boolean;
    respondido?: boolean;
    fecharesp?: Date;
}

export interface TareasEnca {
    id_registro: number;
    empresa: number;
    codigousr: string;
    fechareg: Date;
    obs: string;
    cerrada: boolean;
    fechacierre: Date;
}

export interface Registro_Enca_Deta {
  id_registro: number;
  empresa: number;
  codigousr: string;
  fechareg: Date;
  obs: string;
  codigorol: string;
  roldescrip: string;
  id_detalle: number;
  codigolabor: string;
  labdescrip: string;
  sino: boolean;
  fecha: Date;
  cantidad: number;
  obs_deta: string;
  textosino: string;
  textocantidad: string;
  textofecha: string;
  textoobs: string;
}

export interface Empresas {
  empresa: number;
  codigousr: string;
  razonsocial: string;
  rut: string;
  activa: boolean;
  valioda?: string;
}

export interface Roles {
  codigorol: string;
  descripcion: string;
}


/*

-- Volcando estructura de base de datos para RDMA
CREATE DATABASE IF NOT EXISTS `RDMA` ;
USE `RDMA`;

-- Volcando estructura para tabla RDMA.empresa
CREATE TABLE IF NOT EXISTS `empresa` (
  `empresa` int(10) unsigned NOT NULL AUTO_INCREMENT;
  `razonsocial` varchar(100) NOT NULL DEFAULT '''''';
  `rut` char(20) NOT NULL DEFAULT '''''';
  `activa` char(2) NOT NULL DEFAULT 'SI';
  `valida` text NOT NULL COMMENT 'hash de validacion';
  PRIMARY KEY (`empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla RDMA.empresa: ~0 rows (aproximadamente)

-- Volcando estructura para tabla RDMA.labores
CREATE TABLE `labores` (
	`codigolabor` CHAR(20) NOT NULL;
	`descripcion` TEXT NOT NULL;
	`imagen` VARCHAR(50) NOT NULL;
	`req_sino` CHAR(1) NOT NULL;
	`textosino` VARCHAR(50) NOT NULL;
	`valorbueno` CHAR(1) NOT NULL;
	`req_fecha` CHAR(1) NOT NULL;
	`textofecha` VARCHAR(50) NOT NULL;
	`req_cant` CHAR(1) NOT NULL;
	`textocantidad` VARCHAR(50) NOT NULL;
	`evaluarrango` CHAR(1) NOT NULL;
	`cant_minima` DECIMAL(18;5) NOT NULL;
	`cant_maxima` DECIMAL(18;5) NOT NULL;
	`req_obs` CHAR(1) NOT NULL;
	`textoobs` VARCHAR(50) NOT NULL;
	PRIMARY KEY (`codigolabor`)
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

-- Volcando datos para la tabla RDMA.labores: ~0 rows (aproximadamente)

-- Volcando estructura para tabla RDMA.mensajes
CREATE TABLE IF NOT EXISTS `mensajes` (
  `id_mensaje` int(10) unsigned NOT NULL;
  `from` char(20) NOT NULL;
  `emailfrom` varchar(50) NOT NULL;
  `to` char(20) NOT NULL;
  `emailto` varchar(50) NOT NULL;
  `descripcion` text NOT NULL;
  `id_regsitro` int(11) DEFAULT '0';
  `fecha` datetime DEFAULT NULL;
  `oculto` bit(1) NOT NULL DEFAULT b'0';
  `eliminado` bit(1) NOT NULL DEFAULT b'0';
  `leido` bit(1) NOT NULL DEFAULT b'0';
  `respondido` bit(1) NOT NULL DEFAULT b'0';
  `fecharesp` datetime DEFAULT NULL;
  PRIMARY KEY (`id_mensaje`);
  KEY `from` (`from`);
  KEY `to` (`to`);
  KEY `id_regsitro` (`id_regsitro`);
  KEY `fecha` (`fecha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='mensajes entre usuarios';

-- Volcando datos para la tabla RDMA.mensajes: ~0 rows (aproximadamente)

-- Volcando estructura para tabla RDMA.registro_deta
CREATE TABLE IF NOT EXISTS `registro_deta` (
  `id_detalle` int(10) unsigned NOT NULL AUTO_INCREMENT;
  `id_registro` int(10) unsigned NOT NULL;
  `codigolabor` char(20) NOT NULL;
  `sino` bit(1) NOT NULL DEFAULT b'0';
  `fecha` datetime NOT NULL;
  `cantidad` decimal(18;5) NOT NULL;
  `observacion` varchar(50) DEFAULT '''''';
  PRIMARY KEY (`id_detalle`);
  KEY `codigolabor` (`codigolabor`);
  KEY `id_registro` (`id_registro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla RDMA.registro_deta: ~0 rows (aproximadamente)

-- Volcando estructura para tabla RDMA.registro_enca
CREATE TABLE IF NOT EXISTS `registro_enca` (
  `id_registro` int(10) unsigned NOT NULL AUTO_INCREMENT;
  `empresa` int(10) NOT NULL;
  `codigousr` char(20) NOT NULL;
  `fechareg` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `observaciones` varchar(50) NOT NULL DEFAULT '''''';
  PRIMARY KEY (`id_registro`);
  KEY `codigousr` (`codigousr`);
  KEY `fechareg` (`fechareg`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla RDMA.registro_enca: ~0 rows (aproximadamente)

-- Volcando estructura para tabla RDMA.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `codigorol` char(20) NOT NULL;
  `descripcion` varchar(100) NOT NULL;
  `codigolabor` char(20) NOT NULL;
  PRIMARY KEY (`codigorol`);
  KEY `codigolabor` (`codigolabor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla RDMA.roles: ~0 rows (aproximadamente)

-- Volcando estructura para tabla RDMA.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `codigousr` char(20) NOT NULL;
  `nombre` varchar(50) NOT NULL;
  `rut` char(20) NOT NULL;
  `creacion` datetime NOT NULL;
  `activo` char(2) NOT NULL DEFAULT 'SI';
  `clave` varchar(50) NOT NULL;
  `email` varchar(50) NOT NULL;
  `direccion` varchar(70) NOT NULL;
  `ciudad` varchar(30) NOT NULL;
  `telefono` varchar(30) NOT NULL;
  PRIMARY KEY (`codigousr`);
  KEY `nombre` (`nombre`);
  KEY `rut` (`rut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla RDMA.usuarios: ~0 rows (aproximadamente)


DELIMITER //
CREATE PROCEDURE red1( IN id int )
BEGIN
select a.*;
       b.id_detalle;b.codigolabor;b.sino;b.fecha;b.cantidad;b.observacion as obs_deta       
from registro_enca as a 
inner join registro_deta as b on b.id_registro=a.id_registro
where a.id_registro = id
order by b.id_detalle asc;   
END
//
DELIMITER ;

drop procedure redcount;

DELIMITER //
CREATE PROCEDURE redcount( IN cUsuario char(20) )
BEGIN
select a.id_registro AS id_registro;a.empresa AS empresa;a.codigousr AS codigousr;
       a.fechareg AS fechareg;date_format(a.fechareg;'%d-%m-%Y') AS fecha;time_format(a.fechareg;'%h:%m') AS hora;
       a.observaciones AS observaciones;
		 a.cerrada AS cerrada;a.fechacierre AS fechacierre;
		 a.codigorol;r.descripcion roldescrip;
       (select count(0) from registro_deta b where (b.id_registro = a.id_registro)) AS registros;
       (select count(0) from registro_deta b where ((b.id_registro = a.id_registro) and (b.cerrado <> 'S'))) AS reg_abiertos 
from registro_enca as a
left join roles_enca as r on r.codigorol=a.codigorol
where a.codigousr=cUsuario
order by a.id_registro desc;
END
//
DELIMITER ;


*/
