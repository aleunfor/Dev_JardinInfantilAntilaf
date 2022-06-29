-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-10-2021 a las 22:14:17
-- Versión del servidor: 10.4.19-MariaDB
-- Versión de PHP: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `jardin_antilaf`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `idcomentario` int(11) NOT NULL,
  `comentario` varchar(250) DEFAULT NULL,
  `comunicado_idcomunicado` int(11) NOT NULL,
  `usuario_idusuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comunicado`
--

CREATE TABLE `comunicado` (
  `idcomunicado` int(11) NOT NULL,
  `titulo` varchar(45) DEFAULT NULL,
  `subtitulo` varchar(45) DEFAULT NULL,
  `comunicado` longtext DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT NULL,
  `autor` varchar(45) DEFAULT NULL,
  `idusuario` int(11) NOT NULL,
  `nivel_idnivel` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `comunicado`
--

INSERT INTO `comunicado` (`idcomunicado`, `titulo`, `subtitulo`, `comunicado`, `fecha_creacion`, `autor`, `idusuario`, `nivel_idnivel`) VALUES
(1, 'Primer Comunicado', 'Subtitulo', '<p>Contenido comunicado</p>', '2021-06-10 20:01:21', 'Administrador Antilaf', 1, 2),
(3, 'Titulo', 'Subtitulo', '<p><img alt=\"\" src=\"/uploads/perfil.jpg\" style=\"height:500px; width:500px\" /></p>\r\n\r\n<p>Hola</p>\r\n', '2021-06-13 01:45:57', 'Administrador Antilaf', 1, 2),
(5, 'Ejemplo Comunicado 06-07-2021', 'Subtitulo', '<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n', '2021-07-06 21:38:26', 'Administrador Antilaf', 1, 1),
(6, 'asdasd', 'fddfgdfg', '<p>sdfsdf</p>\r\n', '2021-07-06 21:40:22', 'Administrador Antilaf', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nivel`
--

CREATE TABLE `nivel` (
  `idnivel` int(11) NOT NULL,
  `nombre` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `nivel`
--

INSERT INTO `nivel` (`idnivel`, `nombre`) VALUES
(1, 'Sala Cuna'),
(2, 'Nivel Medio');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niño`
--

CREATE TABLE `niño` (
  `rut` varchar(12) NOT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `edad` int(2) DEFAULT NULL,
  `fecha_nac` varchar(45) DEFAULT NULL,
  `sexo` varchar(45) DEFAULT NULL,
  `nivel_idnivel` int(11) NOT NULL,
  `usuario_idusuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `niño`
--

INSERT INTO `niño` (`rut`, `nombre`, `apellido`, `edad`, `fecha_nac`, `sexo`, `nivel_idnivel`, `usuario_idusuario`) VALUES
('26.387.469-2', 'Matilde', 'Arce Matamala', 3, '2018-07-25', 'Femenino', 1, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('4RFAuG7qpCWDl1CczQT7eXTlUe3euqLm', 1626134644, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{}}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_usuario`
--

CREATE TABLE `tipo_usuario` (
  `idtipo_usuario` int(11) NOT NULL,
  `nombre` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipo_usuario`
--

INSERT INTO `tipo_usuario` (`idtipo_usuario`, `nombre`) VALUES
(1, 'Administrador'),
(2, 'Directivo'),
(3, 'Parvularia'),
(4, 'Apoderado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idusuario` int(11) NOT NULL,
  `rut` varchar(12) NOT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `fecha_nac` varchar(45) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `telefono` int(9) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `id_tipousuario` int(11) NOT NULL,
  `activado` varchar(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idusuario`, `rut`, `nombre`, `apellido`, `fecha_nac`, `direccion`, `telefono`, `username`, `password`, `id_tipousuario`, `activado`) VALUES
(1, '777777777', 'Administrador', 'Antilaf', '2021-01-01', 'Pasaje 5 con Vista hermosa', 971028555, 'admin@gmail.com', '$2a$10$xZoNNWkDmUFd1TZnjJ3.mehYM44LWKR02i02TQlwyLhg77V.TmLIG', 1, 'Si'),
(4, '19.544.605-9', 'Alejandro', 'Hermosilla', '1996-11-17', 'Volcan maipo 14940, Casa', 999999999, 'alejandro.hermosilla@hotmail.com', '$2a$10$pXRx5crOXju2V1CsGjTUy.DfnECaK4YzsZCljsrr4itNFxabpA6xe', 4, 'Si');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`idcomentario`),
  ADD KEY `fk_comentario_comunicado1_idx` (`comunicado_idcomunicado`),
  ADD KEY `fk_comentario_usuario1_idx` (`usuario_idusuario`);

--
-- Indices de la tabla `comunicado`
--
ALTER TABLE `comunicado`
  ADD PRIMARY KEY (`idcomunicado`),
  ADD KEY `fk_comunicado_usuario_idx` (`idusuario`),
  ADD KEY `fk_comunicado_nivel1_idx` (`nivel_idnivel`);

--
-- Indices de la tabla `nivel`
--
ALTER TABLE `nivel`
  ADD PRIMARY KEY (`idnivel`);

--
-- Indices de la tabla `niño`
--
ALTER TABLE `niño`
  ADD PRIMARY KEY (`rut`),
  ADD KEY `fk_niño_nivel1_idx` (`nivel_idnivel`),
  ADD KEY `fk_niño_usuario1_idx` (`usuario_idusuario`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  ADD PRIMARY KEY (`idtipo_usuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idusuario`,`rut`,`username`),
  ADD KEY `fk_usuario_tipo_usuario1_idx` (`id_tipousuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `idcomentario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `comunicado`
--
ALTER TABLE `comunicado`
  MODIFY `idcomunicado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  MODIFY `idtipo_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idusuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `fk_comentario_comunicado1` FOREIGN KEY (`comunicado_idcomunicado`) REFERENCES `comunicado` (`idcomunicado`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_comentario_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `comunicado`
--
ALTER TABLE `comunicado`
  ADD CONSTRAINT `fk_comunicado_nivel1` FOREIGN KEY (`nivel_idnivel`) REFERENCES `nivel` (`idnivel`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_comunicado_usuario` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`idusuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `niño`
--
ALTER TABLE `niño`
  ADD CONSTRAINT `fk_niño_nivel1` FOREIGN KEY (`nivel_idnivel`) REFERENCES `nivel` (`idnivel`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_niño_usuario1` FOREIGN KEY (`usuario_idusuario`) REFERENCES `usuario` (`idusuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_tipo_usuario1` FOREIGN KEY (`id_tipousuario`) REFERENCES `tipo_usuario` (`idtipo_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
