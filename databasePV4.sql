-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-11-2022 a las 22:47:31
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `practica_voluntaria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aw_tareas_etiquetas`
--

CREATE TABLE `aw_tareas_etiquetas` (
  `idEtiqueta` int(11) NOT NULL,
  `texto` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `aw_tareas_etiquetas`
--

INSERT INTO `aw_tareas_etiquetas` (`idEtiqueta`, `texto`) VALUES
(6, 'Académico'),
(2, 'AW'),
(8, 'Básico'),
(7, 'Deporte'),
(9, 'gaming'),
(5, 'Personal'),
(4, 'Práctica'),
(3, 'TP'),
(1, 'Universidad');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aw_tareas_tareas`
--

CREATE TABLE `aw_tareas_tareas` (
  `idTarea` int(11) NOT NULL,
  `texto` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `aw_tareas_tareas`
--

INSERT INTO `aw_tareas_tareas` (`idTarea`, `texto`) VALUES
(7, 'Entregar Practica Vountaria 4'),
(5, 'Hablar con el profesor'),
(3, 'Ir al Supermercado'),
(4, 'Jugar al Fútbol'),
(8, 'Jugar ligoleyen'),
(2, 'Mirar fechas de congreso'),
(1, 'Preparar prácticas AW'),
(6, 'test');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aw_tareas_tareas_etiquetas`
--

CREATE TABLE `aw_tareas_tareas_etiquetas` (
  `idTarea` int(11) NOT NULL,
  `idEtiqueta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `aw_tareas_tareas_etiquetas`
--

INSERT INTO `aw_tareas_tareas_etiquetas` (`idTarea`, `idEtiqueta`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 6),
(3, 5),
(3, 6),
(4, 5),
(4, 7),
(5, 1),
(5, 3),
(7, 1),
(7, 2),
(8, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aw_tareas_user_tareas`
--

CREATE TABLE `aw_tareas_user_tareas` (
  `idUser` int(11) NOT NULL,
  `idTarea` int(11) NOT NULL,
  `hecho` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `aw_tareas_user_tareas`
--

INSERT INTO `aw_tareas_user_tareas` (`idUser`, `idTarea`, `hecho`) VALUES
(1, 1, 0),
(1, 2, 1),
(1, 3, 0),
(1, 4, 0),
(1, 5, 0),
(2, 3, 0),
(2, 4, 0),
(2, 5, 0),
(3, 1, 0),
(3, 2, 0),
(3, 3, 1),
(3, 4, 0),
(4, 1, 1),
(4, 2, 0),
(4, 3, 1),
(4, 4, 0),
(6, 3, 0),
(6, 7, 1),
(6, 8, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aw_tareas_usuarios`
--

CREATE TABLE `aw_tareas_usuarios` (
  `idUser` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(45) NOT NULL,
  `img` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `aw_tareas_usuarios`
--

INSERT INTO `aw_tareas_usuarios` (`idUser`, `email`, `password`, `img`) VALUES
(1, 'aitor.tilla@ucm.es', 'aitor', 'aitor.png'),
(2, 'felipe.lotas@ucm.es', 'felipe', 'felipe.png'),
(3, 'steve.curros@ucm.es', 'steve', 'steve.png'),
(4, 'bill.puertas@ucm.es', 'bill', 'bill.png'),
(6, 'usuario@ucm.es', 'usuario', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `aw_tareas_etiquetas`
--
ALTER TABLE `aw_tareas_etiquetas`
  ADD PRIMARY KEY (`idEtiqueta`),
  ADD UNIQUE KEY `texto` (`texto`);

--
-- Indices de la tabla `aw_tareas_tareas`
--
ALTER TABLE `aw_tareas_tareas`
  ADD PRIMARY KEY (`idTarea`),
  ADD UNIQUE KEY `texto` (`texto`);

--
-- Indices de la tabla `aw_tareas_tareas_etiquetas`
--
ALTER TABLE `aw_tareas_tareas_etiquetas`
  ADD PRIMARY KEY (`idTarea`,`idEtiqueta`),
  ADD KEY `FK_ETIQUETA` (`idEtiqueta`);

--
-- Indices de la tabla `aw_tareas_user_tareas`
--
ALTER TABLE `aw_tareas_user_tareas`
  ADD PRIMARY KEY (`idUser`,`idTarea`),
  ADD KEY `FK_TAREA` (`idTarea`);

--
-- Indices de la tabla `aw_tareas_usuarios`
--
ALTER TABLE `aw_tareas_usuarios`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `aw_tareas_etiquetas`
--
ALTER TABLE `aw_tareas_etiquetas`
  MODIFY `idEtiqueta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `aw_tareas_tareas`
--
ALTER TABLE `aw_tareas_tareas`
  MODIFY `idTarea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `aw_tareas_usuarios`
--
ALTER TABLE `aw_tareas_usuarios`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `aw_tareas_tareas_etiquetas`
--
ALTER TABLE `aw_tareas_tareas_etiquetas`
  ADD CONSTRAINT `FK_ETIQUETA` FOREIGN KEY (`idEtiqueta`) REFERENCES `aw_tareas_etiquetas` (`idEtiqueta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_TAREA2` FOREIGN KEY (`idTarea`) REFERENCES `aw_tareas_tareas` (`idTarea`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `aw_tareas_user_tareas`
--
ALTER TABLE `aw_tareas_user_tareas`
  ADD CONSTRAINT `FK_TAREA` FOREIGN KEY (`idTarea`) REFERENCES `aw_tareas_tareas` (`idTarea`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_USUARIO` FOREIGN KEY (`idUser`) REFERENCES `aw_tareas_usuarios` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
