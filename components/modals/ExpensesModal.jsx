"use client"
import { useContext, useState, useRef } from "react";
import Modal from "../Modal";
import { financeContext } from "@/lib/store/finance-context";
import { v4 } from "uuid";
import { toast } from "react-toastify";

export default function AddExpensesModal({show, onClose}) {
    const [expenseAmount, setExpenseAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showAddExpense, setShowAddExpense] = useState(false);

    const { expensesList, addExpenseItem, addCategory } = useContext(financeContext);

    const titleRef = useRef();
    const colorRef = useRef();

    const addExpenseItemHandler = async() => {

        const expense = expensesList.find(e => {
            return e.id === selectedCategory
        })
        const newExpense = {
            color: expense.color,
            title: expense.title,
            amount: expense.amount + +expenseAmount,
            items: [
                ...expense.items, 
                {
                    amount: expenseAmount,
                    createdAt: new Date(),
                    id: v4(),
                }
            ]
        }

        try {
            await addExpenseItem(selectedCategory, newExpense);
    
            console.log(newExpense);
            setExpenseAmount("")
            setSelectedCategory(null);
            onClose();
            toast.success("Expense Item Added!")
        } catch (error) {
            toast.error(error.message);
            throw error
        }
    }

    const addCategoryHandler = async () => {
        const title = titleRef.current.value;
        const color = colorRef.current.value;

        try {
            await addCategory({title, color, amount: 0});
            setShowAddExpense(false);
            toast.success("Category created!");
        } catch (error) {
            toast.error(error.message);
            throw error
        }
    }

    return (
        <Modal show={show} onClose={onClose}>
            <div className="flex flex-col gap-4">
                <label htmlFor="amount">Enter an amount...</label>
                <input 
                    type="number" 
                    name="amount"
                    min={0.01}
                    step={0.01}
                    placeholder="Enter Expense Amount"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                />
            </div>

            {/* expense Category */}
            {
                expenseAmount > 0 && (
                    <div className="flex flex-col gap-4 mt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl capitalize">Select expense category</h3>
                            <button onClick={() => {setShowAddExpense(true)}} className="text-lime-400">+ New Category</button>
                        </div>

                        {
                            showAddExpense && (
                                <div className="flex items-center justify-between">
                                    <input 
                                        type="text"
                                        placeholder="Enter Title"
                                        ref={titleRef}
                                    />

                                    <label htmlFor="color">Pick Color</label>
                                    <input 
                                        type="color" 
                                        ref={colorRef}
                                        className="w-24 h-10"
                                    /> 

                                    <button onClick={addCategoryHandler} className="btn btn-primary-outline">Create</button>
                                    <button onClick={() => {setShowAddExpense(false)}} className="btn btn-danger">Cancel</button>
                                </div>
                            )
                        }

                        {expensesList.map((expense) => {
                            return (
                                <button onClick={() => { setSelectedCategory(expense.id)}} key={expense.id}>
                                    <div style={{
                                        boxShadow: expense.id === selectedCategory ? "1px 1px 4px": "none"
                                    }} className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl">
                                        <div className="flex items-center gap-2">
                                            <div 
                                                key={expense.id}
                                                className="w-[25px] h-[25px] rounded-full"
                                                style={{
                                                    backgroundColor: expense.color,
                                                }}
                                            />
                                            <h4 className="capitalize"> {expense.title} </h4>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )
            }

            {
                expenseAmount > 0 && selectedCategory && (
                    <div className="mt-6">
                        <button 
                        className="btn btn-primary"
                        onClick={() => addExpenseItemHandler()}
                        >
                            Add Expense
                        </button>
                    </div>
                )
            }
        </Modal>
    );
}