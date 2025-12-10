import express from 'express'
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()
router.use(protect)

router.post('/', createStudent)
router.get('/', getStudents)
//router.get('/:id', getStudentById)
router.put('/:id', updateStudent)
router.delete('/:id', deleteStudent)

export default router