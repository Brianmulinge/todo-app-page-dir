import { Edit, Trash } from "lucide-react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Checkbox } from "../components/checkbox";
import { trpc } from "@/server/utils/trpc";
import { useState } from "react";

type todoProps = {
  todoId: string;
  todoTitle: string;
  isCompleted: boolean;
};

export default function Home(todos: todoProps) {
  const utils = trpc.useContext();
  const [todotitle, setTodoTitle] = useState("");
  const [isCompleted, setIsComplete] = useState(false);

  //getTodo
  const todo = trpc.todo.gettodo.useQuery();
  //createTodo
  const newtodo = trpc.todo.createtodo.useMutation({
    onSuccess: () => {
      utils.todo.gettodo.invalidate();
    },
  });
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    newtodo.mutate({ todotitle, isCompleted });
    setTodoTitle("");
    setIsComplete(false);
  }

  //updateTodo

  //deleteTodo
  const {mutate:removetodo} = trpc.todo.deletetodo.useMutation({
    onSuccess: () => {
      utils.todo.invalidate();
    },
  });

  return (
    <main className="relative container mx-auto flex flex-col text-center p-4 w-full min-h-screen">
      <div className="">
        <h1 className="p-4 text-lg font-semibold">Organize Me</h1>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input onChange={(e) => setTodoTitle(e.target.value)} />
          <Button className="flex whitespace-nowrap">Add todo</Button>
        </form>
      </div>
      <div>
        {todo.data?.map((todo) => (
          <div className="flex p-2 h-full w-full" key={todo.todoId}>
            <div className="flex border w-full items-center justify-between p-4 rounded-lg">
              <div className="flex space-x-2 items-center">
                <Checkbox className="hidden" id={todo.todoId} />
                <h1
                  className={`text-lg space-y-2 ${
                    todo.isCompleted
                      ? "line-through text-red-700"
                      : "text-green-700"
                  }`}
                >
                  {todo.todotitle}
                </h1>
              </div>
              <div className="flex space-x-4 items-center">
                <Edit className="hidden cursor-pointer" />
                <Trash onClick={()=>removetodo(todo.todoId)} className="cursor-pointer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
