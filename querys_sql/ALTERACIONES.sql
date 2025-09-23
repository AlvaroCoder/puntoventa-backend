ALTER TABLE trabajadores ADD COLUMN contrasenna_hash VARCHAR(100);

ALTER TABLE `pipoappdatabase`.`tiendas` 
ADD COLUMN `id_usuario` INT NOT NULL AFTER `id_tienda`,
ADD INDEX `fktienda_usuario_idx` (`id_usuario` ASC) VISIBLE;
;
ALTER TABLE `pipoappdatabase`.`tiendas` 
ADD CONSTRAINT `fktienda_usuario`
  FOREIGN KEY (`id_usuario`)
  REFERENCES `pipoappdatabase`.`usuarios` (`id_usuario`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
