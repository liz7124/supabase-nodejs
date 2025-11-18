import { supabase } from '../db.js'

// CREATE
export async function createStudent(req, res) {
  const { name, major, gpa } = req.body
  const { data, error } = await supabase
    .from('students')
    .insert([{ name, major, gpa }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json(data)
}

// READ ALL
export async function getStudents(req, res) {
  const { data, error } = await supabase
    .from('students')
    .select('*')

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}

// READ ONE
export async function getStudentById(req, res) {
  const { id } = req.params
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ error: 'Student not found' })
  res.json(data)
}

// UPDATE
export async function updateStudent(req, res) {
  const { id } = req.params
  const { name, major, gpa } = req.body

  const { data, error } = await supabase
    .from('students')
    .update({ name, major, gpa })
    .eq('id', id)
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
}

// DELETE
export async function deleteStudent(req, res) {
  const { id } = req.params
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)

  if (error) return res.status(400).json({ error: error.message })
  res.status(204).send()
}
