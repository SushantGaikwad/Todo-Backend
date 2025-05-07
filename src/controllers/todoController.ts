import { Request, Response } from "express";
import Todo from "../models/Todo.model";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const getTodos = async (req: AuthRequest, res: Response) => {
  try {
    console.log("getTodo Handler Started");
    const todos = await Todo.find({ owner: req.user!.id });
    res.json(todos);
  } catch (error) {
    console.error("Error in getTodos :", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTodo = async (req: AuthRequest, res: Response) => {
  console.log("createTodo handler started");
  const { title, description, dueDate, status } = req.body;
  try {
    const todo = new Todo({
      title,
      description,
      dueDate,
      status,
      owner: req.user!.id,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error("Error in createTodos :", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTodo = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, dueDate, status } = req.body;
  try {
    const todo = await Todo.findOne({ _id: id, owner: req.user!.id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.dueDate = dueDate || todo.dueDate;
    todo.status = status || todo.status;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findOneAndDelete({ _id: id, owner: req.user!.id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
