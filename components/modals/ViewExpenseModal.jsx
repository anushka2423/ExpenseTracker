import { currencyFormatter } from "@/lib/utils";
import Modal from "../Modal";
import { FaRegTrashAlt } from "react-icons/fa";
import { useContext } from "react";
import { financeContext } from "@/lib/store/finance-context";
import { toast } from "react-toastify";

function ViewExpenseModal({show, onClose, expense}) {
    const {deleteExpenseItem, deleteExpenseCategory} = useContext(financeContext);
    const deleteExpenseItemHandler = async(item) => {
        try {
            const updateItems = expense.items.filter((i) => i.id !== item.id);
            const updatedExpense = {
                items: [...updateItems],
                amount: expense.amount - item.amount,
            };

            await deleteExpenseItem(updatedExpense, expense.id);
            toast.success("Expense Item Removed Successfully!")

        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }

    const deleteExpenseHandler = async () => {
        try {
            await deleteExpenseCategory(expense.id);
            toast.success("Expense Category deleted Successfully!")
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }
    return (
        <Modal show={show} onClose={onClose}>
            <div className="flex items-center justify-between">
                <h2 className="text-4xl">{expense.title}</h2>
                <button onClick={deleteExpenseHandler} className="btn btn-danger">Delete</button>
            </div>

            <div>
                <h3 className="my-4 text-2xl">Expense History</h3>
                { expense.items.map((item) => {
                    return <div key={item.id} className="flex items-center justify-between">
                        <small>{item.createdAt.toMillis ? new Date(item.createdAt.toMillis()).toISOString() : item.createdAt.toISOString()}</small>
                        <p className="flex items-center gap-2">
                            {currencyFormatter(item.amount)} 
                        </p>
                        <button onClick={() => deleteExpenseItemHandler(item)}>
                            <FaRegTrashAlt/>
                        </button>
                    </div>
                })
                }
            </div>
        </Modal>
    );
}

export default ViewExpenseModal;