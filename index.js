import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

console.log("Connected to Supabase!")

async function insertStudent() {
  const { data, error } = await supabase
    .from('students')
    .insert([
      { name: 'Andi', major: 'Informatika', gpa: 3.8 },
      { name: 'Budi', major: 'Sistem Informasi', gpa: 3.6 },
    ])
  
  if (error) console.error('Insert error:', error)
  else console.log('Data inserted:', data)
}

//insertStudent()

async function getStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('*')

  if (error) console.error('Read error:', error)
  else console.log('Students:', data)
}

await getStudents()

async function updateStudent() {
  const { data, error } = await supabase
    .from('students')
    .update({ gpa: 3.9 })
    .eq('name', 'Andi')

  if (error) console.error('Update error:', error)
  else console.log('Updated:', data)
}

//await updateStudent()

async function deleteStudent() {
  const { data, error } = await supabase
    .from('students')
    .delete()
    .eq('name', 'Budi')

  if (error) console.error('Delete error:', error)
  else console.log('Deleted:', data)
}

await deleteStudent()

await getStudents()