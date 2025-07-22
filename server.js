import express from "express"
import {PrismaClient} from "@prisma/client"
import cors from 'cors';

const app = express()
app.use(express.json())
app.use(cors())
const PORT = 3000
const prisma = new PrismaClient()

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await prisma.todo.findMany()
    
        res.status(200).json(tasks)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }
})

app.post("/task", async (req, res) => {
    try {
        await prisma.todo.create({
            data: {
                task: req.body.task,
            }
        })
        res.status(201).json(req.body)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }
})

app.delete("/task/:id", async (req, res) => {
    try {
        const deleteTask = await prisma.todo.delete({
            where: {
                id: req.params.id
            },
        }) 
        res.status(200).json(deleteTask)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }
})

app.delete("/task/deleteAll", async (req, res) => {
    try {
        const deleteTask = await prisma.todo.deleteMany()
        if (deleteTask.count === 0) {
            return res.status(404).json({message: "No tasks to delete"})
        }
        res.status(200).json(deleteTask)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }
})

app.patch("/task/:id", async(req, res) => {
    try {
        await prisma.todo.update({
            where: {
                id: req.params.id
            },
            data: {
                task: req.body.task
            }
        })
        res.status(200).json(req.body)
    } catch(error) {
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }
})

app.listen(PORT)