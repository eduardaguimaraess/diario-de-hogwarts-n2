-- Execute uma única vez em bancos existentes, depois que a tabela users existir.
-- A coluna é nullable para preservar as aulas já cadastradas sem vínculo.
ALTER TABLE schedule
  ADD COLUMN teacher_id BIGINT UNSIGNED NULL AFTER professor,
  ADD INDEX idx_schedule_teacher_id (teacher_id),
  ADD CONSTRAINT fk_schedule_teacher
    FOREIGN KEY (teacher_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
