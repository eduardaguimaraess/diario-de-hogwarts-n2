import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { ScheduleClass } from '../../data/scheduleData.js';
import { database } from '../../database/connection.js';

interface ScheduleRow extends RowDataPacket, ScheduleClass {
  teacherId: number | null;
}

interface CountRow extends RowDataPacket {
  total: number;
}

interface ScheduleConflictRow extends RowDataPacket {
  id: string;
  professor: string;
  classroom: string;
}

interface TeacherRow extends RowDataPacket {
  id: number;
  name: string;
}

type ScheduleConflictInput = Pick<
  ScheduleClass,
  'professor' | 'classroom' | 'time' | 'dayOfWeek'
>;

const scheduleSelect = `
  SELECT s.id, s.subject, s.teacher_id AS teacherId,
         COALESCE(u.name, s.professor) AS professor,
         s.classroom, s.time, s.dayOfWeek
  FROM schedule s
  LEFT JOIN users u ON u.id = s.teacher_id`;

export async function findTeachers(): Promise<Array<{ id: number; name: string }>> {
  const [rows] = await database.query<TeacherRow[]>(
    `SELECT id, name
     FROM users
     WHERE role = 'teacher'
     ORDER BY name`
  );

  return rows.map(({ id, name }) => ({ id, name }));
}

export async function findTeacherById(
  id: number
): Promise<{ id: number; name: string } | undefined> {
  const [rows] = await database.execute<TeacherRow[]>(
    `SELECT id, name
     FROM users
     WHERE id = ? AND role = 'teacher'
     LIMIT 1`,
    [id]
  );

  const teacher = rows[0];
  return teacher ? { id: teacher.id, name: teacher.name } : undefined;
}

export async function findConflicts(
  item: ScheduleConflictInput,
  excludedId?: string
): Promise<ScheduleConflictRow[]> {
  const [rows] = await database.execute<ScheduleConflictRow[]>(
    `SELECT s.id, COALESCE(u.name, s.professor) AS professor, s.classroom
     FROM schedule s
     LEFT JOIN users u ON u.id = s.teacher_id
     WHERE LOWER(TRIM(s.dayOfWeek)) = LOWER(TRIM(?))
       AND LOWER(REPLACE(TRIM(s.time), ' ', '')) =
           LOWER(REPLACE(TRIM(?), ' ', ''))
       AND (? IS NULL OR s.id <> ?)
       AND (
         LOWER(TRIM(COALESCE(u.name, s.professor))) = LOWER(TRIM(?))
         OR LOWER(TRIM(s.classroom)) = LOWER(TRIM(?))
       )`,
    [
      item.dayOfWeek,
      item.time,
      excludedId ?? null,
      excludedId ?? null,
      item.professor,
      item.classroom
    ]
  );

  return rows;
}

export async function findAll(): Promise<ScheduleClass[]> {
  const [rows] = await database.query<ScheduleRow[]>(
    `${scheduleSelect} ORDER BY s.id`
  );
  return rows;
}

export async function findPaginated(
  page: number,
  limit: number,
  search: string
): Promise<{ data: ScheduleClass[]; total: number }> {
  const normalizedSearch = search.trim();
  const searchPattern = `%${normalizedSearch}%`;
  const offset = (page - 1) * limit;

  const [countRows] = await database.execute<CountRow[]>(
    `SELECT COUNT(*) AS total
     FROM schedule s
     LEFT JOIN users u ON u.id = s.teacher_id
     WHERE (? = '' OR s.subject LIKE ? OR COALESCE(u.name, s.professor) LIKE ?)`,
    [normalizedSearch, searchPattern, searchPattern]
  );

  const [rows] = await database.execute<ScheduleRow[]>(
    `${scheduleSelect}
     WHERE (? = '' OR s.subject LIKE ? OR COALESCE(u.name, s.professor) LIKE ?)
     ORDER BY s.id
     LIMIT ? OFFSET ?`,
    [normalizedSearch, searchPattern, searchPattern, limit, offset]
  );

  return { data: rows, total: Number(countRows[0]?.total ?? 0) };
}

export async function findById(
  id: string
): Promise<ScheduleClass | undefined> {
  const [rows] = await database.execute<ScheduleRow[]>(
    `${scheduleSelect} WHERE s.id = ?`,
    [id]
  );
  return rows[0];
}

export async function create(item: ScheduleClass): Promise<ScheduleClass> {
  await database.query<ResultSetHeader>(
    `INSERT INTO schedule
      (id, subject, professor, teacher_id, classroom, time, dayOfWeek)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      item.id,
      item.subject,
      item.professor,
      item.teacherId,
      item.classroom,
      item.time,
      item.dayOfWeek
    ]
  );
  return (await findById(item.id)) ?? item;
}

export async function update(
  id: string,
  item: ScheduleClass
): Promise<ScheduleClass | undefined> {
  await database.query<ResultSetHeader>(
    `UPDATE schedule
     SET subject = ?, professor = ?, teacher_id = ?, classroom = ?, time = ?, dayOfWeek = ?
     WHERE id = ?`,
    [
      item.subject,
      item.professor,
      item.teacherId ?? null,
      item.classroom,
      item.time,
      item.dayOfWeek,
      id
    ]
  );
  return findById(id);
}

export async function remove(id: string): Promise<boolean> {
  const [result] = await database.execute<ResultSetHeader>(
    'DELETE FROM schedule WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}
